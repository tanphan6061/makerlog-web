import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLatestThreads } from "queries/discussions";
import Button from "components/ui/Button";
import { extractResultsFromGroups } from "utils/random";
import orderBy from "lodash/orderBy";
import ErrorCard from "components/ui/ErrorCard";
import Spinner from "components/ui/Spinner";
import Thread from "components/discussions/Thread";

function LatestThreads() {
	const {
		error,
		data,
		isFetching,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useLatestThreads();

	const discussions = orderBy(
		extractResultsFromGroups(data),
		"created_at",
		"desc"
	);

	return (
		<InfiniteScroll
			dataLength={discussions.length}
			next={() => fetchNextPage()}
			hasMore={hasNextPage !== null}
			style={{ overflow: "none" }}
			//key={isServer}
		>
			{discussions.map((d) => (
				<Thread key={d.slug} thread={d} />
			))}

			{hasNextPage && discussions.length > 0 && (
				<center>
					<Button
						loading={isFetching || isFetchingNextPage}
						onClick={() => fetchNextPage()}
					>
						Load more activity...
					</Button>
				</center>
			)}
			{isFetching && !isFetchingNextPage && (
				<div className={"center ActivityFeed--section"}>
					<Spinner text="Loading the makerness..." />
				</div>
			)}

			{error && (
				<ErrorCard
					message="Failed to load the feed."
					actions={
						<Button
							primary
							loading={isFetching || isFetchingNextPage}
							onClick={() => fetchNextPage()}
						>
							Retry
						</Button>
					}
				/>
			)}
		</InfiniteScroll>
	);
}

export default LatestThreads;
