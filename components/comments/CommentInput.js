import React, { useRef, useEffect, useState } from "react";
import { usePrevious } from "utils/hooks";
import Form from "components/ui/Form";
import Avatar from "components/ui/Avatar";
import Spinner from "components/ui/Spinner";
import { useAuth } from "stores/AuthStore";
import { useCreateComment } from "queries/comments";
import Button from "components/ui/Button";
import { Link } from "routes";

// TODO: Guest state.

function CommentInput({ indexUrl, focused = false }) {
	const [content, setContent] = useState("");
	const { user, isLoggedIn } = useAuth();
	const textInput = useRef(null);
	const prevFocused = usePrevious(focused);

	const {
		mutateAsync: createMutation,
		isLoading: isCreating,
	} = useCreateComment(indexUrl, user);

	const onSubmit = async () => {
		await createMutation({
			indexUrl,
			content,
		});
		setContent("");
	};

	useEffect(() => {
		// Focus on state change.
		if (!prevFocused && focused && textInput && textInput.current) {
			textInput.current.focus();
		}
	}, [focused, prevFocused]);

	if (!isLoggedIn)
		return (
			<Form className="flex items-center w-full" onSubmit={onSubmit}>
				<div className="flex-grow mr-2">
					<input
						value={"You must be logged in to comment."}
						disabled={true}
					/>
				</div>

				<div className="flex-none">
					<Link route="login">
						<Button primary>Get started &raquo;</Button>
					</Link>
				</div>
			</Form>
		);

	return (
		<Form className="flex items-center w-full" onSubmit={onSubmit}>
			<div className="flex-none mr-2">
				<Avatar size={8} user={user} />
			</div>
			<div className="flex-grow mr-2">
				<input
					onChange={(e) => setContent(e.target.value)}
					value={content}
					disabled={isCreating}
					placeholder="Say something nice..."
					autoFocus={focused}
					ref={textInput}
				/>
			</div>
			{isCreating && (
				<div className="flex-none">
					<Spinner small />
				</div>
			)}
		</Form>
	);
}

export default CommentInput;
