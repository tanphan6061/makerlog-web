import React from "react";
import { useComments } from "queries/comments";
import CommentInput from "components/comments/CommentInput";
import Spinner from "components/ui/Spinner";
import Button from "components/ui/Button";
import Message from "components/ui/Message";
import orderBy from "lodash/orderBy";
import Comment from "components/comments/Comment";

function TaskComments({ task, focused }) {
	const indexUrl = `/tasks/${task.id}`;
	const { data, isLoading, error, refetch } = useComments(indexUrl);

	return (
		<div className="w-full px-2 py-4 border border-gray-200 rounded-md bg-gray-50">
			{task.comment_count > 0 && isLoading && (
				<div className="mb-2 text-gray-500">
					<Spinner small text="Loading comments, hold on..." />
				</div>
			)}
			{error && !isLoading && (
				<Message title="Failed to load comments." danger>
					<Button xs onClick={refetch}>
						Retry
					</Button>
				</Message>
			)}
			{data && !isLoading && !error && data.length > 0 && (
				<div>
					{orderBy(data, "created_at", "asc").map((comment) => (
						<Comment
							indexUrl={indexUrl}
							comment={comment}
							key={comment.id}
						/>
					))}
				</div>
			)}
			<div className="mt-2 first:mt-0">
				<CommentInput indexUrl={indexUrl} focused={focused} />
			</div>
		</div>
	);
}

export default TaskComments;
