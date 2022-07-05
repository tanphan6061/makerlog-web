import Ad from "components/ads/Ad";
import Card from "components/ui/Card";
import config from "config";
import React from "react";
import { Link } from "routes";
import { useAuth } from "stores/AuthStore";
import { isAdsDisabled } from "utils/patron";
import SidebarItem from "./SidebarItem";

export default function AdSidebarCard() {
	const { user } = useAuth();
	if (isAdsDisabled(user)) return null;
	if (config.IS_WL) return null;

	return (
		<SidebarItem
			title="Indie ad"
			titleRight={
				<h3
					className="flex-none mb-2 text-xs text-gray-500 leading-4"
					id="projects-headline"
				>
					<Link route="book-ad">Advertise here!</Link>
				</h3>
			}
		>
			<Card mb={false} className="mb-1">
				<Card.Content>
					<Ad />
				</Card.Content>
			</Card>
			{user && !user.patron && (
				<small className="text-xs text-gray-400">
					Disable ads by{" "}
					<Link route="patron">
						<a>becoming a Patron.</a>
					</Link>
				</small>
			)}
		</SidebarItem>
	);
}
