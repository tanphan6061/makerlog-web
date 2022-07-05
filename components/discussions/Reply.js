import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLine from "components/ui/UserLine";
import Button from "components/ui/Button";
import orderBy from "lodash/orderBy";
import ThreadReplyForm, { ThreadReplyCreateForm } from "./ThreadReplyForm";
import PraiseButton from "components/praise/PraiseButton";
import {
	useUpdateThreadReply,
	useDeleteThreadReply,
} from "queries/discussions";
import { useAuth } from "stores/AuthStore";
import Dropdown from "components/ui/Dropdown";
import ModStatus from "./ModStatus";
import DiscussionsTextRenderer from "./DiscussionsTextRenderer";
import TimeAgo from "react-timeago";

function Reply({
	reply,
	child,
	childrenReplies,
	onReplyTo = null,
	withUserLine = true,
}) {
	const { user, isLoggedIn } = useAuth();
	const [editing, setEditing] = useState(false);
	const [body, setBody] = useState(reply.body);
	const [replyingTo, setReplyingTo] = useState(null);
	const { mutate: deleteReply } = useDeleteThreadReply(reply.parent);
	const {
		mutate: update,
		isLoading,
		error,
	} = useUpdateThreadReply(reply.parent);
	childrenReplies = orderBy(childrenReplies, "created_at", "asc");

	const onEdit = async () => {
		update(
			{ slug: reply.parent, id: reply.id, body },
			{
				onSuccess: () => {
					setEditing(false);
				},
			}
		);
	};

	const onDelete = async () => {
		deleteReply({ slug: reply.parent, id: reply.id });
	};

	return (
		<div
			className={
				child
					? "break-words whitespace-pre-line"
					: "mb-8 last:mb-0 break-words whitespace-pre-line"
			}
		>
			{withUserLine ? <UserLine user={reply.owner} /> : null}
			<div
				className={
					child ? "p-2 " : "px-4 py-2 border-l border-gray-200 ml-2.5"
				}
			>
				{editing ? (
					<ThreadReplyForm
						body={body}
						onChange={(e) => setBody(e.target.value)}
						isLoading={isLoading}
						error={error}
						onSubmit={onEdit}
						withUserLine={false}
					/>
				) : (
					<>
						<ModStatus reply={reply} />
						<div className="text-sm">
							{!reply.hidden ? (
								<DiscussionsTextRenderer object={reply} />
							) : null}
						</div>
						<div className="mt-4">
							<div className="flex flex-row items-center space-x-2">
								<div>
									<PraiseButton
										initialCount={reply.praise}
										indexUrl={`/discussions/${reply.parent}/replies/${reply.id}`}
									/>
								</div>
								<div>
									<Button
										xs
										onClick={() => {
											onReplyTo
												? onReplyTo(reply.owner)
												: setReplyingTo(reply.owner);
										}}
									>
										<Button.Icon>
											<FontAwesomeIcon icon="reply" />
										</Button.Icon>{" "}
										Reply
									</Button>
								</div>
								{isLoggedIn && user.id === reply.owner.id ? (
									<Dropdown
										items={
											<>
												<Dropdown.Item
													onClick={() =>
														setEditing(true)
													}
												>
													<Dropdown.Item.Icon>
														<FontAwesomeIcon icon="edit" />
													</Dropdown.Item.Icon>{" "}
													Edit
												</Dropdown.Item>
												<Dropdown.Item
													onClick={onDelete}
												>
													<Dropdown.Item.Icon>
														<FontAwesomeIcon icon="trash" />
													</Dropdown.Item.Icon>{" "}
													Delete
												</Dropdown.Item>
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
								) : null}
								<div>
									<div className="text-xs text-gray-400">
										<TimeAgo date={reply.created_at} />
									</div>
								</div>
							</div>
						</div>
					</>
				)}
				<div className="px-4 border-l border-gray-200">
					{childrenReplies &&
						childrenReplies.map((r) => (
							<div key={r.id} className="mt-4">
								<Reply
									child
									reply={r}
									onReplyTo={setReplyingTo}
								/>
							</div>
						))}
					{!child && replyingTo ? (
						<div className="mt-4">
							<ThreadReplyCreateForm
								replyingTo={replyingTo}
								parentReply={reply}
								threadSlug={reply.parent}
								onFinish={() => {
									setReplyingTo(null);
								}}
							/>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default Reply;
