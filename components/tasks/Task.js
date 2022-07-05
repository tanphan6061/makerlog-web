import React, { useState } from "react";
import TaskIcon, { getColorForTask } from "./TaskIcon";
import TaskActions from "./TaskActions";

import TaskTextRenderer from "./TaskTextRenderer";
import TaskAttachments from "./TaskAttachments";
import TaskComments from "./TaskComments";
import { SlideDown } from "react-slidedown";

// TODO: When link parsing is implemented, break-all anchor tags only.
// go back to break-words.

function getEggClassNames(content) {
	if (content.includes("egg:rainbows")) {
		return "egg-rainbow";
	}
}

function Task({
	task,
	// plain = false,
	withAttachments = true,
	withActions = false,
	withStreamActions = false,
}) {
	const [forceOpen, setForceOpen] = useState(false);
	const [commentsOpen, setCommentsOpen] = useState(false);

	const hasAttachment = () => {
		return task.video || task.attachment;
	};

	const renderActions = () => {
		return (
			<TaskActions
				small
				stream={withStreamActions}
				task={task}
				setCommentsOpen={setCommentsOpen}
			/>
		);
	};

	const renderAttachments = () => {
		if (!task.attachment && !task.video) return null;

		return (
			<div className="mt-4 first:mt-0">
				<TaskAttachments task={task} />
			</div>
		);
	};

	const panelOpen =
		(task.description !== null && task.description.length > 0) ||
		(withAttachments && hasAttachment()) ||
		commentsOpen ||
		task.comment_count > 0 ||
		forceOpen;

	return (
		<div className={"w-full max-w-full rounded-md Task transition-colors "}>
			<div className="flex flex-col content-center md:items-center md:flex-row">
				<div className="flex flex-row flex-grow max-w-full mb-1 text-base font-medium text-gray-900 task">
					<span className={`text-${getColorForTask(task)}-500 mr-1`}>
						<TaskIcon task={task} />
					</span>
					<div
						onClick={() => setForceOpen(!forceOpen)}
						className={`cursor-pointer flex-grow ${getEggClassNames(
							task.content
						)}`}
					>
						<TaskTextRenderer task={task} />
					</div>
				</div>
				{!forceOpen && (
					<>
						<div
							className="flex-none hidden sm:block"
							style={{ minHeight: 30, width: 1 }}
						></div>
						<div
							className={
								"mb-2 sm:mb-0 flex-none ml-1 transition-opacity " +
								"actions-container opacity-75 hover:opacity-100"
							}
						>
							{(withActions || withStreamActions) &&
								renderActions()}
						</div>
					</>
				)}
			</div>
			<SlideDown closed={!panelOpen}>
				<p
					className={
						"max-w-full ml-2 p-4 text-gray-900 break-words whitespace-pre-line border-l border-gray-200"
					}
				>
					{task.description ? <div>{task.description}</div> : null}
					{renderAttachments()}
					<div className="flex items-center mt-4 first:mt-0">
						<TaskActions
							small={false}
							stream
							task={task}
							setCommentsOpen={setCommentsOpen}
						/>
						<div className="flex-grow"></div>
						{withStreamActions && <TaskActions task={task} />}
					</div>
					{(commentsOpen || task.comment_count > 0) && (
						<div className="mt-2 first:mt-0">
							<TaskComments task={task} focused={commentsOpen} />
						</div>
					)}
				</p>
			</SlideDown>
		</div>
	);
}

export default Task;
