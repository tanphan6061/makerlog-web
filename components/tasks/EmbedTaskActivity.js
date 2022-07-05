import ErrorCard from "components/ui/ErrorCard";
import Spinner from "components/ui/Spinner";
import { useTask } from "queries/tasks";
import React from "react";
import StubTaskActivity from "./StubTaskActivity";

export default function EmbedTaskActivity({ id }) {
	const { isLoading, data: task, error } = useTask(id);

	if (error) {
		return <ErrorCard statusCode={error.intCode ? error.intCode() : 400} />;
	}
	if (isLoading) return <Spinner small text="Loading task..." />;

	return <StubTaskActivity embed task={task} />;
}
