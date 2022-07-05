import Card from "components/ui/Card";
import React from "react";
import PostMedia from "./PostMedia";

export default function PostCard({ post }) {
	return (
		<Card image={post.feature_image} className="flex">
			<Card.Content>
				<PostMedia withImage={false} post={post} />
			</Card.Content>
		</Card>
	);
}
