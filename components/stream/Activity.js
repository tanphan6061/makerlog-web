import React from "react";
import Card from "components/ui/Card";
import { Activity as ActivityContainer } from "utils/getstream";
import UserMedia from "components/ui/UserMedia";
import pluralize from "pluralize";
import { getLogger } from "utils/logging";
import Task from "components/tasks/Task";
import TaskActions from "components/tasks/TaskActions";
import ErrorCard from "components/ui/ErrorCard";
import { useAuth } from "stores/AuthStore";
import Thread from "components/discussions/Thread";
import Reply from "components/discussions/Reply";
import { Link } from "routes";
import TimeAgo from "react-timeago";
import ActivityDebugger from "./ActivityDebugger";
import { useState } from "react";
import { isDev } from "config";
import ProductMedia from "components/products/ProductMedia";
import MilestoneMedia from "components/milestones/MilestoneMedia";
import MilestoneActions from "components/milestones/MilestoneActions";
import TaskAttachments from "components/tasks/TaskAttachments";

const log = getLogger("activity");

// TODO: Fix ItemLink routes.

function ItemLink({ type, item, children, loggedInOnly = false }) {
	const { isLoggedIn } = useAuth();

	if (!item) return children;

	if (loggedInOnly && !isLoggedIn) {
		return (
			/*<Link route="start">*/
			<a target="_blank" rel="noopener noreferrer">
				{children}
			</a>
			/*</Link> */
		);
	}

	switch (type) {
		case "task":
			return (
				<Link route="task" params={{ id: item.id }}>
					<a>{children}</a>
				</Link>
			);

		case "thread":
			return (
				<Link route="discussions-thread" params={{ slug: item.slug }}>
					<a>{children}</a>
				</Link>
			);

		case "product":
			return (
				<Link route="product" params={{ slug: item.slug }}>
					<a>{children}</a>
				</Link>
			);

		case "reply":
			return (
				<Link href={`/discussions/${item.parent}/#reply-${item.id}`}>
					<a>{children}</a>
				</Link>
			);

		case "milestone":
			return (
				<Link route="milestone" params={{ slug: item.slug }}>
					<a>{children}</a>
				</Link>
			);

		default:
			return children;
	}
}

function getTargetTitle(type, target) {
	if (!target) return null;

	if (type === "thread") {
		return `"${target.title}"`;
	}

	return null;
}

function getHumanTargetType(activity) {
	let getPrefix = (count) => (count == 1 ? "a" : count);
	if (activity.getType() === "aggregated") {
		const count = activity.getRawChildren().length;
		const targetType = activity.childrenHaveSameTargetType()
			? activity.getRawChildren()[0].target_type
			: null;
		const target = activity.childrenHaveSameTargetType()
			? activity.getTargetObject()
			: null;
		if (!targetType) {
			return null;
		}
		const typeText = pluralize(targetType, count);
		const targetTitle = getTargetTitle(targetType, target);
		if (targetTitle) {
			return count == 1 ? (
				<ItemLink item={target} type={targetType}>
					{targetTitle}
				</ItemLink>
			) : (
				`${targetTitle}`
			);
		}
		return count == 1 ? (
			<ItemLink item={target} type={targetType}>
				{getPrefix(count)} {typeText}
			</ItemLink>
		) : (
			`${getPrefix(count)} ${typeText}`
		);
	} else {
		if (!activity.getTarget() || !activity.getTargetType()) {
			return null;
		}
		const target = activity.getTargetObject();
		const targetType = activity.getTargetType();
		const typeText = pluralize(targetType, 1);
		const targetTitle = getTargetTitle(targetType, target);
		if (targetTitle) {
			return (
				<ItemLink item={target} type={targetType}>
					{targetTitle}
				</ItemLink>
			);
		}
		return (
			<ItemLink item={target} type={targetType}>
				{getPrefix(1)} {typeText}
			</ItemLink>
		);
	}
}

function getHumanActivityObject(activity) {
	let getPrefix = (count) => (count == 1 ? "a" : count);
	if (activity.getType() === "aggregated") {
		const count = activity.getRawChildren().length;
		const objectType = activity.childrenHaveSameObjectType()
			? activity.getObject().type
			: "thing";
		const object = activity.childrenHaveSameObjectType()
			? activity.getObject().object
			: null;
		return count == 1 ? (
			<ItemLink item={object} type={objectType}>
				{getPrefix(count)} {pluralize(objectType, count)}
			</ItemLink>
		) : (
			`${getPrefix(count)} ${pluralize(objectType, count)}`
		);
	} else {
		return (
			<ItemLink
				item={activity.getObject().object}
				type={activity.getObjectType()}
			>
				{getPrefix(1)} {pluralize(activity.getObjectType(), 1)}
			</ItemLink>
		);
	}
}

