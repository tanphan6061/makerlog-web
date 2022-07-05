import Task from "components/tasks/Task";
import Card from "components/ui/Card";
import UserMedia from "components/ui/UserMedia";
import React from "react";
import ReactTimeago from "react-timeago";
import { orderByDate } from "utils/feeds";
import { groupTasksByDone, DoneStates } from "utils/tasks";
import uniqBy from "lodash/uniqBy";
import flatten from "lodash/flatten";

export default function FeedCard({ objects }) {
	if (!objects || objects.length === 0) return null;
	objects = uniqBy(objects, "id");
	const latestObject = objects[0] ? objects[0] : {};
	const actor = latestObject.user;

	if (!actor) return null;

	let tasks = flatten(objects.map((obj) => obj.tasks));
	if (tasks.length === 0) return null;
	tasks = uniqBy(orderByDate(tasks), "id");
	const time = tasks[0].updated_at;
	const groupedTasks = groupTasksByDone(tasks);

	return (
		<Card>
			<div className="flex p-4 pb-0 actor text-gray-50">
				{actor && (
					<UserMedia
						user={actor}
						extra={
							<span className="text-gray-300">
								· updated <ReactTimeago date={time} />
							</span>
						}
					/>
				)}
				<div className="flex-grow"></div>
			</div>
			<Card.Content>
				{groupedTasks[DoneStates.IN_PROGRESS].map((task) => (
					<div className="mb-2 last:mb-0" key={task.id}>
						<Task withStreamActions task={task} />
					</div>
				))}
				{groupedTasks[DoneStates.DONE].map((task) => (
					<div className="mb-2 last:mb-0" key={task.id}>
						<Task withStreamActions task={task} />
					</div>
				))}
				{groupedTasks[DoneStates.REMAINING].map((task) => (
					<div className="mb-2 last:mb-0" key={task.id}>
						<Task withStreamActions task={task} />
					</div>
				))}
			</Card.Content>
		</Card>
	);
}
