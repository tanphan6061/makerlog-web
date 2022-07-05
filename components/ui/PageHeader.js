import React from "react";

function PageHeader({ children }) {
	return (
		<div className="flex flex-row mb-4">
			{children}
		</div>
	);
}

export default PageHeader;
