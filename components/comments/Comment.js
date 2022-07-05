import React, { useState } from "react";
import { useDeleteComment, useUpdateComment } from "queries/comments";
import { useAuth } from "stores/AuthStore";
import Avatar from "components/ui/Avatar";
import UserLine from "components/ui/UserLine";
import Form from "components/ui/Form";
import CommentTextRenderer from "./CommentTextRenderer";

function CommentEdit({ comment, onSubmit }) {
	const [content, setContent] = useState(comment.content);
	return (
		<Form
			onSubmit={() => {
				onSubmit(content);
			}}
		>
			<input
				className="w-full"
				value={content}
				onChange={(e) => setContent(e.target.value)}
			/>
		</Form>
	);
}

function Comment({ comment, indexUrl }) {
	const [editing, setEditing] = useState(false);
	const { user } = useAuth();

	const { mutate: deleteMutation } = useDeleteComment(indexUrl);
	const { mutate: updateMutation } = useUpdateComment(indexUrl);

	const onEdit = async (content) => {
		setEditing(false);
		updateMutation({
			indexUrl,
			content,
			id: comment.id,
		});
	};

	const onDelete = async () => {
		deleteMutation({
			indexUrl,
			id: comment.id,
		});
	};

	return (
		<div className="flex mb-4 last:mb-0">
			<div className="flex-none mr-2">
				<Avatar size={8} user={comment.user} />
			</div>
			<div className="flex-initial">
				<UserLine withAvatar={false} user={comment.user} />
				<div className="p-2 break-words bg-gray-100 dark:bg-dark-100 shadow-xs rounded-md">
					{editing ? (
						<CommentEdit comment={comment} onSubmit={onEdit} />
					) : (
						<div>
							<CommentTextRenderer comment={comment} />
						</div>
					)}
				</div>
				{user && comment.user.id == user.id && !editing ? (
					<div className="inline-flex text-xs">
						<a
							className="mr-2 cursor-pointer last:mr-0"
							onClick={() => setEditing(true)}
						>
							Edit
						</a>
						<a
							className="mr-2 cursor-pointer last:mr-0"
							onClick={onDelete}
						>
							Delete
						</a>
					</div>
				) : null}
			</div>
		</div>
	);
}

export default Comment;
