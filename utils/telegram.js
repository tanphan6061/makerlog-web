import axios, { axiosWrapper } from "~/utils/axios";

export async function linkTelegram(key) {
	const response = await axiosWrapper(axios.post, "/telegram/pair/", { key });
	return response.data;
}
