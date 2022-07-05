import FeedCard from "components/feeds/FeedCard";
import React from "react";

function makeStubObject(task) {
	return {
		type: "task",
		id: `projects.Task:${task.id}`,
		user: task.user,
		created_at: task.created_at,
		updated_at: task.updated_at,
		tasks: [task],
	};
}

export default function StubTaskActivity({ task, embed = false }) {
	// Emulates the form of an activity to pretend that we have better algorithms for ranking in place...
	// Like a real bysh.
	return <FeedCard objects={[makeStubObject(task)]} embed={embed} />;
}
