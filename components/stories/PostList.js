import PlaceholderState from "components/ui/PlaceholderState";
import Spinner from "components/ui/Spinner";
import React from "react";
import PostMedia from "./PostMedia";

export default function PostList({ posts }) {
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
		<div className="flex flex-col space-y-4">
			{posts.map((post) => (
				<PostMedia horizontal post={post} key={post.id} />
			))}
		</div>
	);
}
