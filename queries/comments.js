import axios, { axiosWrapper } from "utils/axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getLogger } from "utils/logging";

const log = getLogger("commments");

export const COMMENT_QUERIES = {
	getComments: "comments.getComments",
};

export async function getComments({ queryKey }) {
	const [_key, { indexUrl }] = queryKey;
	const { data } = await axiosWrapper(axios.get, `${indexUrl}/comments/`);
	return data;
}

export async function createComment({ indexUrl, content }) {
	const { data } = await axiosWrapper(axios.post, `${indexUrl}/comments/`, {
		content,
	});
	return data;
}

export async function updateComment({ indexUrl, content, id }) {
	const { data } = await axiosWrapper(
		axios.patch,
		`${indexUrl}/comments/${id}/`,
		{
			content,
		}
	);
	return data;
}

export async function deleteComment({ indexUrl, id }) {
	const { data } = await axiosWrapper(
		axios.delete,
		`${indexUrl}/comments/${id}/`
	);
	return data;
}

export function useComments(indexUrl) {
	return useQuery([COMMENT_QUERIES.getComments, { indexUrl }], getComments);
}

export function useCreateComment(indexUrl, user) {
	const queryClient = useQueryClient();
	const query = [COMMENT_QUERIES.getComments, { indexUrl }];

	return useMutation(createComment, {
		onMutate: ({ content }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousComments = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				if (!old)
					return [
						{
							id: -1,
							user,
							content,
							created_at: new Date(),
						},
					];
				return [
					...old,
					{
						id: -1,
						user,
						content,
						created_at: new Date(),
					},
				];
			});

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousComments);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to create comment. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(query);
		},
	});
}

export function useUpdateComment(indexUrl) {
	const queryClient = useQueryClient();
	const query = [COMMENT_QUERIES.getComments, { indexUrl }];

	return useMutation(updateComment, {
		onMutate: ({ content, id }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousComments = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				return old.map((comment) =>
					comment.id === id ? { ...comment, content } : comment
				);
			});

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousComments);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to update comment. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(query);
		},
	});
}

export function useDeleteComment(indexUrl) {
	const queryClient = useQueryClient();
	const query = [COMMENT_QUERIES.getComments, { indexUrl }];

	return useMutation(deleteComment, {
		onMutate: ({ id }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousComments = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) =>
				old.filter((comment) => comment.id !== id)
			);

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousComments);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, payload, rollback) => {
			log(`Failed to delete comment. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(query);
		},
	});
}
