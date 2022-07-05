import React from "react";
import dynamic from "next/dynamic";

const ValuePlaceholder = ({ value }) => <span>{value}</span>;

const Odometer = dynamic(import("react-odometerjs"), {
	ssr: false,
	loading: ValuePlaceholder,
});

export default function Streak({ days, animated = false, text = false }) {
	return (
		<span className="streak">
			🔥
			{animated ? (
				<span className="inline-flex">
					<Odometer value={days} />
				</span>
			) : (
				<>&nbsp;{days}</>
			)}
			{text ? " day streak" : ""}
		</span>
	);
}
