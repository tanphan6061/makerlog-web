import StdSidebar from "components/sidebars/StdSidebar";
import Container from "components/ui/Container";
import React from "react";

function ContentLayout({ rightSidebar = <StdSidebar />, children }) {
	return (
		<Container>
			<div className="flex mx-auto my-4">
				<div
					className={`w-full sm:max-w-4xl max-w-full mx-0 last:mr-0 mr-0 sm:mr-8`}
				>
					{children}
				</div>
				<div
					className="flex-auto hidden w-1/3 h-full md:block"
					style={{ width: 0, maxWidth: "100%" }}
				>
					{rightSidebar}
				</div>
			</div>
		</Container>
	);
}

export default ContentLayout;
