import React from "react";
import OutboundLink from "components/seo/OutboundLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MarkdownEnabled({ text = "Basic formatting is allowed." }) {
	return (
		<small>
			<OutboundLink
				className="text-gray-500"
				icon
				to="https://www.markdownguide.org/cheat-sheet/"
			>
				<FontAwesomeIcon icon={["fab", "markdown"]} /> {text}
			</OutboundLink>
		</small>
	);
}

export default MarkdownEnabled;
