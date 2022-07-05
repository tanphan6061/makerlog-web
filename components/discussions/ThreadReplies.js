import React from "react";
import { useThreadReplies } from "queries/discussions";
import ErrorCard from "components/ui/ErrorCard";
import Spinner from "components/ui/Spinner";
import Card from "components/ui/Card";
import Button from "components/ui/Button";
import orderBy from "lodash/orderBy";
import Reply from "./Reply";

function ThreadReplies({ thread }) {
	const { isLoading, data, error, refetch } = useThreadReplies(thread.slug);

	if (error) {
		return (
			<ErrorCard
				message="Failed to load replies."
				actions={<Button onClick={refetch}>Retry</Button>}
			/>
		);
	}

	if (isLoading) {
		return (
			<Card>
				<Card.Content>
					<Spinner text="Loading replies..." />
				</Card.Content>
			</Card>
		);
	}

	let replies = orderBy(data, ["praise", "created_at", "hidden"], ["desc", "desc", "asc"]);

	return (
		<Card>
			<Card.Content>
				{data.length === 0 && (
					<small className="text-gray-500">
						No replies yet. Start the conversation!
					</small>
				)}
				{replies
					.filter((r) => r.parent_reply === null)
					.map((reply) => (
						<Reply
							key={reply.id}
							childrenReplies={replies.filter(
								(r) => r.parent_reply === reply.id
							)}
							reply={reply}
							thread={thread}
						/>
					))}
			</Card.Content>
		</Card>
	);
}

export default ThreadReplies;
