import React, { useEffect } from "react";
import { useState } from "react";
import Avatar from "components/ui/Avatar";
import { useAuth } from "stores/AuthStore";
import { onCmdEnter, openTweetWindow } from "utils/random";
import Button from "components/ui/Button";
import MarkdownEnabled from "components/ui/MarkdownEnabled";
import ErrorMessageList from "components/error/ErrorMessageList";
import { useCallback } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { useCreateMilestone } from "queries/milestones";
import ProductSelector from "components/products/ProductSelector";
import { Router } from "routes";
import { getTwitterShareUrl } from "utils/milestones";
import { trackEvent } from "vendor/segment";

function MilestoneEditor({ onFinish }) {
	const { user } = useAuth();
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [product, setProduct] = useState(null);
	const { mutate, isLoading, error, isSuccess } = useCreateMilestone();
	const [shouldTweet, setShouldTweet] = useState(false);

	const tweetAfterPost = (item) => {
		trackEvent("Tweeted After Post", { kind: "milestone" });
		const url = getTwitterShareUrl(item);
		openTweetWindow(url);
	};

	const onCreate = async () => {
		mutate(
			{ title, body, product },
			{
				onSuccess: (milestone) => {
					if (shouldTweet) {
						tweetAfterPost(milestone);
						setShouldTweet(false);
					}
					Router.pushRoute("milestone", { slug: milestone.slug });
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
				<div className="relative flex-none mr-2">
					<Avatar size={8} user={user} />
					<span
						className="absolute text-xs leading-none bg-white rounded-full"
						style={{
							right: "-4px",
							top: "-4px",
							fontSize: 10,
							padding: 2,
						}}
					>
						🏆
					</span>
				</div>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="flex-grow w-full mr-2"
					type="text"
					placeholder="What awesome thing did you achieve?"
				/>
				<ProductSelector
					value={product}
					onChange={(slug) => setProduct(slug)}
				/>
			</div>
			<div>
				<TextareaAutosize
					value={body}
					onChange={(e) => setBody(e.target.value)}
					onKeyDown={(e) => onCmdEnter(e, onCreate)}
					rows={4}
					className="w-full h-32 mt-2"
					placeholder="Write away..."
				/>

				<div className="mt-4 prose prose-sm dark:prose-dark">
					<strong>What's a milestone? 🤔</strong>
					<p style={{ marginTop: 0 }}>
						Milestones are a great way to share something awesome
						you've done or learned.
					</p>

					<strong>What do I post? 💫</strong>
					<p style={{ marginTop: 0 }}>
						<ul>
							<li>What did you achieve?</li>
							<li>How did you achieve it?</li>
							<li>What things did you try before?</li>
							<li>What were the results (analytics, growth)?</li>
						</ul>
						Provide value to the community, you'll likelier to get
						shared and celebrated by us! 🔥
					</p>
					<strong>Cool tricks 🛹</strong>
					<p style={{ marginTop: 0 }}>
						You can embed tasks you've completed into your post by
						simply linking to them in new lines.
					</p>
				</div>

				<hr className="my-4" />

				{error && (
					<div className="mt-2">
						<ErrorMessageList error={error} />
					</div>
				)}
				<div className="flex flex-row items-center w-full mt-4">
					<div className="flex-none">
						<MarkdownEnabled text="Markdown and task links supported." />
					</div>
					<div className="flex-grow"></div>

					<div className="mr-4 text-sm text-gray-700">
						<input
							type="checkbox"
							checked={shouldTweet}
							className="cursor-pointer"
							id="shouldTweet"
							onChange={(e) => setShouldTweet(e.target.checked)}
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
		</div>
	);
}

export default MilestoneEditor;
