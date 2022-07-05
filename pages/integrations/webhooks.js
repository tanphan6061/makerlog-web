import ErrorMessageList from "components/error/ErrorMessageList";
import WebhookCreator from "components/integrations/WebhookCreator";
import WebhooksApi from "components/integrations/WebhooksApi";
import WebhooksTable from "components/integrations/WebhooksTable";
import Card from "components/ui/Card";
import PageHeader from "components/ui/PageHeader";
import Spinner from "components/ui/Spinner";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import { useApps } from "queries/integrations";
import React from "react";

export default function WebhooksIntegrationPage() {
	const { data: apps, isLoading, error, isSuccess } = useApps();

	return (
		<NarrowLayout>
			<PageHeader>
				<div>
					<h2 className="font-bold">Webhooks</h2>
					<p className="text-gray-700">
						Create webhooks and log from anywhere with HTTP access.
					</p>
				</div>
			</PageHeader>
			<Card>
				<Card.Content>
					{isLoading && <Spinner />}
					{error && <ErrorMessageList error={error} />}
					{isSuccess && (
						<>
							<div className="mb-4">
								<h4 className="font-bold">Create webhook</h4>
								<p className="mb-4 text-sm text-gray-700">
									Select a project then use the secret
									generated webhook to post from anywhere.
								</p>
								<WebhookCreator />
							</div>
							<div className="mb-4">
								<WebhooksApi />
							</div>
							<div className="mb-4">
								<h4 className="mb-4 font-bold">
									Your webhooks
								</h4>
								<WebhooksTable
									webhooks={
										apps.webhook
											? apps.webhook.webhooks
											: []
									}
								/>
							</div>
						</>
					)}
				</Card.Content>
			</Card>

			<NextSeo title="Webhooks" />
		</NarrowLayout>
	);
}
