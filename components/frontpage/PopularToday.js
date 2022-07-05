import StubTaskActivity from "components/tasks/StubTaskActivity";
import React from "react";

export default function PopularToday({ frontpage }) {
	if (!(frontpage && frontpage.tasks && frontpage.tasks.length > 0))
		return null;

	return (
		<div className="mb-4">
			<h3 className="mb-2 font-semibold">Popular</h3>
			{frontpage.tasks.slice(0, 1).map((task) => (
				<StubTaskActivity task={task} key={task.id} />
			))}
		</div>
	);
}
