import React, { Component } from "react";
import ActivityFeed from "./ActivityFeed";
import uniqBy from "lodash/uniqBy";
import {
	getStreamClient,
	getStreamClientAndToken,
	getCachedFeed,
} from "utils/getstream";
import { getLogger } from "utils/logging";
import { inject, observer } from "mobx-react";

const log = getLogger("KeyActivityFeed");

const INITIAL_QUERY = {
	limit: 25,
	enriched: true,
};

@inject("auth")
@observer
class KeyActivityFeed extends Component {
	initialState = {
		loading: true,
		initialLoaded: false,
		nextUrl: null,
		activities: [],
		failed: false,
		pages: 0,
	};

	constructor(props) {
		super(props);

		if (this.props.prefetchData) {
			// Prefetched? Override.
			const prefetched = this.props.prefetchData;
			const { nextUrl, activities, token } = prefetched;
			this.token = token;

			this.state = {
				...this.initialState,
				loading: false,
				failed: false,
				activities: activities ? activities : [],
				initialLoaded: true,
				nextUrl: nextUrl,
			};
		} else {
			this.state = this.initialState;
		}
	}

	async componentDidMount() {
		try {
			if (this.token) {
				this.streamClient = await getStreamClient(this.token);
				this.feed = this.streamClient.feed(
					this.props.feed,
					this.props.userId
				);
			} else {
				this.streamClient = await getStreamClient();
				this.feed = this.streamClient.feed(
					this.props.feed,
					this.props.userId
				);
			}
			if (!this.state.initialLoaded) {
				await this.loadMore();
			} else {
				// We are server side rendered. However, the server timezone is not the local one.
				// Show the user the data, then reorder it. Prevents later issues when commenting.
				// This sucks. I don't want to show a spinner because the whole SSR magic is gone.
				// this.forceUpdate();
			}

			this.connect();
		} catch (e) {
			this.setState({
				failed: true,
				loading: false,
			});
		}
	}

	componentWillUnmount() {
		this.disconnect();
	}

	connect = () => {
		this.socket = this.feed.subscribe((data) => {
			log(
				`Processing event from feed listener. (${data.new.length} new, ${data.deleted.length} deleted)`
			);
			if (data.deleted.length > 0) {
				this.setState({
					activities: this.state.activities.filter((a) => {
						return !data.deleted.find((x) => x === a.id);
					}),
				});
			}

			if (data.new.length > 0) {
				this.setState({
					activities: uniqBy(
						[...data.new, ...this.state.activities],
						"id"
					),
				});
			}
		});
	};

	disconnect = () => {
		if (this.socket) {
			this.socket.cancel();
		}
	};

	loadMore = async () => {
		const feed = this.feed;
		try {
			let nextUrl = this.state.nextUrl;
			const depth = this.state.pages + 1;
			this.setState({ loading: true, pages: depth });

			let query = {
				...INITIAL_QUERY,
				id_lt: nextUrl,
			};

			if (this.state.initialLoaded && nextUrl) {
				// Tracking code goes here.
			} else {
				delete query["id_lt"];
			}

			// we now have metadata. go ahead, let's ROLL!
			if (nextUrl || !this.state.initialLoaded) {
				// get the stream data
				const data = await feed.get(query);

				log(
					`Loaded activities for "${this.props.feed}". (${data.results.length} activities)`
				);

				this.setState({
					loading: false,
					failed: false,
					activities: uniqBy(
						[...this.state.activities, ...data.results],
						"id"
					),
					initialLoaded: true,
					nextUrl:
						data.results.length > 0
							? data.results[data.results.length - 1].id
							: null,
				});
			}
		} catch (e) {
			log(`e! ${e}`);
			this.setState({
				failed: true,
				loading: false,
			});
		}
	};

	render() {
		return (
			<ActivityFeed
				isSyncing={this.state.loading}
				loadMore={this.loadMore}
				hasMore={this.state.nextUrl !== null}
				activities={this.state.activities}
				user={this.props.auth.user}
				failed={this.state.failed}
				noActivityComponent={
					this.props.noActivityComponent ? (
						this.props.noActivityComponent
					) : (
						<center>
							<span className="text-xs text-gray-400">
								<strong>Tasks will show up here. 🔥</strong>
							</span>
						</center>
					)
				}
			/>
		);
	}
}

async function prefetchActivity(feedId, userId, useCache = true) {
	try {
		const { client, token } = await getStreamClientAndToken();
		// Implement a caching strategy with the backend (for emergencies).
		let data = null;
		if (useCache) {
			try {
				data = await getCachedFeed(`${feedId}:${userId}`);
			} catch (e) {
				// fall back to the other part
				const feed = client.feed(feedId, userId);
				data = await feed.get(INITIAL_QUERY);
			}
		} else {
			const feed = client.feed(feedId, userId);
			data = await feed.get(INITIAL_QUERY);
		}
		log(
			`Prefetched feed. (${feedId}:${userId}, ${data.results.length} activities)`
		);
		return {
			nextUrl:
				data.results.length > 0
					? data.results[data.results.length - 1].id
					: null,
			activities: data.results,
			token,
		};
	} catch (e) {
		log(`Error preloading stream. ${e.message}`);
		return {};
	}
}

KeyActivityFeed.propTypes = {};

export default KeyActivityFeed;
export { prefetchActivity };
