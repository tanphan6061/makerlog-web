import Task from "components/tasks/Task";
import Card from "components/ui/Card";
import ErrorCard from "components/ui/ErrorCard";
import PageHeader from "components/ui/PageHeader";
import Spinner from "components/ui/Spinner";
import ProfileLayout from "components/users/ProfileLayout";
import config from "config";
import { NextSeo } from "next-seo";
import {
	getTasksUserDay,
	TASK_QUERIES,
	useUserDayTasksTz,
} from "queries/tasks";
import React from "react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { Link, useRouter } from "routes";
import { getErrorResponse } from "utils/error";
import { getCalendarDate } from "utils/random";
import { DoneStates, groupTasksByDone } from "utils/tasks";

function UserTasksDayListView() {
	const {
		query: { username, year, month, day },
	} = useRouter();
	const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
	const { isLoading, data, error } = useUserDayTasksTz(username, date);

	if (error) {
		return <ErrorCard statusCode={error.intCode ? error.intCode() : 400} />;
	}

	if (isLoading) return <Spinner text="Loading list..." />;

	const user = data[0].user;

	const tasks = groupTasksByDone(data ? data : []);

	return (
		<ProfileLayout
			user={user}
			withSeo={false}
			headerProps={{
				bottomNav: (
					<Link route="profile" params={{ username: user.username }}>
						<a className="block pb-4 text-xs">View full profile</a>
					</Link>
				),
			}}
		>
			<PageHeader>
				<div>
					<h2 className="font-bold">
						{getCalendarDate(new Date(date))}
					</h2>
				</div>
			</PageHeader>
			<Card>
				<Card.Content>
					{tasks[DoneStates.IN_PROGRESS].map((t) => (
						<Task task={t} key={t.id} />
					))}
					{tasks[DoneStates.DONE].map((t) => (
						<Task task={t} key={t.id} />
					))}
					{tasks[DoneStates.REMAINING].map((t) => (
						<Task task={t} key={t.id} />
					))}
				</Card.Content>
			</Card>

			<NextSeo
				title={`@${user.username}'s tasks on ${getCalendarDate(
					new Date(date)
				)}`}
				description={`${
					tasks[DoneStates.DONE].length
				} tasks completed, ${
					tasks[DoneStates.IN_PROGRESS].length +
					tasks[DoneStates.REMAINING].length
				} remaining`}
				canonical={`${
					config.BASE_URL
				}/users/${username}/lists/${year.padStart(
					2,
					"0"
				)}/${month.padStart(2, "0")}/${day.padStart(2, "0")}/`}
			/>
		</ProfileLayout>
	);
}

UserTasksDayListView.getInitialProps = async ({
	res,
	query: { username, year, month, day },
}) => {
	const queryClient = new QueryClient();

	try {
		const date = `${year}-${month.padStart(2, "0")}-${day.padStart(
			2,
			"0"
		)}`;
		await queryClient.prefetchQuery(
			[TASK_QUERIES.getTasksUserDay, { username, date }],
			getTasksUserDay,
			{},
			{ throwOnError: true }
		);

		return {
			dehydratedState: dehydrate(queryClient),
			layout: {
				allowGuest: true,
				contained: false,
			},
		};
	} catch (e) {
		return getErrorResponse(e, res);
	}
};

export default UserTasksDayListView;
