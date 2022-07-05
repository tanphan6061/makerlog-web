import axios, { axiosWrapper } from "utils/axios";
import { useInfiniteQuery } from "react-query";

export const SEARCH_QUERIES = {
	searchUsers: "search.searchUsers",
	searchProducts: "search.searchProducts",
	searchTasks: "search.searchTasks",
	searchDiscussions: "search.searchDiscussions",
};

export async function searchUsers({ pageParam: next = null, queryKey }) {
	const [_key, { query }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		next ? next : `/search/users/?q=${query}`
	);
	return data;
}

export async function searchProducts({ pageParam: next = null, queryKey }) {
	const [_key, { query }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		next ? next : `/search/products/?q=${query}`
	);
	return data;
}

export async function searchTasks({ pageParam: next = null, queryKey }) {
	const [_key, { query }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		next ? next : `/search/tasks/?q=${query}`
	);
	return data;
}

export async function searchDiscussions({ pageParam: next = null, queryKey }) {
	const [_key, { query }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		next ? next : `/search/discussions/?q=${query}`
	);
	return data;
}

export function useSearchUsers(query) {
	return useInfiniteQuery(
		[SEARCH_QUERIES.searchUsers, { query }],
		searchUsers,
		{
			enabled: query.length > 0,
			getNextPageParam: (lastGroup) => {
				return lastGroup.next;
			},
		}
	);
}

export function useSearchProducts(query) {
	return useInfiniteQuery(
		[SEARCH_QUERIES.searchProducts, { query }],
		searchProducts,
		{
			enabled: query.length > 0,
			getNextPageParam: (lastGroup) => {
				return lastGroup.next;
			},
		}
	);
}

export function useSearchTasks(query) {
	return useInfiniteQuery(
		[SEARCH_QUERIES.searchTasks, { query }],
		searchTasks,
		{
			enabled: query.length > 0,
			getNextPageParam: (lastGroup) => {
				return lastGroup.next;
			},
		}
	);
}

export function useSearchDiscussions(query) {
	return useInfiniteQuery(
		[SEARCH_QUERIES.searchDiscussions, { query }],
		searchDiscussions,
		{
			enabled: query.length > 0,
			getNextPageParam: (lastGroup) => {
				return lastGroup.next;
			},
		}
	);
}
