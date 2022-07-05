import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import config from "config";

export default function AwesomeBadge({ user }) {
	return config.AWESOME_CLUB.includes(user.username) ? (
		<span className="text-xs text-purple-500 text-uppercase">
			<FontAwesomeIcon icon="check-circle" />
			&nbsp;Awesome
		</span>
	) : null;
}
