import React from "react";
import { isOcurring } from "utils/events";

export default function EventDateIcon({
	event,
	size = `w-14 h-14`,
	textSize = "text-lg",
}) {
	const startingDate = new Date(event.starts_at);
	return (
		<div
			className={
				"flex border dark:border-dark-200 flex-col items-center justify-center bg-gray-100 dark:bg-dark-100 rounded-md " +
				size
			}
		>
			{isOcurring(event) ? (
				<p className={"font-bold text-red-500 " + textSize}>LIVE</p>
			) : (
				<>
					<p className="text-xs">
						{startingDate.toLocaleString("default", {
							month: "short",
						})}
					</p>
					<p className={"font-bold " + textSize}>
						{startingDate.getDate()}
					</p>
				</>
			)}
		</div>
	);
}
