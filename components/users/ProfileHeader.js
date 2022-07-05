import FollowButton from "components/follows/FollowButton";
import Avatar from "components/ui/Avatar";
import Container from "components/ui/Container";
import React from "react";
import VerifiedBadge from "./badges/VerifiedBadge";
import FullName from "./FullName";

function ProfileHeader({
	user,
	stats = null,
	bottomNav = null,
	halfWidth = false,
	thirdWidth = false,
}) {
	return (
		<>
			<div className="bg-white border-b border-gray-200">
				{!user.header ? (
					<div
						className={`flex items-center justify-center object-cover w-full bg-green-500 ${
							halfWidth ? "h-32" : thirdWidth ? "h-16" : "h-64"
						}`}
					></div>
				) : (
					<img
						src={user.header}
						className={`object-cover w-full ${
							halfWidth ? "h-32" : thirdWidth ? "h-16" : "h-64"
						}`}
						alt=""
					/>
				)}
			</div>
			<div className="relative text-center border-b border-l border-r border-gray-200 bg-gray-50">
				<Container>
					<div
						className="absolute left-0 flex items-center justify-center w-full"
						style={{ top: "-4rem" }}
					>
						<Avatar
							className="border border-green-500"
							user={user}
							size={32}
						/>
					</div>
					<div className="flex-1 min-w-0 py-4 pt-20">
						<h2 className="mb-2 text-xl font-bold text-gray-900 sm:truncate">
							<FullName user={user} />
							<div className="text-sm font-normal text-gray-500">
								@{user.username}
							</div>
						</h2>
						{user.description !== null && (
							<p className="mb-2 text-gray-700">
								{user.description}
							</p>
						)}
						<p className="mb-4">
							<FollowButton user={user} />
						</p>
						<small className="text-sm text-gray-500 space-x-3">
							<VerifiedBadge user={user} />
							<span>🔥 {user.streak} day streak</span>
							<span>👥 {user.follower_count} followers</span>
							{stats && (
								<span>🛠 {stats.products_made} products</span>
							)}
						</small>
					</div>
					{bottomNav}
				</Container>
			</div>
		</>
	);
}

export default ProfileHeader;
