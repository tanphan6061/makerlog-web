import Card from "components/ui/Card";
import UserLine from "components/ui/UserLine";
import React from "react";
import { Link } from "routes";
import { hasEnded, isOcurring } from "utils/events";
import AddToCalendarButton from "./AddToCalendarButton";
import EventDateIcon from "./EventDateIcon";
import EventTextRenderer from "./EventTextRenderer";

export default function EventCard({ event, full = false }) {
	return (
		<Link route="event" params={{ slug: event.slug }}>
			<a className="block mb-4 last:mb-0">
				<Card>
					<Card.Content>
						<div className="flex space-x-4">
							<div className="flex-initial text-gray-900">
								<EventDateIcon event={event} />
							</div>
							<div>
								<h3 className="mb-2 font-semibold text-gray-900">
									{event.title}
								</h3>
								<p className="mb-4 text-gray-700">
									{event.description}
								</p>
								<div className="text-xs space-x-2">
									{!isOcurring(event) && !hasEnded(event) && (
										<AddToCalendarButton event={event} />
									)}
									{!full && (
										<Link
											route="event"
											params={{ slug: event.slug }}
										>
											<a>See details</a>
										</Link>
									)}
								</div>
							</div>
						</div>
						{full && (
							<div>
								<hr className="my-4" />
								{full && <UserLine user={event.user} />}
								<div className="prose dark:prose-dark">
									<EventTextRenderer object={event} />
								</div>
							</div>
						)}
					</Card.Content>
				</Card>
			</a>
		</Link>
	);
}
