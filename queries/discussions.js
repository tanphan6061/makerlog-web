import { default as axios, axiosWrapper } from "utils/axios";
import {
	useInfiniteQuery,
	useQuery,
	useMutation,
	useQueryClient,
} from "react-query";
import { getLogger } from "utils/logging";
import omit from "lodash/omit";

const log = getLogger("discussions");

export const DISCUSSION_QUERIES = {
	getLatestThreads: "discussions.getLatestThreads",
	getThread: "discussions.getThread",
	getThreadReplies: "discussions.getThreadReplies",
	getThreadRepliers: "discussions.getThreadRepliers",
};

export async function getLatestThreads({ pageParam: next = null }) {
	const { data } = await axiosWrapper(
		axios.get,
		next ? next : `/discussions/`
	);
	return data;
}

export async function getThreadReplies({ queryKey }) {
	const [_key, { slug }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		`/discussions/${slug}/replies/`
	);
	return data;
}

export async function getThreadRepliers({ queryKey }) {
	const [_key, { slug }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		`/discussions/${slug}/replies/people/?exclude_owner=true`
	);
	return data;
}

export async function getThread({ queryKey }) {
	const [_key, { slug }] = queryKey;
	const { data } = await axiosWrapper(axios.get, `/discussions/${slug}/`);
	return data;
}

export async function createThreadReply({ slug, body, parentReply = null }) {
	let payload = { body };
	if (parentReply) {
		payload.parent_reply = parentReply;
	}
	const response = await axiosWrapper(
		axios.post,
		`/discussions/${slug}/replies/`,
		payload
	);
	return response.data;
}

export async function updateThread({ slug, title, body }) {
	const response = await axiosWrapper(axios.patch, `/discussions/${slug}/`, {
		title,
		body,
	});
	return response.data;
}

export async function updateThreadReply({ slug, id, body }) {
	const response = await axiosWrapper(
		axios.patch,
		`/discussions/${slug}/replies/${id}/`,
		{ body }
	);
	return response.data;
}

export async function deleteThread({ slug }) {
	const response = await axiosWrapper(axios.delete, `/discussions/${slug}/`);
	return response.data;
}

export async function deleteThreadReply({ slug, id }) {
	const response = await axiosWrapper(
		axios.delete,
		`/discussions/${slug}/replies/${id}/`
	);
	return response.data;
}

export async function createThread({ title, body, type = "TEXT" }) {
	const response = await axiosWrapper(axios.post, `/discussions/`, {
		title,
		body,
		type,
	});
	return response.data;
}

export function useLatestThreads() {
	return useInfiniteQuery(
		DISCUSSION_QUERIES.getLatestThreads,
		getLatestThreads,
		{
			getNextPageParam: (lastGroup) => {
				return lastGroup.next;
			},
		}
	);
}

export function useThreadRepliers(slug, enabled = true) {
	const query = [DISCUSSION_QUERIES.getThreadRepliers, { slug }];
	return useQuery(query, getThreadRepliers, {
		staleTime: 1000 * 60 * 5,
		enabled,
	});
}

export function useThread(slug) {
	const query = [DISCUSSION_QUERIES.getThread, { slug }];
	return useQuery(query, getThread);
}

export function useThreadReplies(slug) {
	const query = [DISCUSSION_QUERIES.getThreadReplies, { slug }];
	return useQuery(query, getThreadReplies);
}

export function useCreateThread() {
	return useMutation(createThread, {
		onSuccess: (data) => {
			log(`Created new thread (#${data.slug})`);
		},
	});
}

export function useCreateThreadReply() {
	const queryClient = useQueryClient();

	return useMutation(createThreadReply, {
		onSuccess: (data) => {
			log(`Created new replt (#${data.id}, parent: ${data.parent})`);
			const slug = data.parent;
			queryClient.setQueryData(
				[DISCUSSION_QUERIES.getThreadReplies, { slug }],
				(oldData) => {
					if (!oldData) return [data];
					return [...oldData, data];
				}
			);
		},
	});
}

export function useUpdateThreadReply(slug) {
	const queryClient = useQueryClient();
	const query = [DISCUSSION_QUERIES.getThreadReplies, { slug }];

	return useMutation(updateThreadReply, {
		onMutate: ({ id, body }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousReplies = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				return old.map((reply) =>
					reply.id === id ? { ...reply, body } : reply
				);
			});

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousReplies);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to update reply. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(query);
		},
	});
}

export function useUpdateThread(slug) {
	const queryClient = useQueryClient();
	const query = [DISCUSSION_QUERIES.getThread, { slug }];

	return useMutation(updateThread, {
		onMutate: (payload) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousThread = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				if (!old) return old;
				return { ...old, ...omit(payload, "slug") };
			});

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousThread);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to update thread. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(query);
		},
	});
}

export function useDeleteThread() {
	const query = [DISCUSSION_QUERIES.getLatestThreads];

	const queryClient = useQueryClient();
	return useMutation(deleteThread, {
		onMutate: ({ slug }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousThreads = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				if (!old) return old;
				return old.filter((t) => t.slug !== slug);
			});

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousThreads);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to delete thread. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(query);
		},
	});
}

export function useDeleteThreadReply(slug) {
	const queryClient = useQueryClient();
	const query = [DISCUSSION_QUERIES.getThreadReplies, { slug }];

	return useMutation(deleteThreadReply, {
		onMutate: ({ id }) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousReplies = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) =>
				old.filter((reply) => reply.id !== id)
			);

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousReplies);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, payload, rollback) => {
			log(`Failed to delete reply. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries(query);
		},
	});
}
