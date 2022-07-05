import React from "react";
import {
	useNotifications,
	useStreamNotifications,
	useTitleCounts,
} from "queries/notifications";
import { useAuth } from "stores/AuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "routes";
import { extractResultsFromGroups } from "utils/random";

function NotificationsLink() {
	const { token } = useAuth();
	let { data } = useNotifications();
	data = extractResultsFromGroups(data);
	let count =
		data && data.length > 0
			? data.filter((n) => n.read === false).length
			: 0;
	// TODO: Validate schema
	useStreamNotifications(token);
	useTitleCounts(count);

	return (
		<Link route="notifications">
			<a className={"circle-button " + (count > 0 ? "green " : "")}>
				{count === 0 ? <FontAwesomeIcon icon="bell" /> : count}
			</a>
		</Link>
	);
}

export default NotificationsLink;
