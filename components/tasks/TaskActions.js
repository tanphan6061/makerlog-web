import React, { useState } from "react";
import Button from "components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PraiseButton from "components/praise/PraiseButton";
import { useAuth } from "stores/AuthStore";
import Dropdown from "components/ui/Dropdown";
import copy from "clipboard-copy";
import { isServer } from "config";
import { buildAbsoluteUrl } from "utils/random";
import {
	getTwitterShareUrl,
	getDoneState,
	DoneStates,
	getDeltaFromDoneState,
	useAttachmentInput,
	getHumanStateFromDoneState,
} from "utils/tasks";
import { useDeleteTask, useUpdateTask } from "queries/tasks";
import { getLogger } from "utils/logging";
import Modal from "components/ui/Modal";
import Form from "components/ui/Form";
import ErrorMessageList from "components/error/ErrorMessageList";
import { useEffect } from "react";
import { usePrevious } from "utils/hooks";
import TaskIcon from "./TaskIcon";

const log = getLogger("TaskActions");

function TaskStateDropdown({ task, onUpdate }) {
	const ds = getDoneState(task);

	const markAsDoneState = (doneState) => {
		onUpdate(getDeltaFromDoneState(doneState));
	};

	return (
		<Dropdown
			items={
				<>
					{ds == DoneStates.DONE ? (
						<>
							<Dropdown.Item
								onClick={() =>
									markAsDoneState(DoneStates.REMAINING)
								}
							>
								Mark as remaining
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() =>
									markAsDoneState(DoneStates.IN_PROGRESS)
								}
							>
								Mark as in-progress
							</Dropdown.Item>
						</>
					) : null}

					{ds == DoneStates.IN_PROGRESS ? (
						<>
							<Dropdown.Item
								onClick={() => markAsDoneState(DoneStates.DONE)}
							>
								Mark as completed
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() =>
									markAsDoneState(DoneStates.REMAINING)
								}
							>
								Mark as remaining
							</Dropdown.Item>
						</>
					) : null}

					{ds == DoneStates.REMAINING ? (
						<>
							<Dropdown.Item
								onClick={() => markAsDoneState(DoneStates.DONE)}
							>
								Mark as completed
							</Dropdown.Item>
							<Dropdown.Item
								onClick={() =>
									markAsDoneState(DoneStates.IN_PROGRESS)
								}
							>
								Mark as in-progress
							</Dropdown.Item>
						</>
					) : null}
				</>
			}
		>
			<Button xs secondary>
				Mark as...
				<Button.Icon right>
					<FontAwesomeIcon icon="caret-down" />
				</Button.Icon>
			</Button>
		</Dropdown>
	);
}

function TaskPermalinkAction({ task }) {
	const [copied, setCopied] = useState(false);

	return (
		<Dropdown.Item
			onClick={() => {
				if (isServer) return;
				copy(buildAbsoluteUrl(`/tasks/${task.id}`));
				setCopied(true);
				setInterval(() => setCopied(false), 1000);
			}}
		>
			<Dropdown.Item.Icon>
				<FontAwesomeIcon icon="link" />
			</Dropdown.Item.Icon>
			{copied ? "Copied!" : "Permalink"}
		</Dropdown.Item>
	);
}

function TaskDeleteAction({ task, onDelete }) {
	const { isLoggedIn, user } = useAuth();

	if (
		!isLoggedIn ||
		(user.id !== task.user.id && !(user.is_moderator || user.is_staff))
	)
		return null;

	return (
		<Dropdown.Item onClick={onDelete}>
			<Dropdown.Item.Icon>
				<FontAwesomeIcon icon="trash" />
			</Dropdown.Item.Icon>
			Delete {user.is_moderator || user.is_staff ? "(Admin)" : null}
		</Dropdown.Item>
	);
}

