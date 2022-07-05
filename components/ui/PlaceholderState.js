import React from "react";

export default function PlaceholderState({ children }) {
	return (
		<div className="flex items-center justify-center w-full px-12 py-6 mb-4 text-gray-900 bg-gray-100 border border-gray-200 dark:bg-dark-100 dark:border-dark-200 rounded-md last:mb-0">
			{children}
		</div>
	);
}
