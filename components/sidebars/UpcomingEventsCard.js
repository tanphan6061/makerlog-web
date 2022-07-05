import EventMedia from "components/events/EventMedia";
import Card from "components/ui/Card";
import Spinner from "components/ui/Spinner";
import { useUpcomingEvents } from "queries/events";
import React from "react";
import SidebarItem from "./SidebarItem";

export default function UpcomingEventsCard() {
	const { isLoading, data: events, error } = useUpcomingEvents();

	if (error) return null;

	return (
		<SidebarItem title="Upcoming events">
			<Card>
				<Card.Content>
					{isLoading && <Spinner small text="Loading events..." />}
					{events && events.length === 0 && (
						<center>
							<div className="text-xs text-gray-700">
								🍃 Nothing yet.
							</div>
						</center>
					)}
					<div className="space-y-2">
						{events &&
							events
								.slice(0, 5)
								.map((event) => (
									<EventMedia
										event={event}
										key={event.slug}
									/>
								))}
					</div>
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}
