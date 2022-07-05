import React from "react";
import { Link } from "routes";
import EventDateIcon from "./EventDateIcon";
import truncate from "lodash/truncate";

export default function EventMedia({ event }) {
	return (
		<div className="flex items-center justify-between break-words space-x-3">
			<Link route="event" params={{ slug: event.slug }}>
				<div className="flex flex-shrink-0">
					<EventDateIcon
						event={event}
						size="w-10 h-10"
						textSize="text-sm"
					/>
				</div>
			</Link>
			<div className="flex-1" style={{ minWidth: 0 }}>
				<Link route="event" params={{ slug: event.slug }}>
					<a>
						<h2 className="text-sm font-medium text-gray-900 leading-5">
							{event.title}
						</h2>
					</a>
				</Link>
				<p className="text-sm text-gray-500 truncate leading-5">
					{truncate(event.description, { length: 140 })}
				</p>
			</div>
		</div>
	);
}
