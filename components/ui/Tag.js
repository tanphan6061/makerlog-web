import React from "react";

export default function Tag({ children }) {
	return (
		<div className="inline-flex p-1 mb-2 mr-2 text-xs border border-gray-200 bg-gray-50 last:mr-0 rounded-md last:mb-0">
			{children}
		</div>
	);
}
