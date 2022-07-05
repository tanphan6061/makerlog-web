import StdSidebar from "components/sidebars/StdSidebar";
import React from "react";

function getClassName(maxWidthMultiplier) {
	if (maxWidthMultiplier == 1) {
		return `md:mx-2 md:max-w-xl`;
	} else if (maxWidthMultiplier == 2) {
		return `md:mx-4 md:max-w-2xl`;
	} else if (maxWidthMultiplier == 3) {
		return `md:mx-6 md:max-w-2xl`;
	}
}

function NarrowLayout({
	rightSidebar = <StdSidebar />,
	leftSidebar = null,
	maxWidthMultiplier = 2,
	children,
}) {
	return (
		<div className="flex mx-auto">
			<div
				className="flex-auto hidden h-full md:block"
				style={{ width: 0, maxWidth: "100%" }}
			>
				{leftSidebar}
			</div>
			<div
				className={`w-full max-w-full mx-0 ${getClassName(
					maxWidthMultiplier
				)}`}
			>
				{children}
			</div>
			<div
				className="flex-auto hidden h-full md:block"
				style={{ width: 0, maxWidth: "100%" }}
			>
				{rightSidebar}
			</div>
		</div>
	);
}

export default NarrowLayout;
