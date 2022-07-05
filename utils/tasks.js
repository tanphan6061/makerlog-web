import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { buildAbsoluteUrl } from "./random";
import config from "config";

export const DoneStates = {
	DONE: 0,
	IN_PROGRESS: 1,
	REMAINING: 2,
};

export function getDoneState(task) {
	if (task.done && !task.in_progress) return DoneStates.DONE;
	if (!task.done && task.in_progress) return DoneStates.IN_PROGRESS;
	return DoneStates.REMAINING;
}

export function getHumanStateFromDoneState(ds) {
	switch (ds) {
		case DoneStates.DONE:
			return "Done";
		case DoneStates.IN_PROGRESS:
			return "In progress";
		case DoneStates.REMAINING:
			return "To-do";
		default:
			"Task";
	}
}

export function getHumanStateFromTask(task) {
	const ds = getDoneState(task);
	return getHumanStateFromDoneState(ds);
}

export function getDeltaFromDoneState(doneState) {
	// Loose comparison in case input is string.
	return {
		done: doneState == DoneStates.DONE,
		in_progress: doneState == DoneStates.IN_PROGRESS,
	};
}

export function groupTasksByDone(tasks) {
	tasks = orderBy(tasks, "created_at", "desc");
	let resultObj = {};
	resultObj[DoneStates.DONE] = [];
	resultObj[DoneStates.IN_PROGRESS] = [];
	resultObj[DoneStates.REMAINING] = [];
	let newObj = groupBy(tasks, (task) => {
		return getDoneState(task);
	});
	return { ...resultObj, ...newObj };
}

export function getDateListShareUrl(task) {
	if (!task) return null;
	const date = new Date(task.done_at || task.created_at);
	const day = date.getUTCDate().toString().padStart(2, "0");
	const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();
	return buildAbsoluteUrl(
		`/@${task.user.username}/lists/${year}/${month}/${day}/`
	);
}

export function getTwitterShareUrl(tasks, me = null) {
	// We assume it has been serialized and validated.
	if (tasks.length === 0) return null;
	let user = tasks[0].user;
	let name = user.twitter_handle ? `@${user.twitter_handle}` : user.username;
	let text = `Done today by ${name} on @GetMakerlog:\n`;
	if (tasks.length === 1) {
		const task = tasks[0];
		text = `✅ ${task.content}`;
		if (task.description) {
			text += `\n\n${task.description}`;
		}
		text += `\n\n${config.BASE_URL}/tasks/${task.id}`;
		return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			text
		)}`;
	}
	if (me && me.id === user.id) {
		text = `Done today on @GetMakerlog:\n`;
	}
	orderBy(tasks, "created_at", "asc").map((task) => {
		text = text + `\n✅ ${task.content}`;
		return true;
	});
	text += `\n\n${getDateListShareUrl(tasks[0])}`;
	return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function findProductInTaskSet(task, tag) {
	return task.product_set.find((x) =>
		x.projects.find((n) => n.name.toLowerCase() === tag.toLowerCase())
	);
}

export function useAttachmentInput() {
	const [attachmentState, setAttachmentState] = useState({
		attachment: null,
		name: null,
		preview: null,
		error: null,
	});

	const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
		const reader = new FileReader();
		const attachment = acceptedFiles[0];

		if (rejectedFiles.length > 0) {
			setAttachmentState({
				attachment: null,
				name: null,
				preview: null,
				error:
					"File too large, max 100MB. If it's a video, try uploading to YouTube instead.",
			});
			return;
		}

		reader.onloadend = () => {
			setAttachmentState({
				attachment,
				name: attachment.name,
				preview: reader.result,
			});
		};

		if (attachment) {
			reader.readAsDataURL(attachment);
		}
	}, []);

	const clearAttachmentState = useCallback(() => {
		setAttachmentState({ attachment: null, name: null, preview: null });
	}, []);

	const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
		onDrop,
		noClick: true,
		noKeyboard: true,
		accept: "image/jpeg, image/png, image/gif, video/mp4",
		maxSize: 100000000,
	});

	return {
		getRootProps,
		getInputProps,
		open,
		isDragActive,
		attachmentState,
		clearAttachmentState,
	};
}
