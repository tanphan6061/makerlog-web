import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { extractResultsFromGroups } from "utils/random";
import ErrorCard from "components/ui/ErrorCard";
import Button from "components/ui/Button";
import Spinner from "components/ui/Spinner";
import orderBy from "lodash/orderBy";
import Message from "components/ui/Message";

export default function InfiniteSearch({ queryState, renderData = () => {} }) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		status,
		isFetching,
		isFetchingNextPage,
	} = queryState;
	const items = orderBy(extractResultsFromGroups(data), "desc", "rank").map(
		(r) => r.item
	);

	return (
		<InfiniteScroll
			dataLength={items.length}
			next={() => fetchNextPage()} // important!
			hasMore={hasNextPage}
			style={{ overflow: "none" }}
		>
			{status === "loading" ? (
				<div className="flex items-center justify-center w-full h-32">
					<Spinner text="Loading..." small />
				</div>
			) : status === "error" ? (
				<ErrorCard
					message="Failed to load the search results."
					actions={
						<Button
							primary
							loading={isFetching}
							onClick={fetchNextPage}
						>
							Retry
						</Button>
					}
				/>
			) : (
				<>
					<div className="space-y-2">
						{items.map((item, idx) => (
							<div key={idx}>{renderData(item)}</div>
						))}
						{items.length === 0 && (
							<Message info>No results.</Message>
						)}
					</div>
					{hasNextPage && (
						<div className="mt-4">
							<center>
								<Button
									small
									onClick={() => fetchNextPage()}
									loading={isFetchingNextPage}
								>
									Load more results
								</Button>
							</center>
						</div>
					)}
				</>
			)}
		</InfiniteScroll>
	);
}
