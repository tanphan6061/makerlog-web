import React from "react";
import ErrorCard from "components/ui/ErrorCard";
import OutboundLink from "components/seo/OutboundLink";
import Button from "components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NotImplementedPage() {
	return (
		<ErrorCard
			message="This feature has not been implemented yet."
			actions={
				<OutboundLink to="https://twitter.com/matteing">
					<Button>
						<Button.Icon>
							<FontAwesomeIcon icon="external-link-alt" />
						</Button.Icon>{" "}
						Scream at me
					</Button>
				</OutboundLink>
			}
		/>
	);
}

NotImplementedPage.getInitialProps = async () => {
	return {
		layout: {
			layout: "app",
		},
	};
};

export default NotImplementedPage;
