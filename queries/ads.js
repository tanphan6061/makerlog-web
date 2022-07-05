import axios, { axiosWrapper } from "utils/axios";
import { useMutation, useQuery } from "react-query";
import { getLogger } from "utils/logging";

const log = getLogger("ads");

export const AD_QUERIES = {
	getAd: "ads.getAd",
};

export async function getAd() {
	const { data } = await axiosWrapper(axios.get, `/ads/serve/`);
	return data;
}

export async function createBooking(payload) {
	let data = new FormData();
	const headers = {
		"Content-Type": "multipart/form-data",
	};
	for (const [key, value] of Object.entries(payload)) {
		if (value === null) continue;
		data.append(key, value);
	}
	const response = await axiosWrapper(axios.post, "/ads/", data, {
		headers,
	});
	return response.data;
}

export function useAd() {
	return useQuery([AD_QUERIES.getAd], getAd, {
		staleTime: 1000 * 60 * 5,
	});
}

export function useCreateBooking() {
	return useMutation(createBooking, {
		onSuccess: (data) => {
			log(`Created new booking (#${JSON.stringify(data)})`);
		},
	});
}
