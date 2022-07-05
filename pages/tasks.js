import React from "react";
import { requireAuth } from "utils/auth";
import DayView from "components/tasks/DayView";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";

function TasksPage() {
	return (
		<NarrowLayout>
			<DayView />
			<NextSeo title="Tasks" />
		</NarrowLayout>
	);
}

export default requireAuth(TasksPage);
