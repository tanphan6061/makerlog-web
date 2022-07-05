import NarrowLayout from "layouts/NarrowLayout";
import React, { useRef, useEffect } from "react";
import Container from "components/ui/Container";
import {
	getPost,
	STORY_QUERIES,
	usePost,
	useRelatedPosts,
	useStoryMetadata,
} from "queries/stories";
import { useRouter } from "next/router";
import Spinner from "components/ui/Spinner";
import ErrorCard from "components/ui/ErrorCard";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import PostHeading from "components/stories/PostHeading";
import SubscribeCard from "components/stories/SubscribeCard";
import PostGrid from "components/stories/PostGrid";
import PlaceholderState from "components/ui/PlaceholderState";
import Button from "components/ui/Button";
import UserMedia from "components/ui/UserMedia";
import ProductMedia from "components/products/ProductMedia";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getLinkedInShareUrl, getTwitterShareUrl } from "utils/stories";
import { NextSeo } from "next-seo";
import config from "config";
import { getErrorResponse } from "utils/error";
import ThreadReplies from "components/discussions/ThreadReplies";
import { ThreadReplyCreateForm } from "components/discussions/ThreadReplyForm";
import Card from "components/ui/Card";
import { trackEvent } from "vendor/segment";

function StoriesPostPage() {
	const {
		query: { slug },
	} = useRouter();
	const { isLoading, data: post, error } = usePost(slug);
	const { data: relatedPosts } = useRelatedPosts(
		slug,
		post && post.primary_tag ? post.primary_tag.slug : "uncategorized"
	);
	const { isLoading: isLoadingMetadata, data: storyMetadata } =
		useStoryMetadata(slug);
	const repliesEnd = useRef(null);

	useEffect(() => {
		trackEvent("Story Viewed");
	}, []);

	if (isLoading) return <Spinner text="Loading stories..." />;

	if (error) {
		return <ErrorCard />;
	}
	return (
		<div>
			<div className="flex flex-col items-center px-4 pt-12 bg-white border-b border-gray-200 sm:px-0">
				<NarrowLayout rightSidebar={null} leftSidebar={null}>
					<PostHeading post={post} />
					<h1>{post.title}</h1>
					<p className="mt-2 text-gray-700">{post.excerpt}</p>
				</NarrowLayout>
				{post.feature_image && (
					<Container>
						<div className="mt-12">
							<div
								className="relative flex-grow w-full h-48 overflow-hidden"
								style={{ paddingBottom: "56.25%" }}
							>
								<img
									className="absolute bottom-0 object-cover w-full h-full rounded-md"
									src={post.feature_image}
									layout="fill"
								/>
							</div>
						</div>
					</Container>
				)}

				<NarrowLayout rightSidebar={null} leftSidebar={null}>
					<div
						className="my-12  lg:prose-lg prose prose-green dark:prose-dark "
						style={{ fontFamily: "Merriweather" }}
						dangerouslySetInnerHTML={{
							__html: post.html.trimEnd(),
						}}
					></div>
					<div className="flex justify-center pb-8 space-x-2">
						<Button
							anchorElem
							target="_blank"
							href={getTwitterShareUrl(post)}
						>
							<Button.Icon>
								<FontAwesomeIcon icon={["fab", "twitter"]} />
							</Button.Icon>
							Tweet
						</Button>
						<Button
							anchorElem
							target="_blank"
							href={getLinkedInShareUrl(post)}
						>
							<Button.Icon>
								<FontAwesomeIcon icon={["fab", "linkedin"]} />
							</Button.Icon>
							Share
						</Button>
					</div>

					{storyMetadata &&
						(storyMetadata.users.length !== 0 ||
							storyMetadata.products.length !== 0) && (
							<>
								<hr />
								<div className="my-8 space-y-8">
									<div>
										<p className="heading">Makers</p>
										{storyMetadata.users.map((user) => (
											<UserMedia
												user={user}
												key={user.id}
											/>
										))}
									</div>
									<div>
										<p className="heading">Products</p>
										{storyMetadata.products.map(
											(product) => (
												<ProductMedia
													product={product}
													key={product.slug}
												/>
											)
										)}
									</div>
								</div>
							</>
						)}
				</NarrowLayout>
			</div>

			<Container>
				<SubscribeCard />
				<div className="py-8">
					<h2 className="mb-4 font-bold">Discuss on Makerlog</h2>
					{storyMetadata && storyMetadata.threads.length !== 0 && (
						<div className="mt-4">
							<Card>
								<Card.Content>
									<ThreadReplyCreateForm
										threadSlug={
											storyMetadata.threads[0].slug
										}
										onFinish={() => {
											if (repliesEnd) {
												repliesEnd.current.scrollIntoView(
													{
														behavior: "smooth",
													}
												);
											}
										}}
									/>
								</Card.Content>
							</Card>
							<h4 className="mb-2 font-semibold text-gray-700">
								{storyMetadata.threads[0].reply_count} replies
							</h4>
							<ThreadReplies thread={storyMetadata.threads[0]} />

							<div ref={repliesEnd}></div>
						</div>
					)}
					{isLoadingMetadata && (
						<PlaceholderState>
							<Spinner small text="Loading..." />
						</PlaceholderState>
					)}
				</div>
				<div className="py-8">
					<h2 className="mb-4 font-bold">Read next</h2>
					<PostGrid posts={relatedPosts} />
				</div>
			</Container>

			<NextSeo
				title={post.title}
				titleTemplate="%s | Makerlog Stories"
				description={post.excerpt}
				openGraph={{
					images: [
						{
							url:
								(post.twitter_image
									? `https://blog.getmakerlog.com/${post.twitter_image}`
									: false) ||
								post.feature_image ||
								`${config.BASE_URL}/img/og/stories.png`,
						},
					],
				}}
			/>
		</div>
	);
}

StoriesPostPage.getInitialProps = async ({ res, query: { slug } }) => {
	const queryClient = new QueryClient();

	try {
		await queryClient.prefetchQuery(
			[STORY_QUERIES.getPost, { slug }],
			getPost,
			{},
			{ throwOnError: true }
		);

		return {
			dehydratedState: dehydrate(queryClient),
			layout: {
				contained: false,
			},
		};
	} catch (e) {
		return getErrorResponse(e, res);
	}
};

export default StoriesPostPage;
