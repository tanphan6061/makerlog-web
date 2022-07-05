import Button from "components/ui/Button";
import Message from "components/ui/Message";
import { useDeleteWebhook } from "queries/integrations";
import React from "react";

function WebhookRow({ webhook }) {
	const { mutate, isLoading, isSuccess } = useDeleteWebhook();

	if (isSuccess) return null;

	return (
		<tr>
			<td>
				{webhook.token_preview}
				<br />
				<small className="text-xs text-gray-500">
					{webhook.project
						? `(#${webhook.project.name})`
						: "(no tag)"}
				</small>
			</td>
			<td>
				<Button
					danger
					loading={isLoading}
					onClick={() => mutate({ id: webhook.id })}
				>
					Delete
				</Button>
			</td>
		</tr>
	);
}

export default function WebhooksTable({ webhooks }) {
	if (!webhooks || webhooks.length === 0)
		return <Message>No webhooks yet.</Message>;

	return (
		<table className="w-full table-auto">
			<thead>
				<tr>
					<th className="px-4 py-2 border">Hook</th>
					<th className="px-4 py-2 border">Actions</th>
				</tr>
			</thead>
			<tbody>
				{webhooks.map((webhook) => (
					<WebhookRow webhook={webhook} key={webhook.id} />
				))}
			</tbody>
		</table>
	);
}
