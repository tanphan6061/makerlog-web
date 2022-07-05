import React from "react";

export default function WebhooksApi() {
	return (
		<div>
			<h4 className="mb-4 font-bold">Parameters</h4>
			<table className="w-full mb-4 table-auto">
				<thead>
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Required</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>content</td>
						<td>String</td>
						<td>Yes</td>
						<td>The content of the task.</td>
					</tr>
					<tr>
						<td>done</td>
						<td>Boolean</td>
						<td>Yes</td>
						<td>The task status.</td>
					</tr>
				</tbody>
			</table>
			<h4 className="font-bold">Return values</h4>
			<p className="mb-4 text-gray-500">
				Webhooks return a regular task object, with a few changes.
			</p>
			<table className="w-full table-auto">
				<thead>
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>update_hook</td>
						<td>String</td>
						<td>
							A URL you can use to later update the task. POST any
							changes to it.
						</td>
					</tr>
					<tr>
						<td>content</td>
						<td>String</td>
						<td>The content of the log created.</td>
					</tr>
					<tr>
						<td>done</td>
						<td>String</td>
						<td>Whether it was marked as done</td>
					</tr>
					<tr>
						<td>done_at</td>
						<td>Timestamp</td>
						<td>
							This will be returned depending if done is true.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
