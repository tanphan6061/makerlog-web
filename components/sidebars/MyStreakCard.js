import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OutboundLink from "components/seo/OutboundLink";
import Card from "components/ui/Card";
import RestDays from "components/ui/RestDays";
import Streak from "components/ui/Streak";
import React from "react";
import { useAuth } from "stores/AuthStore";
import { getTwitterShareUrl } from "utils/stats";
import SidebarItem from "./SidebarItem";
import { useStats } from "stores/StatsStore";

export default function MyStreakCard() {
	const { user } = useAuth();
	const { stats } = useStats();

	if (!user) return null;
	const days = stats ? stats.streak : user.streak;

	return (
		<SidebarItem
			title="Your streak"
			titleRight={
				<OutboundLink to={getTwitterShareUrl(user)} className="text-xs">
					<FontAwesomeIcon icon={["fab", "twitter"]} /> Tweet!
				</OutboundLink>
			}
		>
			<Card>
				<Card.Content>
					<h1 className="font-bold text-gray-900">
						<Streak days={days} animated />
						{user.rest_days ? (
							<RestDays days={user.rest_days} />
						) : null}
					</h1>
					<p className="help">
						Build a streak by logging completed tasks daily.
					</p>
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}
