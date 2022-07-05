import React, { useRef } from "react";
import { useThread, getThread, DISCUSSION_QUERIES } from "queries/discussions";
import { useRouter } from "next/router";
import ErrorCard from "components/ui/ErrorCard";
import Spinner from "components/ui/Spinner";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import Thread from "components/discussions/Thread";
import ThreadReplies from "components/discussions/ThreadReplies";
import { ThreadReplyCreateForm } from "components/discussions/ThreadReplyForm";
import Card from "components/ui/Card";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import truncate from "lodash/truncate";
import config from "config";
import { getErrorResponse } from "utils/error";

function DiscussionThreadPage() {
	const router = useRouter();
	const { slug } = router.query;
	const { isLoading, data: thread, error } = useThread(slug);
	const repliesEnd = useRef(null);

	if (isLoading) return <Spinner text="Loading discussion..." />;

	if (error) {
		return <ErrorCard statusCode={error.intCode ? error.intCode() : 400} />;
	}

	return (
		<NarrowLayout>
			<div className="mb-4">
				<Thread
					full
					withActionBar={false}
					withActionBarPage
					thread={thread}
				/>
			</div>
			<div>
				<Card>
					<Card.Content>
						<ThreadReplyCreateForm
							threadSlug={thread.slug}
							onFinish={() => {
								if (repliesEnd) {
									repliesEnd.current.scrollIntoView({
										behavior: "smooth",
									});
								}
							}}
						/>
					</Card.Content>
				</Card>
			</div>
			<div className="mt-4">
				<h4 className="mb-2 font-semibold text-gray-700">
					{thread.reply_count} replies
				</h4>
				<ThreadReplies thread={thread} />
				<div ref={repliesEnd}></div>
			</div>

			<NextSeo
				title={thread.title}
				description={truncate(thread.body, 60, "...")}
				canonical={`${config.BASE_URL}/discussions/${thread.slug}`}
				openGraph={{
					images: [
						{
							url: thread.og_image,
						},
					],
				}}
			/>
		</NarrowLayout>
	);
}

DiscussionThreadPage.getInitialProps = async ({ res, query: { slug } }) => {
	const queryClient = new QueryClient();

	try {
		await queryClient.prefetchQuery(
			[DISCUSSION_QUERIES.getThread, { slug }],
			getThread,
			{},
			{
				throwOnError: true,
			}
		);

		return {
			dehydratedState: dehydrate(queryClient),
			layout: {
				layout: "app",
				allowGuest: true,
			},
		};
	} catch (e) {
		return getErrorResponse(e, res);
	}
};

export default DiscussionThreadPage;
