import React from "react";

export default function Skill({
	skill,
	selected,
	readOnly = false,
	onClick = () => {},
}) {
	return (
		<span
			onClick={() => onClick(skill)}
			className={
				"capitalize inline-flex items-center text-sm font-medium text-gray-800 bg-gray-100 dark:bg-dark-200 cursor-pointer transition-all ring-green-300 space-x-2 px-2.5 py-0.5 rounded-md" +
				(selected ? " ring-2 ring-green-400 " : "") +
				(!readOnly ? " hover:ring-2 " : "")
			}
		>
			<span className="text-xs">{skill.emoji}</span>{" "}
			<span>{skill.name}</span>
		</span>
	);
}
