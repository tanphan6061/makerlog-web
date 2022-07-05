import React from "react";
import UserLine from "components/ui/UserLine";
import FullName from "components/users/FullName";
import { Link } from "routes";
import Thread from "components/discussions/Thread";
import Reply from "components/discussions/Reply";
import Task from "components/tasks/Task";
import Message from "components/ui/Message";
import Comment from "components/comments/Comment";
import TimeAgo from "react-timeago";
import UserMedia from "components/ui/UserMedia";
import FollowButton from "components/follows/FollowButton";
import MilestoneMedia from "components/milestones/MilestoneMedia";

function getTargetLink(type, target) {
	if (!type || !target) return null;
	switch (type) {
		case "thread":
			return (
				<Link route="discussions-thread" params={{ slug: target.slug }}>
					<a>"{target.title}"</a>
				</Link>
			);

		case "milestone":
			return (
				<Link route="milestone" params={{ slug: target.slug }}>
					<a>"{target.title}"</a>
				</Link>
			);

		case "task":
			return (
				<Link route="task" params={{ id: target.id }}>
					<a>"{target.content}"</a>
				</Link>
			);

		case "reply":
			return (
				<Link
					route="discussions-thread"
					params={{ slug: target.parent }}
				>
					<a>your reply</a>
				</Link>
			);

		default:
			return type;
	}
}

function getObjectComponent(type, obj) {
	if (!obj) return null;

	switch (type) {
		case "task":
			return <Task task={obj} />;

		case "reply":
			return <Reply withUserLine={false} reply={obj} />;

		case "thread":
			return <Thread withUserLine={false} thread={obj} />;

		case "user":
			return <UserMedia user={obj} />;

		case "comment":
			return <Comment comment={obj} />;

		case "milestone":
			return <MilestoneMedia milestone={obj} />;

		default:
			return (
				<Message warning>Missing object definition for {type}.</Message>
			);
	}
}

function getNotificationContent(notification) {
	switch (notification.key) {
		case "user_joined":
			return (
				<div>
					<h5 className="text-base font-medium">
						Welcome to Makerlog!
					</h5>
					<p>We're so glad to have you here!</p>
				</div>
			);

		case "thread_replied":
		case "received_praise":
		case "mention_discussion":
		case "user_mentioned":
		case "task_commented":
		case "milestone_created":
			return (
				<div>
					<h5 className="mb-4 text-base font-medium">
						<span className="font-semibold">
							<FullName user={notification.actor} />
						</span>{" "}
						{notification.verb.substring(
							0,
							notification.verb.lastIndexOf(" ")
						)}{" "}
						<span className="font-semibold">
							{getTargetLink(
								notification.target_type,
								notification.target
							)}
						</span>
					</h5>
					{notification.obj
						? getObjectComponent(
								notification.obj_type,
								notification.obj
								// eslint-disable-next-line
						  )
						: notification.target
						? getObjectComponent(
								notification.target_type,
								notification.target
								// eslint-disable-next-line
						  )
						: null}
				</div>
			);

		case "user_followed":
			return (
				<div>
					<h5 className="mb-4 text-base font-medium">
						Hooray,{" "}
						<span className="font-semibold">
							<FullName user={notification.actor} />
						</span>{" "}
						followed you!
					</h5>
					{notification.actor && (
						<FollowButton followBack user={notification.actor} />
					)}
				</div>
			);

		default:
			return (
				<Message warning title="Oops, something went wrong.">
					Missing content for key {notification.key}.
				</Message>
			);
	}
}

function Notification({ notification }) {
	if (!notification || !notification.actor) return null;

	const content = getNotificationContent(notification);
	if (!content) return null;

	return (
		<div
			className={
				"py-6 border-b border-gray-200 first:pt-0 last:border-none last:pb-0 "
			}
		>
			{notification.actor !== null && (
				<div className="mb-2">
					{notification.key && notification.key === "user_joined" ? (
						<UserLine
							user={{
								username: "makerlog",
								first_name: "Makerlog",
								last_name: "",
								avatar: "/img/logo-icon.png",
							}}
						/>
					) : (
						<UserLine user={notification.actor} />
					)}
				</div>
			)}
			{content}
			{notification.created !== null && (
				<div className="mt-2">
					<small className="text-xs text-gray-500">
						<TimeAgo date={notification.created} />
					</small>
				</div>
			)}
		</div>
	);
}

export default Notification;
