import React from "react";
import FullName from "components/users/FullName";
import Avatar from "./Avatar";
import { Link } from "routes";
import PatronBadge from "components/users/badges/PatronBadge";
import VerifiedBadge from "components/users/badges/VerifiedBadge";
import StaffBadge from "components/users/badges/StaffBadge";
import AwesomeBadge from "components/users/badges/AwesomeBadge";

function UserLine({ user, className = "", withAvatar = true, style = {} }) {
	return (
		<Link route="profile" params={{ username: user.username }}>
			<a>
				<div
					style={style}
					className={
						"mb-1 text-xs text-gray-900 font-medium flex flex-row items-center" +
						className
					}
				>
					{withAvatar ? (
						<div className="mr-2">
							<Avatar size={6} user={user} />
						</div>
					) : null}
					<div className="space-x-1">
						<FullName user={user} />
						<AwesomeBadge user={user} />
						<StaffBadge user={user} />
						<VerifiedBadge user={user} />
						<PatronBadge user={user} />
						<span className="text-gray-500">@{user.username}</span>
					</div>
				</div>
			</a>
		</Link>
	);
}

export default UserLine;
