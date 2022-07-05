import { useMutation, useQuery } from "react-query";
import axios, { axiosWrapper } from "utils/axios";
import { getLogger } from "utils/logging";

const log = getLogger("reminders");

export const REMINDERS_QUERIES = {
	getReminders: "reminders.getReminders",
};

export async function getReminders() {
	const { data } = await axiosWrapper(axios.get, `/reminders/`);
	return data;
}

export async function createReminder({ type, frequency, time }) {
	const response = await axiosWrapper(axios.post, "/reminders/", {
		type,
		frequency,
		time,
	});
	return response.data;
}

export async function updateReminder({ id, payload }) {
	const response = await axiosWrapper(
		axios.patch,
		`/reminders/${id}/`,
		payload
	);
	return response.data;
}

export async function deleteReminder({ id }) {
	const response = await axiosWrapper(axios.delete, `/reminders/${id}`);
	return response.data;
}

export function useReminders() {
	return useQuery([REMINDERS_QUERIES.getReminders], getReminders, {
		staleTime: 1000 * 60 * 5,
	});
}

export function useCreateReminder() {
	return useMutation(createReminder, {
		onSuccess: (data) => {
			log(`Created reminder (#${JSON.stringify(data)})`);
		},
	});
}

export function useUpdateReminder() {
	return useMutation(updateReminder, {
		onSuccess: (data) => {
			log(`Updated reminder (#${JSON.stringify(data)})`);
		},
	});
}

export function useDeleteReminder() {
	return useMutation(deleteReminder, {
		onSuccess: (data) => {
			log(`Deleted reminder (#${JSON.stringify(data)})`);
		},
	});
}
