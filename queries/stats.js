import axios, { axiosWrapper } from "utils/axios";
import { useQuery } from "react-query";

export const STATS_QUERIES = {
	getFrontpage: "stats.getFrontpage",
	getWorldStats: "stats.getWorldStats",
	getUserHeatmap: "stats.getUserHeatmap",
	getUserStats: "stats.getUserStats",
};

export async function getFrontpage() {
	// !!NOTICE!! Fragile code.
	const { data } = await axiosWrapper(axios.get, `/stats/world/popular/`);
	return { ...data };
}

export async function getWorldStats() {
	const { data } = await axiosWrapper(axios.get, `/stats/world/`);
	return data;
}

export async function getUserHeatmap({ queryKey }) {
	const [_key, { username }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		`/users/${username}/activity_graph/`
	);
	return data;
}

export async function getUserStats({ queryKey }) {
	const [_key, { username }] = queryKey;
	const { data } = await axiosWrapper(axios.get, `/users/${username}/stats/`);
	return data;
}

export function useFrontpage() {
	return useQuery([STATS_QUERIES.getFrontpage], getFrontpage);
}

export function useWorldStats() {
	return useQuery([STATS_QUERIES.getWorldStats], getWorldStats);
}

export function useUserHeatmap(username) {
	return useQuery(
		[STATS_QUERIES.getUserHeatmap, { username }],
		getUserHeatmap
	);
}

export function useUserStats(username) {
	return useQuery([STATS_QUERIES.getUserStats, { username }], getUserStats);
}
