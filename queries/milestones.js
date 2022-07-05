import { default as axios, axiosWrapper } from "utils/axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getLogger } from "utils/logging";
import omit from "lodash/omit";

const log = getLogger("discussions");

export const MILESTONE_QUERIES = {
	getMilestone: "milestones.getMilestone",
	getUserMilestones: "milestones.getUserMilestones",
};

export async function getMilestone({ queryKey }) {
	const [_key, { slug }] = queryKey;
	const { data } = await axiosWrapper(axios.get, `/milestones/${slug}/`);
	return data;
}

export async function createMilestone({ title, body, product = null }) {
	const response = await axiosWrapper(axios.post, `/milestones/`, {
		title,
		body,
		product,
	});
	return response.data;
}

export async function updateMilestone({ slug, title, body, product = null }) {
	const response = await axiosWrapper(axios.patch, `/milestones/${slug}/`, {
		title,
		body,
		product,
	});
	return response.data;
}

export async function deleteMilestone({ slug }) {
	const response = await axiosWrapper(axios.delete, `/milestones/${slug}/`);
	return response.data;
}

export async function getUserMilestones({ queryKey }) {
	const [_key, { username }] = queryKey;
	const response = await axiosWrapper(
		axios.get,
		`/users/${username}/milestones/`
	);
	return response.data;
}

export function useMilestone(slug) {
	const query = [MILESTONE_QUERIES.getMilestone, { slug }];
	return useQuery(query, getMilestone);
}

export function useCreateMilestone() {
	return useMutation(createMilestone, {
		onSuccess: (data) => {
			log(`Created new milestone (#${data.slug})`);
		},
	});
}

export function useUpdateMilestone(milestone) {
	const queryClient = useQueryClient();
	const query = [MILESTONE_QUERIES.getMilestone, { slug: milestone.slug }];

	return useMutation(updateMilestone, {
		onMutate: (payload) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousMilestone = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				// otherwise product gets set to slug
				return { ...old, ...omit(payload, "product") };
			});

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousMilestone);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to update milestone. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(query);
		},
	});
}

export function useDeleteMilestone() {
	return useMutation(deleteMilestone);
}

export function useUserMilestones(username) {
	const query = [MILESTONE_QUERIES.getUserMilestones, { username }];
	return useQuery(query, getUserMilestones);
}
