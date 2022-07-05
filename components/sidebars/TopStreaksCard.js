import Card from "components/ui/Card";
import Spinner from "components/ui/Spinner";
import UserMedia from "components/ui/UserMedia";
import { useWorldStats } from "queries/stats";
import React from "react";
import SidebarItem from "./SidebarItem";

export default function TopStreaksCard() {
	const { isLoading, data: worldStats, error } = useWorldStats();

	if (error) return null;

	return (
		<SidebarItem title="Top">
			<Card>
				<Card.Content>
					{isLoading && <Spinner small text="Loading users..." />}
					{worldStats &&
						worldStats.top_users &&
						worldStats.top_users.length === 0 && (
							<center>
								<div className="text-xs text-gray-700">
									🍃 Nothing yet.
								</div>
							</center>
						)}
					{worldStats && worldStats.top_users && (
						<div className="space-y-2">
							{worldStats.top_users.slice(0, 10).map((user) => (
								<UserMedia
									truncateName
									extraStreakText={false}
									key={user.id}
									user={user}
								/>
							))}
						</div>
					)}
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}
