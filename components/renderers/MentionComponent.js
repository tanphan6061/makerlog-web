import React from "react";
import { Link } from "routes";

export default function MentionComponent(key, result) {
	return (
		<Link
			route="profile"
			params={{ username: result[0].replace("@", "").replace(" ", "") }}
			key={key}
		>
			<a>{result[0]}</a>
		</Link>
	);
}
