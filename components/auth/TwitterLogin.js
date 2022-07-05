import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/ui/Button";
import config from "config";
import React from "react";

export default function TwitterLogin() {
	return (
		<Button
			className="text-blue-500"
			anchorElem={true}
			href={`${config.API_URL}/login/twitter/?next=${config.BASE_URL}/auth/complete/twitter/`}
		>
			<Button.Icon>
				<FontAwesomeIcon icon={["fab", "twitter"]} />
			</Button.Icon>
			Join with Twitter
		</Button>
	);
}
