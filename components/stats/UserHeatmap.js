import Button from "components/ui/Button";
import Spinner from "components/ui/Spinner";
import { useUserHeatmap } from "queries/stats";
import React from "react";
import CalendarHeatmap from "vendor/CalendarHeatmap";

function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
	return Math.ceil(
		((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) +
			minAllowed
	);
}

function UserHeatmap({ user }) {
	const { isLoading, data: graph, error, refetch } = useUserHeatmap(
		user.username
	);

	if (error) return <Button onClick={refetch}>Retry</Button>;

	if (isLoading) return <Spinner small text="Loading activity..." />;

	if (graph && (!graph.data || !graph.max || !graph.avg)) {
		return (
			<div className={"text-center text-sm text-gray-500"}>
				This maker has no activity yet.
			</div>
		);
	}

	return (
		<CalendarHeatmap
			rounded
			classForValue={(v) => {
				if (!v || v === 0) return `color-scale-0`;
				const scale = scaleBetween(v.count, 0, 4, 0, graph.max);
				return `color-scale-${scale}`;
			}}
			values={graph.data.map(({ date, count }) => ({
				date: new Date(date),
				count: count,
			}))}
		/>
	);
}

export default UserHeatmap;
