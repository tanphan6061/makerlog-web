import React from "react";
import { faSlack } from "@fortawesome/free-brands-svg-icons/faSlack";
import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord";
import { faTrello } from "@fortawesome/free-brands-svg-icons/faTrello";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faGitlab } from "@fortawesome/free-brands-svg-icons/faGitlab";
import { faGlobe } from "@fortawesome/free-solid-svg-icons/faGlobe";
import { faRocket } from "@fortawesome/free-solid-svg-icons/faRocket";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons/faAngleDoubleDown";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons/faQuestionCircle";
import { faShip } from "@fortawesome/free-solid-svg-icons/faShip";
import { faTelegram } from "@fortawesome/free-brands-svg-icons/faTelegram";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function getColorForTask(task) {
	return task.done ? "green" : "orange";
}

export function getAppIcon(app) {
	let icon = null;
	switch (app) {
		case "slack":
			icon = faSlack;
			break;

		case "discord":
			icon = faDiscord;
			break;

		case "trello":
			icon = faTrello;
			break;

		case "github":
			icon = faGithub;
			break;

		case "webhook":
			icon = faGlobe;
			break;

		case "nodehost":
			icon = faRocket;
			break;

		case "todoist":
			icon = faAngleDoubleDown;
			break;

		case "gitlab":
			icon = faGitlab;
			break;

		case "shipstreams":
			icon = faShip;
			break;

		case "telegram":
			icon = faTelegram;
			break;

		default:
			icon = faQuestionCircle;
			break;
	}

	return icon;
}

function TaskIcon({ task, className, style }) {
	let doneIcon = "check-circle";
	let remainingIcon = "dot-circle";
	let doneColor = "#27ae60";
	let remainingColor = "#f39c12";

	if (task.event) {
		doneIcon = getAppIcon(task.event);
		remainingIcon = getAppIcon(task.event);
	}

	return task.done ? (
		<FontAwesomeIcon
			className={className}
			icon={doneIcon}
			color={doneColor}
			style={style}
		/>
	) : task.in_progress ? (
		<FontAwesomeIcon
			className={className}
			icon={remainingIcon}
			color={remainingColor}
			style={style}
		/>
	) : (
		<FontAwesomeIcon
			className={className}
			icon={["far", "circle"]}
			color={remainingColor}
			style={style}
		/>
	);
}

export default TaskIcon;
