import React from "react";
import FullName from "components/users/FullName";
import Streak from "./Streak";
import Avatar from "./Avatar";
import { isNewUser } from "utils/user";
import { Link } from "routes";
import PatronBadge from "components/users/badges/PatronBadge";
import VerifiedBadge from "components/users/badges/VerifiedBadge";
import StaffBadge from "components/users/badges/StaffBadge";
import Card from "./Card";
import FollowButton from "components/follows/FollowButton";
import { useAuth } from "stores/AuthStore";
import HoverPopover from "vendor/HoverPopover";

export function VerticalUserMedia({ user }) {
	const { isLoggedIn, user: currentUser } = useAuth();
	return (
		<div className="flex flex-col items-center">
			<Avatar size={10} user={user} />
			<div className="mt-2 font-semibold">
				<FullName user={user} />
			</div>
			<p className="mt-1 text-sm text-center text-gray-700">
				{user.description}
			</p>
			{isLoggedIn && currentUser.id === user.id ? (
				<div className="mt-2 text-sm">
					<Link route="profile" params={{ username: user.username }}>
						<a>View profile</a>
					</Link>
				</div>
			) : (
				<div className="mt-2">
					<FollowButton user={user} />
				</div>
			)}
			<div className="mt-2 text-xs text-gray-700">
				{user.follower_count ?? 0} followers
			</div>
		</div>
	);
}

function UserMedia({
	user,
	action = null,
	actions = null,
	descriptive = false,
	extra = null,
	extraStreakText = false,
	truncateName = false,
}) {
	return (
		<HoverPopover
			tipSize={0.01}
			body={
				<Card className="w-64" floating>
					<Card.Content>
						<VerticalUserMedia user={user} />
					</Card.Content>
				</Card>
			}
		>
			<div className="flex items-center justify-between overflow-hidden space-x-3">
				<Link route="profile" params={{ username: user.username }}>
					<a className="flex-shrink-0">
						<Avatar size={10} user={user} />
					</a>
				</Link>
				<div className="flex-1" style={{ minWidth: 0 }}>
					<span className="text-sm font-medium text-gray-900 leading-5">
						<Link
							route="profile"
							params={{ username: user.username }}
						>
							<a className="text-gray-900 unstyled-a">
								<FullName
									className={
										truncateName ? "block truncate" : ""
									}
									user={user}
								/>
							</a>
						</Link>{" "}
						{action ? (
							<span className="text-gray-700">{action}</span>
						) : null}
					</span>
					{descriptive ? (
						<p className="text-sm text-gray-500 truncate leading-5 space-x-2">
							{user.description}
						</p>
					) : (
						<p className="text-sm text-gray-500 truncate leading-5 space-x-2">
							<span>@{user.username}</span>
							{!truncateName && <StaffBadge user={user} />}
							{!truncateName && <VerifiedBadge user={user} />}
							{!truncateName && <PatronBadge user={user} />}
							<span>
								<Streak
									text={extraStreakText}
									days={user.streak}
								/>
							</span>
							{isNewUser(user) && (
								<span>
									<small>👋</small> Say hi!
								</span>
							)}
							{extra ? extra : null}
						</p>
					)}
					{actions ? actions : null}
				</div>
			</div>
		</HoverPopover>
	);
}

export default UserMedia;
