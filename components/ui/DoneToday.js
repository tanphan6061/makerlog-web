import React from "react";
import dynamic from "next/dynamic";

const ValuePlaceholder = ({ value }) => <span>{value}</span>;

const Odometer = dynamic(import("react-odometerjs"), {
	ssr: false,
	loading: ValuePlaceholder,
});

export default function DoneToday({
	count = 0,
	animated = false,
	text = false,
}) {
	return (
		<span>
			✅
			{animated ? (
				<span className="inline-flex">
					<Odometer value={count} />
				</span>
			) : (
				<>&nbsp;{count}</>
			)}
			{text ? " today" : ""}
		</span>
	);
}