const ActivityTypeUnknown = () => {
	return (
		<ErrorCard
			title="Unknown activity object type."
			message="
		Psst, if you see this in prod, wake up Sergio and tell him
		everything broke again."
		/>
	);
};

const ActivityDeleted = () => {
	return <div className="ActivityItemContainer">Content deleted.</div>;
};

function ActivityObject({ activity }) {
	if (!activity.getObject()) return <ActivityDeleted />;
	const { object, type } = activity.getObject();

	switch (type) {
		case "task":
			// Render without attachments because we're rendering them apart.
			return <Task withAttachments={false} task={object} />;

		case "thread":
			return <Thread thread={object} />;

		case "product":
			return <ProductMedia product={object} />;

		case "milestone":
			return <MilestoneMedia milestone={object} />;

		case "reply":
			return (
				<Reply
					withUserLine={false}
					reply={object}
					thread={activity.getTarget().object}
				/>
			);

		default:
			return <ActivityTypeUnknown />;
	}
}

const ActivityObjectGroup = ({ activities }) => {
	if (activities.length === 0) return null;
	/*
    if (activities.every((a) => a.getObjectType() === "task")) {
		return <TaskActivityGroup activities={activities} />;
    }
    */
	return activities.map((a) => <ActivityObject key={a.id} activity={a} />);
};

function TaskActivityControls({ task, embed = false }) {
	return (
		<div className="p-4 pt-0 actions">
			<TaskActions embed={embed} stream task={task} />
		</div>
	);
}

function MilestoneActivityControls({ milestone }) {
	return (
		<div className="p-4 pt-0 actions">
			<MilestoneActions stream milestone={milestone} />
		</div>
	);
}

const ActivityControls = ({ activity, embed = false }) => {
	if (!activity.getObject() || activity.getType() === "aggregated")
		return null;
	const { object, type } = activity.getObject();

	switch (type) {
		case "task":
			return <TaskActivityControls embed={embed} task={object} />;
		case "milestone":
			return (
				<MilestoneActivityControls embed={embed} milestone={object} />
			);
		default:
			return null;
	}
};

const ActivityAttachment = ({ activity }) => {
	const attachment = activity.getObjectAttachments();
	if (!attachment) return null;
	if (activity.getObjectType() === "task") {
		return (
			<div className="p-4 mb-4 bg-center border border-l-0 border-r-0 border-gray-200 bg-gray-50">
				<TaskAttachments task={activity.getObject().object} />
			</div>
		);
	}
};

function Activity({ activity, embed = false }) {
	const [debuggerOpen, setDebuggerOpen] = useState(false);

	activity = new ActivityContainer(activity);
	if (!activity.check()) {
		log(`An activity failed a integrity check. ${activity.getId()}`);
		return null;
	}

	return (
		<Card>
			<div className="flex p-4 pb-0 actor text-gray-50">
				{activity.getActorObject() &&
					activity.getActorObject().username && (
						<UserMedia
							user={activity.getActorObject()}
							action={
								<>
									{`${activity.getVerb()} `}
									{getHumanTargetType(activity) ||
										getHumanActivityObject(activity)}
								</>
							}
							extra={
								<span className="text-gray-300">
									· <TimeAgo date={activity.getTime()} />
								</span>
							}
						/>
					)}
				<div className="flex-grow"></div>
			</div>
			<Card.Content>
				{activity.getType() === "aggregated" ? (
					<ActivityObjectGroup activities={activity.getChildren()} />
				) : (
					<ActivityObject activity={activity} />
				)}
				{isDev && (
					<small>
						<a
							className="cursor-pointer"
							onClick={() => setDebuggerOpen(true)}
						>
							Debug activity
						</a>
						<ActivityDebugger
							open={debuggerOpen}
							onClose={() => {
								setDebuggerOpen(!debuggerOpen);
							}}
							activity={activity}
						/>
					</small>
				)}
			</Card.Content>
			<ActivityAttachment activity={activity} />
			<ActivityControls embed={embed} activity={activity} />
		</Card>
	);
}

export default Activity;
