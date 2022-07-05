import React, { useEffect } from "react";
import { useState } from "react";
import Avatar from "components/ui/Avatar";
import { useAuth } from "stores/AuthStore";
import { onCmdEnter, openTweetWindow } from "utils/random";
import Button from "components/ui/Button";
import MarkdownEnabled from "components/ui/MarkdownEnabled";
import { useCreateThread } from "queries/discussions";
import ErrorMessageList from "components/error/ErrorMessageList";
import { useCallback } from "react";
import { Router } from "routes";
import { getTwitterShareUrl } from "utils/discussions";
import { trackEvent } from "vendor/segment";

function DiscussionEditor({ onFinish }) {
	const { user } = useAuth();
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const { mutate, isLoading, error, isSuccess } = useCreateThread();
	const [shouldTweet, setShouldTweet] = useState(false);

	const tweetAfterPost = (item) => {
		trackEvent("Tweeted After Post", { kind: "discussion" });
		const url = getTwitterShareUrl(item);
		openTweetWindow(url);
	};

	const onCreate = async () => {
		mutate(
			{ title, body },
			{
				onSuccess: (discussion) => {
					if (shouldTweet) {
						tweetAfterPost(discussion);
						setShouldTweet(false);
					}
					Router.pushRoute("discussions-thread", {
						slug: discussion.slug,
					});
				},
			}
		);
	};

	// Hack. Memoize onFinish, else infinite loop.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const onFinishMemoized = useCallback(() => onFinish(), []);

	useEffect(() => {
		if (isSuccess) {
			setTitle("");
			setBody("");
			if (onFinishMemoized) onFinishMemoized();
		}
	}, [isSuccess, onFinishMemoized]);

	return (
		<div>
			<div className="flex items-center input-flex">
				<div className="flex-none mr-2">
					<Avatar size={8} user={user} />
				</div>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="flex-grow w-full mr-2"
					type="text"
					placeholder="Share something, ask a question, get feedback..."
				/>
			</div>
			{title.length > 0 && (
				<div>
					<textarea
						value={body}
						onChange={(e) => setBody(e.target.value)}
						onKeyDown={(e) => onCmdEnter(e, onCreate)}
						rows={4}
						className="w-full h-32 mt-2"
						placeholder="Write away..."
					/>
					{error && (
						<div className="mt-2">
							<ErrorMessageList error={error} />
						</div>
					)}
					<div className="flex flex-row items-center w-full mt-4">
						<div className="flex-none">
							<MarkdownEnabled />
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
								loading={isLoading}
								onClick={onCreate}
							>
								Post
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default DiscussionEditor;
