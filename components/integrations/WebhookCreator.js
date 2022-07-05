import ErrorMessageList from "components/error/ErrorMessageList";
import Button from "components/ui/Button";
import Form from "components/ui/Form";
import Message from "components/ui/Message";
import Spinner from "components/ui/Spinner";
import { useCreateWebhook } from "queries/integrations";
import { useProjects } from "queries/projects";
import React, { useState } from "react";

export default function WebhookCreator({ event = "webhook" }) {
	const {
		isLoading: isLoadingProjects,
		data: projects,
		error: errorProjects,
	} = useProjects();
	const { mutate, ...mutationState } = useCreateWebhook();
	const [project, setProject] = useState(null);

	if (isLoadingProjects) return <Spinner text="Loading your tags..." />;
	if (errorProjects) return <ErrorMessageList error={errorProjects} />;

	const onCreate = async () => {
		await mutate({ event, project_id: project });
	};

	if (mutationState.data) {
		return (
			<Message>
				<strong>
					Here's your webhook. Don't share it with anyone else!
				</strong>
				<pre>{mutationState.data.url}</pre>
			</Message>
		);
	}

	return (
		<Form>
			<Form.Controls>
				<Form.Field span={3} label="Product hashtag">
					<select
						className="w-full form-select"
						value={project}
						onChange={(e) => {
							setProject(e.target.value);
						}}
					>
						<option value={null}>No hashtag</option>
						{projects.map((project) => (
							<option key={project.id} value={project.id}>
								#{project.name}
							</option>
						))}
					</select>
					<p className="help">
						Select a Makerlog #hashtag to post to.
					</p>
				</Form.Field>
			</Form.Controls>
			<Form.Actions>
				<Button
					onClick={onCreate}
					loading={mutationState.isLoading}
					secondary
				>
					Create webhook
				</Button>
			</Form.Actions>
		</Form>
	);
}
