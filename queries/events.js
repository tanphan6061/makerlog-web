import axios, { axiosWrapper } from "utils/axios";
import { useMutation, useQuery } from "react-query";

export const EVENTS_QUERIES = {
	getEvent: "events.getEvent",
	getUpcomingEvents: "events.getUpcomingEvents",
};

export async function createEvent(payload) {
	let data = new FormData();
	const headers = {
		"Content-Type": "multipart/form-data",
	};
	for (const [key, value] of Object.entries(payload)) {
		data.append(key, value);
	}
	const response = await axiosWrapper(axios.post, "/events/", data, {
		headers,
	});
	return response.data;
}

export async function getUpcomingEvents() {
	const { data } = await axiosWrapper(axios.get, `/events/upcoming/`);
	return data;
}

export async function getEvent({ queryKey }) {
	const [key, { slug }] = queryKey;
	const { data } = await axiosWrapper(axios.get, `/events/${slug}/`);
	return data;
}

export function useUpcomingEvents() {
	return useQuery([EVENTS_QUERIES.getUpcomingEvents], getUpcomingEvents);
}

export function useEvent(slug) {
	return useQuery([EVENTS_QUERIES.getEvent, { slug }], getEvent);
}

export function useCreateEvent() {
	return useMutation(createEvent);
}
