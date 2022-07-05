import React from "react";
import { useCreateThreadReply } from "queries/discussions";
import ErrorCard from "components/ui/ErrorCard";
import UserLine from "components/ui/UserLine";
import { useAuth } from "stores/AuthStore";
import Form from "components/ui/Form";
import Button from "components/ui/Button";
import { useState } from "react";
import { useEffect } from "react";
import ErrorMessageList from "components/error/ErrorMessageList";
import { onCmdEnter } from "utils/random";
import { usePrevious } from "utils/hooks";
import MarkdownEnabled from "components/ui/MarkdownEnabled";

function ThreadReplyForm({
	body,
	onChange,
	isLoading,
	error,
	onSubmit,
	withUserLine = true,
}) {
	const { user, isLoggedIn } = useAuth();

	if (!isLoggedIn) {
		// TODO: Make a dedicated marketing component for this case
		return (
			<ErrorCard
				title="Join the conversation"
				message="Sign in to post a reply and interact with thousands of makers."
				statusCode={403}
				nyan={false}
			/>
		);
	}

	return (
		<Form>
			{withUserLine ? (
				<div className="mb-2">
					<UserLine user={user} />
				</div>
			) : null}

			<Form.Controls>
				<Form.Field span={6}>
					<textarea
						value={body}
						onChange={onChange}
						onKeyDown={(e) => onCmdEnter(e, () => onSubmit())}
						className="h-32 mb-4"
						placeholder="Say something nice..."
					></textarea>
				</Form.Field>
			</Form.Controls>

			{error && <ErrorMessageList error={error} />}

			<div className="flex flex-row items-center w-full">
				<div className="flex-none">
					<MarkdownEnabled />
				</div>
				<div className="flex-grow"></div>
				<div className="flex-none">
					<Button primary loading={isLoading} onClick={onSubmit}>
						Post
					</Button>
				</div>
			</div>
		</Form>
	);
}

export function ThreadReplyCreateForm({
	threadSlug,
	replyingTo = null,
	parentReply = null,
	withUserLine = true,
	onFinish = () => {},
}) {
	const [body, setBody] = useState("");
	const { mutate, isLoading, error, isSuccess } = useCreateThreadReply();
	const prevReplyingTo = usePrevious(replyingTo);

	const onCreate = async () => {
		mutate(
			{
				slug: threadSlug,
				body,
				parentReply: parentReply ? parentReply.id : null,
			},
			{
				onSuccess: () => {
					onFinish();
				},
			}
		);
	};

	useEffect(() => {
		if (isSuccess) setBody("");
	}, [isSuccess]);

	useEffect(() => {
		if (!prevReplyingTo && replyingTo)
			setBody(`@${replyingTo.username} ${body}`);
	}, [prevReplyingTo, body, replyingTo]);

	return (
		<ThreadReplyForm
			body={body}
			onChange={(e) => setBody(e.target.value)}
			isLoading={isLoading}
			error={error}
			onSubmit={onCreate}
			withUserLine={withUserLine}
		/>
	);
}

export default ThreadReplyForm;
