/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState } from "react";
import Avatar from "components/ui/Avatar";
import { useAuth } from "stores/AuthStore";
import Button from "components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	DoneStates,
	getDeltaFromDoneState,
	getHumanStateFromDoneState,
	getTwitterShareUrl,
	useAttachmentInput,
} from "utils/tasks";
import TaskIcon from "components/tasks/TaskIcon";
import Dropdown from "components/ui/Dropdown";
import { useCreateTask } from "queries/tasks";
import ErrorMessageList from "components/error/ErrorMessageList";
import { useEffect } from "react";
import { onCmdEnter, openTweetWindow } from "utils/random";
import { useCallback } from "react";
import VideoThumbnail from "react-video-thumbnail";
import Message from "components/ui/Message";
import Spinner from "components/ui/Spinner";
import { trackEvent } from "vendor/segment";

function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(","),
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: "image/png" });
}

function getExtension(filename) {
	var parts = filename.split(".");
	return parts[parts.length - 1];
}

function TaskEditor({ onFinish, forceOpen = false }) {
	const { user } = useAuth();
	const [content, setContent] = useState("");
	const [description, setDescription] = useState("");
	const [doneState, setDoneState] = useState(DoneStates.DONE);
	const { mutate, isSuccess, isLoading, error } = useCreateTask();
	const [loadingVThumb, setLoadingVThumb] = useState(false);
	const [vThumb, setVThumb] = useState(null);
	const [shouldTweet, setShouldTweet] = useState(false);

	const {
		attachmentState,
		getRootProps,
		getInputProps,
		open,
		isDragActive,
		clearAttachmentState,
	} = useAttachmentInput();

	// Hack. Memoize onFinish, else infinite loop.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onFinishMemoized = useCallback(() => onFinish(), []);

	useEffect(() => {
		if (isSuccess) {
			setContent("");
			setDescription("");
			clearAttachmentState();
			setVThumb(null);
			setLoadingVThumb(false);
			if (onFinishMemoized) onFinishMemoized();
		}
	}, [clearAttachmentState, isSuccess, onFinishMemoized]);

	useEffect(() => {
		if (
			attachmentState.attachment &&
			getExtension(attachmentState.name) === "mp4"
		) {
			setLoadingVThumb(true);
		} else {
			setVThumb(null);
			setLoadingVThumb(false);
		}
	}, [setLoadingVThumb, attachmentState]);

	const tweetAfterPost = (task) => {
		trackEvent("Tweeted After Post", { kind: "task" });
		const url = getTwitterShareUrl([task]);
		openTweetWindow(url);
	};

	const onCreate = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		let payload = { content, ...getDeltaFromDoneState(doneState) };
		if (description.length > 0) payload["description"] = description;
		if (attachmentState.attachment) {
			payload["attachment"] = attachmentState.attachment;
			if (getExtension(attachmentState.name) === "mp4" && vThumb) {
				payload["attachment"] = vThumb;
				payload["video"] = attachmentState.attachment;
			}
		}
		mutate(payload, {
			onSuccess: (task) => {
				if (shouldTweet) {
					tweetAfterPost(task);
					setShouldTweet(false);
				}
			},
		});
	};

	const onVThumbGenerated = async (t) => {
		const blob = dataURLtoBlob(t);
		setVThumb(blob);
		setLoadingVThumb(false);
	};

	const cycleDoneState = () => {
		if (doneState === DoneStates.DONE) {
			setDoneState(DoneStates.IN_PROGRESS);
		} else if (doneState === DoneStates.IN_PROGRESS) {
			setDoneState(DoneStates.REMAINING);
		} else if (doneState === DoneStates.REMAINING) {
			setDoneState(DoneStates.DONE);
		}
	};

	const isOpen = content.length > 0 || attachmentState.attachment !== null;

	return (
		<form onSubmit={(e) => onCreate(e)} {...getRootProps()}>
			<div className="flex items-center input-flex">
				<span
					className="relative flex-none mr-2 cursor-pointer"
					onClick={cycleDoneState}
				>
					<Avatar size={8} user={user} />
					<TaskIcon
						task={getDeltaFromDoneState(doneState)}
						className="absolute bg-white rounded-full"
						style={{ right: "-4px", top: "-4px" }}
					/>
				</span>
				<input
					id="task-editor"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={(e) => onCmdEnter(e, () => onCreate(e))}
					className="flex-grow w-full mr-2"
					type="text"
					placeholder="Start typing something you've done or made..."
				/>
				{!isOpen && (
					<div className="flex flex-none">
						<input {...getInputProps()}></input>
						<Button sm onClick={open} style={{ height: 38 }}>
							<FontAwesomeIcon icon="camera" />
						</Button>
					</div>
				)}
				{isOpen && (
					<div className="flex-none">
						<Dropdown
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
											setDoneState(DoneStates.IN_PROGRESS)
										}
									>
										In-progress
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() =>
											setDoneState(DoneStates.REMAINING)
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
										task={getDeltaFromDoneState(doneState)}
									/>
								</Button.Icon>
								{getHumanStateFromDoneState(doneState)}
								<Button.Icon right>
									<FontAwesomeIcon icon="caret-down" />
								</Button.Icon>
							</Button>
						</Dropdown>
					</div>
				)}
			</div>
			{(isOpen || forceOpen) && (
				<>
					{isDragActive ? (
						<div className="flex items-center justify-center h-32 mt-2 bg-gray-100 border border-gray-200 border-dashed rounded-md">
							<span className="text-gray-300">
								Drop an image here.
							</span>
						</div>
					) : (
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							onKeyDown={(e) => onCmdEnter(e, () => onCreate(e))}
							rows={4}
							className="w-full h-32 mt-2"
							placeholder="Write a description or drop images here..."
						/>
					)}
					{(error || attachmentState.error) && (
						<div className="mt-2">
							<ErrorMessageList error={error} />
							{attachmentState.error && (
								<Message error>{attachmentState.error}</Message>
							)}
						</div>
					)}
					<div className="flex flex-row items-center w-full mt-4">
						<div className="flex-none space-x-2">
							<Button
								sm
								onClick={open}
								className="truncate"
								id="upload-button"
							>
								<Button.Icon>
									<FontAwesomeIcon icon="camera" />
								</Button.Icon>
								{attachmentState.name
									? attachmentState.name.length > 8
										? `${attachmentState.name.substring(
												0,
												8
										  )}...`
										: attachmentState.name
									: "Upload"}
							</Button>
							{attachmentState && attachmentState.attachment && (
								<span
									className="cursor-pointer"
									onClick={() => clearAttachmentState()}
								>
									<FontAwesomeIcon icon="trash" size="xs" />
								</span>
							)}
							<input {...getInputProps()}></input>
						</div>
						<div className="flex-grow"></div>
						<div className="mr-4 text-sm text-gray-700">
							<input
								type="checkbox"
								checked={shouldTweet}
								className="cursor-pointer"
								id="shouldTweet"
								onChange={(e) =>
									setShouldTweet(e.target.checked)
								}
								name="shouldTweet"
							/>
							<label htmlFor="shouldTweet"> Tweet</label>
						</div>
						<div className="flex-none">
							<Button
								primary
								sm
								disabled={loadingVThumb}
								loading={isLoading}
								onClick={onCreate}
							>
								{loadingVThumb ? "Processing video..." : "Post"}
							</Button>
						</div>
					</div>

					{attachmentState.attachment &&
						getExtension(attachmentState.name) === "mp4" && (
							<div
								className={
									"video-thumb-preview " +
									(loadingVThumb && "h-12 overflow-hidden")
								}
							>
								{loadingVThumb ? (
									<Spinner small text="Processing video..." />
								) : (
									<div className="mb-2 heading">
										Video preview
									</div>
								)}
								{vThumb && (
									<video controls autoPlay muted>
										<source
											src={attachmentState.preview}
											type="video/mp4"
										/>
									</video>
								)}
								<VideoThumbnail
									renderThumbnail={false}
									videoUrl={attachmentState.preview}
									thumbnailHandler={onVThumbGenerated}
								/>
							</div>
						)}
				</>
			)}
		</form>
	);
}

export default TaskEditor;
