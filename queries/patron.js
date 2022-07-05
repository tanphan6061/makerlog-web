import { useQuery } from "react-query";
import axios, { axiosWrapper } from "utils/axios";

export const PATRON_QUERIES = {
	getSubData: "patron.getSubData",
};

export async function getSubData() {
	const { data } = await axiosWrapper(axios.get, `/billing/subscription/`);
	return data;
}

export function useSubData() {
	return useQuery([PATRON_QUERIES.getSubData], getSubData);
}
