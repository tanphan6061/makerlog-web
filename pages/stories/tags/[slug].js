import PostList from "components/stories/PostList";
import ErrorCard from "components/ui/ErrorCard";
import PlaceholderState from "components/ui/PlaceholderState";
import Spinner from "components/ui/Spinner";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { COMMON_TAGS, getTags, STORY_QUERIES, useTags } from "queries/stories";
import React from "react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { getErrorResponse } from "utils/error";

function StoriesTagPage() {
	const {
		query: { slug },
	} = useRouter();
	const { isLoading, data: posts, error } = useTags(
		slug === "interviews" ? COMMON_TAGS.interviews : [slug],
		"all"
	);

	return (
		<div>
			<h1 className="mb-4">Posts tagged "{slug}"</h1>
			{isLoading && (
				<PlaceholderState>
					<Spinner text="Loading posts..." small />
				</PlaceholderState>
			)}
			{posts && <PostList posts={posts} />}
			{error && <ErrorCard />}

			<NextSeo
				title={`Posts tagged ${slug}`}
				titleTemplate="%s | Makerlog Stories"
			/>
		</div>
	);
}

StoriesTagPage.getInitialProps = async ({ res, query: { slug } }) => {
	const queryClient = new QueryClient();

	try {
		await queryClient.prefetchQuery(
			[
				STORY_QUERIES.getTags,
				{
					tags:
						slug === "interviews" ? COMMON_TAGS.interviews : [slug],
					limit: "all",
					filters: [],
				},
			],
			getTags,
			{},
			{ throwOnError: true }
		);

		return {
			dehydratedState: dehydrate(queryClient),
			layout: {
				bgClassName: "bg-white",
			},
		};
	} catch (e) {
		return getErrorResponse(e, res);
	}
};

export default StoriesTagPage;
