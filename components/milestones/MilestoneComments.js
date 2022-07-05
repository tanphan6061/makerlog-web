import React from "react";
import { useComments } from "queries/comments";
import CommentInput from "components/comments/CommentInput";
import Spinner from "components/ui/Spinner";
import Button from "components/ui/Button";
import Message from "components/ui/Message";
import orderBy from "lodash/orderBy";
import Comment from "components/comments/Comment";

function MilestoneComments({ milestone, focused }) {
	const indexUrl = `/milestones/${milestone.slug}`;
	const { data, isLoading, error, refetch } = useComments(indexUrl);

	return (
		<div className="w-full">
			{milestone.comment_count > 0 && isLoading && (
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
				<div className="px-2 py-4 mb-2 border-l border-gray-200 bg-gray-50">
					{orderBy(data, "created_at", "asc").map((comment) => (
						<Comment
							indexUrl={indexUrl}
							comment={comment}
							key={comment.id}
						/>
					))}
				</div>
			)}
			<CommentInput indexUrl={indexUrl} focused={focused} />
		</div>
	);
}

export default MilestoneComments;
