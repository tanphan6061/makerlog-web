import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function VerifiedBadge({ user, iconOnly = false }) {
	return user.verified && !user.is_staff ? (
		<span className="text-xs text-blue-500 text-uppercase">
			<FontAwesomeIcon icon="check-circle" />
			{!iconOnly && <>&nbsp;Verified</>}
		</span>
	) : null;
}
