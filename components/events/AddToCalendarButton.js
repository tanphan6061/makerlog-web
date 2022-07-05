import Button from "components/ui/Button";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";

const ICalendar = dynamic(() =>
	import("datebook").then((mod) => mod.ICalendar)
);

export default function AddToCalendarButton({ event }) {
	const getICalFiles = useCallback(() => {
		const icalendar = new ICalendar({
			title: event.title,
			description: event.description,
			start: new Date(event.starts_at),
			end: new Date(event.ends_at),
		});
		icalendar.download();
	}, [event]);

	return (
		<Button xs onClick={getICalFiles}>
			Add to calendar
		</Button>
	);
}
