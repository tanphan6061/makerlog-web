import axios, { axiosWrapper } from "utils/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getLogger } from "utils/logging";
import uniqBy from "lodash/uniqBy";

const log = getLogger("commments");

export const TAGS_QUERIES = {
	getCommonTags: "tags.getCommonTags",
	getUserSkills: "tags.getUserSkills",
	getSuggestedTags: "tags.getSuggestedTags",
};

export async function getCommonTags({ queryKey }) {
	const [_key, { type }] = queryKey;
	const { data } = await axiosWrapper(axios.get, `/${type}/common_tags/`);
	return data;
}

export async function getSuggestedTags({ queryKey }) {
	const [_key, { type, query }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		`/${type}/suggest_tags/?q=${query}`
	);
	return data;
}

export async function getUserSkills({ queryKey }) {
	const [_key, { username }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		`/users/${username}/skills/`
	);
	return data;
}

export async function createSkill({ username, emoji, name }) {
	const { data } = await axiosWrapper(
		axios.post,
		`/users/${username}/skills/`,
		{ emoji, name }
	);
	return data;
}

export async function deleteSkill({ username, id }) {
	const { data } = await axiosWrapper(
		axios.delete,
		`/users/${username}/skills/`,
		{ data: { id } }
	);
	return data;
}

export function useCommonTags(type) {
	return useQuery([TAGS_QUERIES.getCommonTags, { type }], getCommonTags);
}

export function useUserSkills(username) {
	return useQuery([TAGS_QUERIES.getUserSkills, { username }], getUserSkills);
}

export function useSuggestedTags(type, query) {
	return useQuery(
		[TAGS_QUERIES.getSuggestedTags, { type, query }],
		getSuggestedTags
	);
}

export function useCreateSkill() {
	const queryClient = useQueryClient();

	return useMutation(createSkill, {
		onMutate: ({ username, name, emoji }) => {
			const query = [TAGS_QUERIES.getUserSkills, { username }];
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousSkills = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				return uniqBy([...old, { id: -1, name, emoji }], "name");
			});

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousSkills);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to create skill. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: (data, err, { username }) => {
			const query = [TAGS_QUERIES.getUserSkills, { username }];
			queryClient.invalidateQueries(query);
		},
	});
}

export function useDeleteSkill() {
	const queryClient = useQueryClient();

	return useMutation(deleteSkill, {
		onMutate: ({ username, id }) => {
			const query = [TAGS_QUERIES.getUserSkills, { username }];
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			queryClient.cancelQueries(query);

			// Snapshot the previous value
			const previousSkills = queryClient.getQueryData(query);

			// Optimistically update to the new value
			queryClient.setQueryData(query, (old) => {
				return old.filter((t) => t.id !== id);
			});

			// Return the snapshotted value
			return () => queryClient.setQueryData(query, previousSkills);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to delete skill. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: (data, err, { username }) => {
			const query = [TAGS_QUERIES.getUserSkills, { username }];
			queryClient.invalidateQueries(query);
		},
	});
}
