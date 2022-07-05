import axios, { axiosWrapper } from "utils/axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getLogger } from "utils/logging";
import { format } from "date-fns";

const log = getLogger("tasks");

export const TASK_QUERIES = {
	getTask: "tasks.getTask",
	getTasks: "tasks.getTasks",
	getTasksUserDay: "tasks.getTasksUserDay",
};

export async function getTask({ queryKey }) {
	const [_key, { id }] = queryKey;
	const { data } = await axiosWrapper(axios.get, `/tasks/${id}`);
	return data;
}

export async function createTask(payload) {
	let data = new FormData();
	const headers = {
		"Content-Type": "multipart/form-data",
	};
	for (const [key, value] of Object.entries(payload)) {
		// THIS IS TERRIBLE
		if (payload.video && key === "attachment") {
			data.append(key, value, "preview.png");
		} else {
			data.append(key, value);
		}
	}
	const response = await axiosWrapper(axios.post, "/tasks/", data, {
		headers,
	});
	return response.data;
}

export async function deleteTask({ id }) {
	const response = await axiosWrapper(axios.delete, `/tasks/${id}`);
	return response.data;
}

export async function getTasksForDateRange({ queryKey }) {
	const [_key, { startDate, endDate }] = queryKey;
	let page = 0;
	log(
		`Fetching tasks. (page: ${page}, startDate: ${startDate}, endDate: ${endDate})`
	);
	const { data } = await axiosWrapper(
		axios.get,
		`/tasks/?start_date=${startDate}&end_date=${endDate}`
	);
	let tasks = data.results;
	let next = data.next;
	while (next !== null) {
		page++;
		log(
			`Fetching tasks. (page: ${page}, startDate: ${startDate}, endDate: ${endDate})`
		);
		let { data } = await axiosWrapper(axios.get, next);
		tasks = [...tasks, ...data.results];
		next = data.next;
	}
	return tasks;
}

export async function updateTask({ id, payload }) {
	let data = new FormData();
	const headers = {
		"Content-Type": "multipart/form-data",
	};
	for (const [key, value] of Object.entries(payload)) {
		if ((key === "attachment" || key === "description") && value === null)
			continue;
		data.append(key, value);
	}
	const response = await axiosWrapper(axios.patch, `/tasks/${id}/`, data, {
		headers,
	});
	return response.data;
}

export async function getTasksUserDay({ queryKey }) {
	const [_key, { username, date }] = queryKey;
	const { data } = await axiosWrapper(
		axios.get,
		`/users/${username}/tasks_for_day/?day=${date}`
	);
	return data;
}

function getQueryForDate(startDate, endDate) {
	return [
		TASK_QUERIES.getTasks,
		{
			startDate: encodeURIComponent(
				`${format(startDate, "yyyy-MM-dd")} 0:00`
			),
			endDate: encodeURIComponent(
				`${format(endDate, "yyyy-MM-dd")} 23:59`
			),
		},
	];
}

export function useTask(id) {
	return useQuery([TASK_QUERIES.getTask, { id }], getTask);
}

export function useTasks(startDate, endDate) {
	return useQuery(getQueryForDate(startDate, endDate), getTasksForDateRange);
}

export function useUpdateTask(task, startDate = null, endDate = null) {
	const queryClient = useQueryClient();
	const queries = [
		startDate && endDate ? getQueryForDate(startDate, endDate) : null,
		!startDate || !endDate
			? getQueryForDate(
					task.created_at ? new Date(task.created_at) : new Date(),
					task.created_at ? new Date(task.created_at) : new Date()
					// eslint-disable-next-line
			  )
			: null,
	];

	return useMutation(updateTask, {
		onMutate: ({ payload, id }) => {
			const rollbacks = queries.map((query) => {
				if (!query) return;
				log(`Task mutation, updating query '${query}'.`);
				// Snapshot the previous value
				const previousTasks = queryClient.getQueryData(query);

				// Optimistically update to the new value
				queryClient.setQueryData(query, (old) => {
					if (!old) return old;
					return old.map((task) =>
						task.id === id ? { ...task, ...payload } : task
					);
				});

				// Return the snapshotted value
				return () => queryClient.setQueryData(query, previousTasks);
			});

			return () => {
				rollbacks.map((rollback) => {
					if (rollback) {
						log(`Rolling back query. (${rollback})`);
						rollback();
					}
				});
			};
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to update task. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			// CAUTION! Not doing this, keeping the optimistic task behind, could cause problems
			// e.g. key duplication (duplicate task ids)
			queries.map((query) => {
				if (query) queryClient.invalidateQueries(query);
			});
		},
	});
}

export function useCreateTask() {
	const queryClient = useQueryClient();
	return useMutation(createTask, {
		onSuccess: (newTask) => {
			log(`Created new task #${newTask.id}.`);
			queryClient.setQueryData(
				getQueryForDate(
					newTask.created_at
						? new Date(newTask.created_at)
						: new Date(),
					newTask.created_at
						? new Date(newTask.created_at)
						: new Date()
					// eslint-disable-next-line
				),
				(old) => {
					if (!old) return old;
					return [...old, newTask];
				}
			);
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err) => {
			log(`Failed to create task. (${err})`);
		},
	});
}

export function useDeleteTask(task, startDate = null, endDate = null) {
	const queryClient = useQueryClient();
	const queries = [
		startDate && endDate ? getQueryForDate(startDate, endDate) : null,
		!startDate && !endDate
			? getQueryForDate(
					task.created_at ? new Date(task.created_at) : new Date(),
					task.created_at ? new Date(task.created_at) : new Date()
					// eslint-disable-next-line
			  )
			: null,
	];

	return useMutation(deleteTask, {
		onMutate: ({ id }) => {
			const rollbacks = queries.map((query) => {
				if (!query) return;
				log(`Task mutation (delete), updating query '${query}'.`);
				// Snapshot the previous value
				const previousTasks = queryClient.getQueryData(query);

				// Optimistically update to the new value
				queryClient.setQueryData(query, (old) => {
					if (!old) return old;
					return old.filter((t) => t.id !== id);
				});

				// Return the snapshotted value
				return () => queryClient.setQueryData(query, previousTasks);
			});

			return () => {
				rollbacks.map((rollback) => {
					if (rollback) {
						log(`Rolling back query. (${rollback})`);
						rollback();
					}
				});
			};
		},
		// If the mutation fails, use the value returned from onMutate to roll back
		onError: (err, content, rollback) => {
			log(`Failed to delete task. (${err})`);
			if (rollback) rollback();
		},
		// Always refetch after error or success:
		onSettled: () => {
			queries.map((query) => {
				if (query) queryClient.invalidateQueries(query);
			});
		},
	});
}

export function useUserDayTasksTz(username, date) {
	return useQuery(
		[TASK_QUERIES.getTasksUserDay, { username, date }],
		getTasksUserDay
	);
}