function TaskEditModal({ task, open, onClose }) {
	const {
		mutate: updateMutation,
		isLoading,
		error,
		isSuccess,
	} = useUpdateTask(task);
	const [content, setContent] = useState(task.content);
	const [description, setDescription] = useState(
		task.description ? task.description : ""
	);
	const [doneState, setDoneState] = useState(getDoneState(task));
	const {
		attachmentState,
		getInputProps,
		open: openAttachmentSelect,
	} = useAttachmentInput();
	const previousIsSuccess = usePrevious(isSuccess);

	useEffect(() => {
		if (!previousIsSuccess && isSuccess) onClose();
	}, [previousIsSuccess, isSuccess, onClose]);

	const onSubmit = async () => {
		await updateMutation({
			id: task.id,
			payload: {
				content,
				description: description,
				attachment:
					attachmentState.attachment !== null
						? attachmentState.attachment
						: null,
				...getDeltaFromDoneState(doneState),
			},
		});
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Modal.Header title="Edit task" />
			<Form onSubmit={onSubmit}>
				<Form.Controls>
					<Form.Field span={6} label="State">
						<div>
							<Dropdown
								left
								origin="top-left"
								items={
									<>
										<Dropdown.Item
											onClick={() =>
												setDoneState(DoneStates.DONE)
											}
										>
											Done
										</Dropdown.Item>
										<Dropdown.Item
											onClick={() =>
												setDoneState(
													DoneStates.IN_PROGRESS
												)
											}
										>
											In-progress
										</Dropdown.Item>
										<Dropdown.Item
											onClick={() =>
												setDoneState(
													DoneStates.REMAINING
												)
											}
										>
											To-do
										</Dropdown.Item>
									</>
								}
							>
								<Button
									sm
									secondary
									className={
										doneState !== DoneStates.DONE
											? "remaining-btn"
											: ""
									}
								>
									<Button.Icon>
										<TaskIcon
											task={getDeltaFromDoneState(
												doneState
											)}
										/>
									</Button.Icon>
									{getHumanStateFromDoneState(doneState)}
									<Button.Icon right>
										<FontAwesomeIcon icon="caret-down" />
									</Button.Icon>
								</Button>
							</Dropdown>
						</div>
					</Form.Field>
					<Form.Field span={6} label="Content">
						<input
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Did something today #life"
						></input>
					</Form.Field>
					<Form.Field span={6} label="Description">
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe your work..."
						></textarea>
					</Form.Field>
					<Form.Field span={6} label="Attachment">
						<input {...getInputProps()}></input>
						<Button sm onClick={openAttachmentSelect}>
							<Button.Icon>
								<FontAwesomeIcon icon="camera" />
							</Button.Icon>
							{attachmentState.name
								? attachmentState.name
								: `${task.attachment ? "Change" : "Add"} image`}
						</Button>
					</Form.Field>
				</Form.Controls>

				{error && (
					<div className="mt-4">
						<ErrorMessageList error={error} />
					</div>
				)}

				<Form.Actions span={4}>
					<div className="ml-2">
						<Button onClick={onClose}>Cancel</Button>
					</div>
					<div className="ml-2">
						<Button primary loading={isLoading} type="submit">
							Submit
						</Button>
					</div>
				</Form.Actions>
			</Form>
		</Modal>
	);
}

function TaskMoreDropdown({ task, onDelete, onUpdate }) {
	const { isLoggedIn, user } = useAuth();
	const [editing, setEditing] = useState(false);

	return (
		<>
			{isLoggedIn && user.id === task.user.id && (
				<TaskEditModal
					task={task}
					open={editing}
					onUpdate={onUpdate}
					onClose={() => setEditing(!editing)}
				/>
			)}
			<Dropdown
				items={
					<>
						<TaskPermalinkAction task={task} />

						<Dropdown.Item
							href={getTwitterShareUrl([task])}
							target="_blank"
						>
							<Dropdown.Item.Icon>
								<FontAwesomeIcon icon={["fab", "twitter"]} />
							</Dropdown.Item.Icon>
							Tweet
						</Dropdown.Item>
						{isLoggedIn && user.id === task.user.id && (
							<div className="mt-2 mb-2 border-b border-gray-200"></div>
						)}
						{isLoggedIn && user.id === task.user.id && (
							<Dropdown.Item onClick={() => setEditing(true)}>
								<Dropdown.Item.Icon>
									<FontAwesomeIcon icon="edit" />
								</Dropdown.Item.Icon>
								Edit
							</Dropdown.Item>
						)}
						<TaskDeleteAction task={task} onDelete={onDelete} />
					</>
				}
			>
				<Button xs>
					<Button.Icon>
						<FontAwesomeIcon icon="ellipsis-v" />
					</Button.Icon>
					More
					<Button.Icon right>
						<FontAwesomeIcon icon="caret-down" />
					</Button.Icon>
				</Button>
			</Dropdown>
		</>
	);
}

function TaskActions({
	task,
	stream = false,
	small = false,
	embed = false,
	setCommentsOpen = () => {},
}) {
	// We allow this to be false, favoring a boolean op below.
	// This allows for autofocus on click.
	const { isLoggedIn, user } = useAuth();
	const { mutate: updateMutation } = useUpdateTask(task);
	const { mutate: deleteMutation } = useDeleteTask(task);
	if (!task) return;

	const updateTask = async (delta) => {
		updateMutation(
			{ payload: delta, id: task.id },
			{
				onSuccess: () => {
					log(`Task #${task.id} has been updated. (${delta})`);
				},
			}
		);
	};

	const deleteTask = async () => {
		deleteMutation(
			{ id: task.id },
			{
				onSuccess: () => {
					log(`Task #${task.id} has been deleted.`);
				},
			}
		);
	};

	if (embed) {
		return null;
	} else if (stream) {
		return (
			<div>
				<span className="inline-flex flex-wrap md:flex space-x-2">
					<span className="flex-none">
						<PraiseButton
							small={small}
							disabled={user && task.user.id === user.id}
							initialCount={task.praise}
							indexUrl={`/tasks/${task.id}`}
						/>
					</span>
					<span className="flex-none">
						<Button
							xs
							onClick={() => {
								setCommentsOpen(true);
							}}
						>
							<Button.Icon>
								<FontAwesomeIcon icon="comment" />
							</Button.Icon>
							{task.comment_count}
						</Button>
					</span>
				</span>
			</div>
		);
	} else {
		return (
			<div>
				<span className="inline-flex flex-wrap space-x-2">
					{isLoggedIn && user.id === task.user.id && (
						<span className="flex-none">
							<TaskStateDropdown
								task={task}
								onUpdate={updateTask}
							/>
						</span>
					)}
					<span className="flex-none">
						<TaskMoreDropdown
							task={task}
							onUpdate={updateTask}
							onDelete={deleteTask}
						/>
					</span>
				</span>
			</div>
		);
	}
}

export default TaskActions;
