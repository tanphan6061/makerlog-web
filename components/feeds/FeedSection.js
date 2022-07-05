import React from "react";
import { getRelativeDate } from "utils/random";
import FeedCard from "./FeedCard";

export default function FeedSection({ date, activities }) {
	return (
		<div className="mb-4 last:mb-0">
			<h3 className="mb-2 font-semibold">
				{getRelativeDate(new Date(date), true)}
			</h3>
			{Object.keys(activities).map((key) => (
				<FeedCard key={key} objects={activities[key]} />
			))}
		</div>
	);
}
