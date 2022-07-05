import PlaceholderState from "components/ui/PlaceholderState";
import Spinner from "components/ui/Spinner";
import React from "react";
import PostMedia from "./PostMedia";

export default function PostGrid({ posts }) {
	if (!posts) {
		return (
			<PlaceholderState>
				<Spinner small text="Loading the freshest interviews..." />
			</PlaceholderState>
		);
	}

	if (posts.length === 0) {
		return (
			<PlaceholderState>
				<small>No interviews yet.</small>
			</PlaceholderState>
		);
	}

	return (
		<div className="max-w-lg mx-auto grid gap-5 md:grid-cols-3 md:max-w-none">
			{posts.map((post) => (
				<PostMedia post={post} key={post.id} />
			))}
		</div>
	);
}
