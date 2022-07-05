import React from "react";
import { orderActivities, normalizeTimezones } from "utils/getstream";
import ErrorCard from "components/ui/ErrorCard";
import Button from "components/ui/Button";
import { ErrorBoundary } from "react-error-boundary";
import Spinner from "components/ui/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import Activity from "./Activity";

function ErrorFallback({ componentStack }) {
	return <ErrorCard trace={componentStack} />;
}

class ActivityFeed extends React.Component {
	render() {
		let data = normalizeTimezones(
			this.props.activities,
			this.props.user ? this.props.user.timezone : null
		);
		data = orderActivities(data);

		if (data.length === 0 && !this.props.hasMore && !this.props.isSyncing) {
			return this.props.noActivityComponent;
		}

		return (
			<InfiniteScroll
				dataLength={data.length}
				next={this.props.loadMore}
				hasMore={this.props.hasMore}
				style={{ overflow: "none" }}
				//key={isServer}
			>
				<div id="ActivityFeed" className="ActivityFeed">
					{this.props.failed && (
						<ErrorCard
							message="Failed to load the feed."
							actions={
								<Button
									primary
									loading={this.props.isSyncing}
									onClick={this.props.loadMore}
								>
									Retry
								</Button>
							}
						/>
					)}

					<ErrorBoundary FallbackComponent={ErrorFallback}>
						{Object.entries(data).map(([, activity]) => {
							return (
								<Activity
									key={activity.id}
									activity={activity}
								/>
							);
						})}
					</ErrorBoundary>

					{this.props.hasMore && (
						<center>
							<Button
								loading={this.props.isSyncing}
								onClick={this.props.loadMore}
							>
								Load more activity...
							</Button>
						</center>
					)}
					{!this.props.hasMore && this.props.isSyncing && (
						<div className={"center ActivityFeed--section"}>
							<Spinner text="Loading the makerness..." />
						</div>
					)}
					{!this.props.hasMore &&
						!this.props.isSyncing &&
						!this.props.failed && (
							<center className="text-xs text-gray-400 ActivityFeed--section">
								That's all.
							</center>
						)}
				</div>
			</InfiniteScroll>
		);
	}
}

ActivityFeed.defaultProps = {
	noActivityComponent: <div>No activity here.</div>,
	activities: [],
};

export default ActivityFeed;
