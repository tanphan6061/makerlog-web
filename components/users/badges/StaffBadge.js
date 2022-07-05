import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function StaffBadge({ user }) {
	return user.is_staff ? (
		<span className="text-xs text-green-500 text-uppercase">
			<FontAwesomeIcon icon="check-circle" />
			&nbsp;Staff
		</span>
	) : null;
}
