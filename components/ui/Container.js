import React from "react";

// Note: container has no PY by default: it should only be concerned with horizontal containment

export default function Container({ children, className = "" }) {
	return (
		<div
			className={
				"container px-4 mx-auto max-w-7xl sm:px-6 lg:px-6 " + className
			}
		>
			{children}
		</div>
	);
}
