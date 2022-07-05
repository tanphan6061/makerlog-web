import React from "react";
import { useAuth } from "stores/AuthStore";

// Note: this is a bit of a layout hack to make it work with dual layouts seamlessly.

function StickyNav({ sticky = true, children }) {
	const { isLoggedIn } = useAuth();
	return (
		<div
			className={
				(sticky ? " sticky " : "") +
				"top-16 z-30 w-full border-b border-gray-200 bg-gray-50" +
				(isLoggedIn ? " px-4 sm:px-6 lg:px-8 " : " px-4 ")
			}
		>
			<div className="w-full mx-auto">
				<div
					className={
						"flex flex-col flex-grow w-full h-full max-w-full mx-auto max-w-7xl"
					}
				>
					<div className="flex-grow w-full max-w-3xl py-4 mx-auto bg-gray-50">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

export default StickyNav;
