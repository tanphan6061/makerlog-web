import axios, { axiosWrapper } from "utils/axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getLogger } from "utils/logging";
import uniqBy from "lodash/uniqBy";

const log = getLogger("praise");

export const PRAISE_QUERIES = {
	getPraise: "praise.getPraise",
};

export async function getPraise({ queryKey }) {
	const [_key, { indexUrl }] = queryKey;
	const { data } = await axiosWrapper(axios.get, `${indexUrl}/praise/`);
	return data;
}

export async function setPraise(indexUrl) {
	const { data } = await axiosWrapper(axios.post, `${indexUrl}/praise/`);
	return data;
}

export function usePraise(indexUrl, enabled) {
	return useQuery([PRAISE_QUERIES.getPraise, { indexUrl }], getPraise, {
		staleTime: 1000 * 60 * 5,
		enabled,
	});
}

export function usePraiseMutation(initialCount, user) {
	const queryClient = useQueryClient();
	return useMutation(setPraise, {
		// When mutate is called:
		onMutate: (indexUrl) => {
			const query = [PRAISE_QUERIES.getPraise, { indexUrl }];
			log(`Praising ${indexUrl} optimisitically.`);
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries();

			// Snapshot the previous value
			const previousPraiseState = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				if (!old && initialCount === 0) {
					return {
						praised: true,
						praised_by: [user],
						total: 1,
					};
				} else if (!old) {
					return null;
				}
				// This ain't good.
				return {
					...old,
					praised: !old.praised,
					praised_by: !old.praised
						? old.praised_by === null || old.praised_by.length === 0
							? [user]
							: uniqBy([...old.praised_by, user], "id")
						: old.praised_by !== null && old.praised_by.length > 0
						? old.praised_by.filter((u) => u.id !== user.id)
						: old.praised_by,
					total: old.praised ? old.total - 1 : old.total + 1,
				};
			});

			// Return the snapshotted value
			return () => {
				queryClient.setQueryData(query, previousPraiseState);
			};
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, indexUrl, rollback) => {
			log(`Error praising.`, err);
			if (rollback) rollback();
		},
		onSettled: () => {
			// Honestly let's just not give a flying fuck and just keep it locally
			// queryClient.invalidateQueries(query);
		},
	});
}
