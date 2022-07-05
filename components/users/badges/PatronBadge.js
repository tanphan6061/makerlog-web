import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from "config";
import React from "react";
import { isPatron } from "utils/patron";

export default function PatronBadge({ user, force = false, sm = false }) {
	return force ||
		(isPatron(user) &&
			!user.verified &&
			!user.is_staff &&
			!config.AWESOME_CLUB.includes(user.username)) ? (
		<span
			className={`${
				sm ? "text-sm" : "text-xs"
			} text-yellow-500 text-uppercase`}
		>
			<FontAwesomeIcon icon="check-circle" />
			&nbsp;
			<span className={force ? "" : "hidden sm:inline-block"}>
				Patron
			</span>
		</span>
	) : null;
}
