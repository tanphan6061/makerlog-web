import React from "react";

export default function RestDays({ days, text = false }) {
	return (
		<span>
			🛏
			{days}
			{text ? " rest days" : ""}
		</span>
	);
}
