import axios, { axiosWrapper } from "utils/axios";
import { useQuery } from "react-query";

export const PROJECT_QUERIES = {
	getProjects: "projects.getProjects",
};

export async function getProjects() {
	const { data } = await axiosWrapper(axios.get, `/projects/`);
	return data;
}

export function useProjects() {
	return useQuery([PROJECT_QUERIES.getProjects], getProjects);
}
