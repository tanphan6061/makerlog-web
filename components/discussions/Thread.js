import React, { useState } from "react";
import Button from "components/ui/Button";
import truncate from "lodash/truncate";
import Card from "components/ui/Card";
import UserLine from "components/ui/UserLine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThreadReplyFaces from "components/discussions/ThreadReplyFaces";
import { Link, Router } from "routes";
import ThreadEditForm from "./ThreadEditForm";
import ThreadActions from "./ThreadActions";
import { useDeleteThread } from "queries/discussions";
import { isServer } from "config";
import ModStatus from "./ModStatus";
import DiscussionsTextRenderer from "./DiscussionsTextRenderer";
import TimeAgo from "react-timeago";

function Thread({
	thread,
	full = false,
	withActionBar = true,
	withActionBarPage = false,
}) {
	const [editing, setEditing] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const { mutate: deleteMutation } = useDeleteThread();

	const onDelete = async () => {
		deleteMutation(
			{ slug: thread.slug },
			{
				onSuccess: () => {
					setDeleted(true);
					if (!isServer) Router.pushRoute("discussions");
				},
			}
		);
	};

	if (!thread) return null;

	return (
		<Card className="break-word">
			<Card.Content>
				<div className="flex flex-row items-center mb-2">
					<UserLine style={{ marginBottom: 0 }} user={thread.owner} />
				</div>
				{full ? (
					<div>
						{full && (
							<div className="text-xs text-gray-400">
								Posted <TimeAgo date={thread.created_at} />
							</div>
						)}
						<h3 className="mb-2 font-semibold text-gray-900">
							{thread.pinned && (
								<FontAwesomeIcon size="xs" icon="thumbtack" />
							)}{" "}
							{thread.title}
						</h3>
						{deleted ? (
							<div className="italic text-gray-600">
								Content deleted.
							</div>
						) : editing ? (
							<div className="text-gray-900">
								<ThreadEditForm
									thread={thread}
									onFinish={() => setEditing(false)}
								/>
							</div>
						) : thread.hidden ? null : (
							<div className="text-gray-700">
								{full && <ModStatus thread={thread} />}
								{full ? (
									<DiscussionsTextRenderer object={thread} />
								) : (
									truncate(thread.body, { length: 144 })
								)}
							</div>
						)}
					</div>
				) : (
					<Link
						route="discussions-thread"
						params={{ slug: thread.slug }}
					>
						<a>
							<h3 className="mb-2 font-semibold text-gray-900">
								{thread.pinned && (
									<FontAwesomeIcon
										size="xs"
										icon="thumbtack"
									/>
								)}{" "}
								{thread.title}
							</h3>
							{deleted ? (
								<div className="italic text-gray-600">
									Content deleted.
								</div>
							) : editing ? (
								<div className="text-gray-900">
									<ThreadEditForm
										thread={thread}
										onFinish={() => setEditing(false)}
									/>
								</div>
							) : thread.hidden ? null : (
								<div className="text-gray-700 break-words">
									{full && <ModStatus thread={thread} />}
									{full ? (
										<DiscussionsTextRenderer
											object={thread}
										/>
									) : (
										truncate(thread.body, { length: 144 })
									)}
								</div>
							)}
						</a>
					</Link>
				)}
				{withActionBarPage && !editing && (
					<ThreadActions
						thread={thread}
						onEdit={() => setEditing(true)}
						onDelete={() => onDelete()}
					/>
				)}
				{withActionBar && (
					<div className="flex flex-row items-center mt-4">
						<div className="mr-2">
							<Link
								route="discussions-thread"
								params={{ slug: thread.slug }}
							>
								<Button sm>
									<Button.Icon>
										<FontAwesomeIcon icon="reply" />
									</Button.Icon>
									Reply{" "}
									<span
										className={
											thread.reply_count > 0 ? "ml-2" : ""
										}
									>
										<ThreadReplyFaces thread={thread} />
									</span>
								</Button>
							</Link>
						</div>

						<div className="mr-2 text-gray-500">
							{thread.reply_count} replies
						</div>
					</div>
				)}
			</Card.Content>
		</Card>
	);
}

export default Thread;
