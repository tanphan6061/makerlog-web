import React from "react";
import { format } from "date-fns";

export default function PostHeading({ post }) {
	return (
		<p className="heading">
			{post.primary_tag ? post.primary_tag.name : "Uncategorized"} ·{" "}
			{format(new Date(post.created_at), "MMMM d, yyyy")}
		</p>
	);
}
