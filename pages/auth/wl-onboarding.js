import ErrorMessageList from "components/error/ErrorMessageList";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import Message from "components/ui/Message";
import config from "config";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Link } from "routes";
import { useAuth } from "stores/AuthStore";

function WlOnboarding() {
	const { loading, loginWithToken, errorMessages } = useAuth();
	const { query } = useRouter();

	useEffect(() => {
		if (query.invite) loginWithToken(query.invite);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<NarrowLayout
			maxWidthMultiplier={1}
			leftSidebar={null}
			rightSidebar={null}
		>
			<Card>
				<Card.Content>
					<h3 className="font-bold">
						Welcome to {config.WL_FULL_NAME}
					</h3>
					<ul>
						<li className="p-2">
							✅ <strong>Stay accountable</strong> by building
							your projects in public alongside other makers.
						</li>
						<li className="p-2">
							🔥 <strong>Stay motivated</strong> by earning
							streaks, consecutive days of working on your
							projects.
						</li>
						<li className="p-2">
							🌎 <strong>Share your work</strong> and get great
							feedback from our incredibly supportive community.
						</li>
						<li className="p-2">
							🥰 <strong>Get inspired</strong> with our weekly
							newsletter and awesome founder interviews.
						</li>
					</ul>
					<hr className="my-4" />
					<h3 className="pb-2 font-bold">How does it work?</h3>
					<p>
						<div className="flex flex-col max-w-lg mx-auto space-y-4 lg:grid-cols-3 lg:max-w-none">
							<div>
								<div className="flex items-center">
									<span
										className={
											"flex-none flex items-center justify-center w-6 h-6 p-2 mx-2 font-semibold text-center rounded-full bg-green-500 text-white"
										}
									>
										1
									</span>
									<p className="flex flex-col">
										<span className="font-medium">
											Log your daily tasks.
										</span>
										<span className="text-gray-700">
											Share your completed tasks publicly
											to stay accountable.
										</span>
									</p>
								</div>
							</div>

							<div>
								<div className="flex items-center">
									<span
										className={
											"flex-none flex items-center justify-center w-6 h-6 p-2 mx-2 font-semibold text-center rounded-full bg-green-500 text-white"
										}
									>
										2
									</span>
									<p className="flex flex-col">
										<span className="font-medium">
											Earn a streak.
										</span>
										<span className="text-gray-700">
											A streak is the count of consecutive
											days of completed tasks.
										</span>
									</p>
								</div>
							</div>

							<div>
								<div className="flex items-center">
									<span
										className={
											"flex-none flex items-center justify-center w-6 h-6 p-2 mx-2 font-semibold text-center rounded-full bg-green-500 text-white"
										}
									>
										3
									</span>
									<p className="flex flex-col">
										<span className="font-medium">
											Learn & grow.
										</span>
										<span className="text-gray-700">
											Share your achievements, encourage
											others, and grow with us.
										</span>
									</p>
								</div>
							</div>
						</div>
						<div className="mt-8">
							{!query.invite ? (
								<Message danger>
									No invite token supplied.
								</Message>
							) : (
								<center>
									<div className="mb-2">
										<small>
											<strong>Ready?</strong> Let's go. 👇
										</small>
									</div>
									{errorMessages ? (
										<ErrorMessageList
											error={errorMessages}
										/>
									) : (
										<Link route="index">
											<Button loading={loading} primary>
												Get started on{" "}
												{config.WL_FULL_NAME}
											</Button>
										</Link>
									)}
								</center>
							)}
						</div>
					</p>
				</Card.Content>
			</Card>
			<NextSeo title="Welcome" />
		</NarrowLayout>
	);
}

WlOnboarding.getInitialProps = async () => {
	return {
		layout: {
			className: config.WL_BG_COLOR,
		},
	};
};

export default WlOnboarding;
