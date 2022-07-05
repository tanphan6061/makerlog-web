import { useMutation } from "react-query";
import axios, { axiosWrapper } from "utils/axios";

export const FEEDBACK_QUERIES = {};

export async function sendFeedback({ email, body }) {
	const { data } = await axiosWrapper(axios.post, `/feedback/send/`, {
		email,
		body,
	});
	return data;
}

export function useSendFeedback() {
	return useMutation(sendFeedback);
}
