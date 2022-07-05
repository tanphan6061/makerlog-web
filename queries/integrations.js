import axios, { axiosWrapper } from "utils/axios";
import { getLogger } from "utils/logging";
import { useMutation, useQuery } from "react-query";

const log = getLogger("integrations");

export const INTEGRATIONS_QUERIES = {
	getApps: "integrations.getApps",
	getTodoistInstallUrl: "integrations.getTodoistInstallUrl",
	getTodoistProjects: "integrations.getTodoistProjects",
	getTodoistLinks: "integrations.getTodoistLinks",
};

export async function getTodoistClientId() {
	const response = await axiosWrapper(axios.get, `/apps/todoist/client_id/`);
	return response.data.client_id;
}

export async function getTodoistInstallUrl() {
	const clientId = await getTodoistClientId();
	return `https://todoist.com/oauth/authorize?client_id=${clientId}&scope=data:read&state=a`;
}

export async function getTodoistProjects() {
	const response = await axiosWrapper(axios.get, "/apps/todoist/projects/");
	return response.data.projects;
}

export async function getTodoistLinks() {
	const response = await axiosWrapper(axios.get, "/apps/todoist/links/");
	return response.data;
}

export async function linkTelegram({ key }) {
	const response = await axiosWrapper(axios.post, "/telegram/pair/", { key });
	return response.data;
}

export async function linkSlack({ key }) {
	const response = await axiosWrapper(
		axios.get,
		`/slack/register/?code=${key}`
	);
	return response.data;
}

export async function linkTodoist({ key }) {
	const response = await axiosWrapper(axios.post, `/apps/todoist/register/`, {
		code: key,
	});
	return response.data;
}

export async function unlinkTodoist() {
	const response = await axiosWrapper(axios.post, `/apps/todoist/uninstall/`);
	return response.data;
}

export async function deleteTodoistLink({ id }) {
	const response = await axiosWrapper(
		axios.delete,
		`/apps/todoist/links/${id}/`
	);
	return response.data;
}

export async function linkTodoistProjects({ makerlogProject, todoistProject }) {
	const { data } = await axiosWrapper(axios.post, "/apps/todoist/link/", {
		makerlog_project: makerlogProject,
		todoist_project: todoistProject,
	});
	return data;
}

export async function getApps() {
	const response = await axiosWrapper(axios.get, `/apps/`);
	return response.data.apps;
}

export async function deleteWebhook({ id }) {
	const response = await axiosWrapper(axios.delete, `/apps/webhook/me/${id}`);
	return response.data;
}

export async function createWebhook({
	event = "webhook",
	project_id = null,
	extra_data = null,
}) {
	const payload = { event };
	if (project_id) {
		payload["project_id"] = project_id;
	}
	if (extra_data) {
		payload["extra_data"] = extra_data;
	}
	const response = await axiosWrapper(
		axios.post,
		"/apps/webhook/create",
		payload
	);
	return response.data;
}

export function useApps() {
	return useQuery([INTEGRATIONS_QUERIES.getApps], getApps);
}

export function useTodoistProjects() {
	return useQuery(
		[INTEGRATIONS_QUERIES.getTodoistProjects],
		getTodoistProjects
	);
}

export function useTodoistLinks() {
	return useQuery([INTEGRATIONS_QUERIES.getTodoistLinks], getTodoistLinks);
}

export function useTodoistInstallUrl() {
	return useQuery(
		[INTEGRATIONS_QUERIES.getTodoistInstallUrl],
		getTodoistInstallUrl
	);
}

export function useLinkTelegram() {
	return useMutation(linkTelegram, {
		onSuccess: (data) => {
			log(`Linked to Telegram.`, data);
		},
	});
}

export function useLinkSlack() {
	return useMutation(linkSlack, {
		onSuccess: (data) => {
			log(`Linked to Slack.`, data);
		},
	});
}

export function useLinkTodoist() {
	return useMutation(linkTodoist, {
		onSuccess: (data) => {
			log(`Linked to Todoist.`, data);
		},
	});
}

export function useUnlinkTodoist() {
	return useMutation(unlinkTodoist);
}

export function useDeleteTodoistLink() {
	return useMutation(deleteTodoistLink);
}

export function useLinkTodoistProjects() {
	return useMutation(linkTodoistProjects);
}

export function useDeleteWebhook() {
	return useMutation(deleteWebhook);
}

export function useCreateWebhook() {
	return useMutation(createWebhook);
}
