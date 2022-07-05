import ErrorMessageList from "components/error/ErrorMessageList";
import Card from "components/ui/Card";
import Message from "components/ui/Message";
import PageHeader from "components/ui/PageHeader";
import Spinner from "components/ui/Spinner";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useApps, useLinkSlack } from "queries/integrations";
import React, { useEffect } from "react";

function AddToSlackButton() {
	return (
		<a href="https://slack.com/oauth/authorize?client_id=326793041328.399635065136&scope=bot,commands,links:read">
			<img
				alt="Add to Slack"
				height="40"
				width="139"
				src="https://platform.slack-edge.com/img/add_to_slack.png"
				srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
			/>
		</a>
	);
}

function SlackLinker({ queryState: { isLoading, error, isSuccess } }) {
	if (isLoading) return <Spinner text="Linking with Slack..." />;
	if (error) return <ErrorMessageList error={error} />;
	if (isSuccess) return <Message success>All done.</Message>;

	return (
		<div>
			<div>
				<AddToSlackButton />
			</div>
		</div>
	);
}

export default function SlackIntegrationPage() {
	const router = useRouter();
	const { mutate, ...queryState } = useLinkSlack();
	const { data: apps } = useApps();
	const { code } = router.query;

	useEffect(() => {
		if (
			code &&
			!queryState.isSuccess &&
			!queryState.error &&
			!queryState.isLoading
		) {
			mutate({ code });
		}
	}, [code, mutate, queryState]);

	return (
		<NarrowLayout>
			<PageHeader>
				<div>
					<h2 className="font-bold">Slack</h2>
					<p className="text-gray-700">
						Pair with Slack and log from your workspaces.
					</p>
				</div>
			</PageHeader>
			<Card>
				<Card.Content>
					<SlackLinker queryState={queryState} />
					{apps && apps.linkkey && (
						<p className="help">
							Run <strong>/mlink {apps.linkkey.linkkey}</strong>{" "}
							to pair with Slack.
						</p>
					)}
				</Card.Content>
			</Card>

			<NextSeo title="Slack" />
		</NarrowLayout>
	);
}
