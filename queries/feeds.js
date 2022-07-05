import { default as axios, axiosWrapper } from "utils/axios";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { getLogger } from "utils/logging";
import useWebSocket from "react-use-websocket";
import { buildSocketUrl } from "utils/random";
import { useCallback, useEffect, useMemo } from "react";
import uniqBy from "lodash/uniqBy";

const log = getLogger("feed");

export const FEED_QUERIES = {
	getFeed: "feeds.getFeed",
};

export async function getFeed({ queryKey, pageParam: next = null }) {
	const [_key, { indexUrl }] = queryKey;
	const { data } = await axiosWrapper(axios.get, next ? next : indexUrl);
	return data;
}

export function useFeed(indexUrl, live = true, token = null) {
	const queryClient = useQueryClient();
	const query = useMemo(() => [FEED_QUERIES.getFeed, { indexUrl }], [
		indexUrl,
	]);

	const { lastMessage: latestMessage } = useWebSocket(
		token
			? buildSocketUrl(indexUrl + `?token=${token}`)
			: buildSocketUrl(indexUrl),
		{
			shouldReconnect: () =>
				!indexUrl || indexUrl.startsWith("/feeds/product") || !live,
		}
	);

	const onNewMessage = useCallback(
		(message) => {
			const parsed = JSON.parse(message.data);
			log("Received WS message.", parsed);
			switch (parsed.type) {
				case "day.push":
					queryClient.setQueryData(query, (old) => {
						// TODO: watch
						// Assume all updates are in the past 24 hours, then push to top of stack.
						// Avoids a lengthy search op.
						let pages = old.pages;
						if (!pages)
							return [{ next: null, results: [parsed.payload] }];
						if (pages.length > 0) {
							pages[0].results = uniqBy(
								[parsed.payload, ...pages[0].results],
								"id"
							);
						}
						return {
							pages,
							pageParams: old.pageParams,
						};
					});
					return;
				case "day.pull":
					queryClient.setQueryData(query, (old) => {
						// Assume all updates are in the past 24 hours, then push to top of stack.
						// Avoids a lengthy search op.
						let pages = old.pages;
						if (!old) return old;
						return {
							pages: pages.filter(
								(d) => d.id !== parsed.payload.id
							),
							pageParams: old.pageParams,
						};
					});
			}
		},
		[queryClient, query]
	);

	useEffect(() => {
		if (latestMessage) {
			onNewMessage(latestMessage);
		}
	}, [latestMessage, onNewMessage]);

	return useInfiniteQuery(query, getFeed, {
		getNextPageParam: (lastGroup) => {
			return lastGroup.next;
		},
	});
}
