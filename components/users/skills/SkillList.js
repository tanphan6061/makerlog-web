import React from "react";

export default function SkillList({ children }) {
	return (
		<div className="flex flex-wrap w-full mb-4 last:mb-0 gap-2 max-w-screen-sm">
			{children}
		</div>
	);
}
