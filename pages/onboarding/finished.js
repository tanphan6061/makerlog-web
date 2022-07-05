import Button from "components/ui/Button";
import React from "react";
import { useAuth } from "stores/AuthStore";
import { requireAuth } from "utils/auth";
import { Link } from "routes";
import OutboundLink from "components/seo/OutboundLink";
import { TwitterFollowButton } from "react-twitter-embed";
import OnboardingLayout from "layouts/OnboardingLayout";
import { NextSeo } from "next-seo";
import { trackEvent } from "vendor/segment";

function OnboardingFinished() {
	const { patchUser } = useAuth();

	return (
		<OnboardingLayout>
			<OnboardingLayout.Progress className="w-full" />
			<OnboardingLayout.Tutorial
				buttons={
					<div className="flex w-full">
						<Link route="onboarding-profile">
							<div>
								<Button>Previous</Button>
							</div>
						</Link>
						<div className="flex-grow"></div>
						<div
							onClick={() => {
								patchUser({});
								trackEvent("Onboarding Finished");
							}}
						>
							<Link route="index">
								<Button primary>Done</Button>
							</Link>
						</div>
					</div>
				}
			>
				<h2 style={{ marginBottom: "0.5em" }}>Next steps</h2>
				<p>
					Here's a couple of next steps to make the most of the
					experience.
				</p>
				<div className="flex mt-4">
					<div className="flex-shrink-0">
						<div className="flex items-center justify-center w-12 h-12 text-white bg-gray-200 rounded-md">
							💬
						</div>
					</div>
					<div className="ml-4">
						<dt className="font-medium text-gray-900 text-md leading-6">
							Join the chats
						</dt>
						<dd className="mt-1 text-sm text-gray-500">
							<OutboundLink to="https://getmakerlog.com/slack">
								Slack
							</OutboundLink>{" "}
							and{" "}
							<OutboundLink to="https://getmakerlog.com/telegram">
								Telegram
							</OutboundLink>
						</dd>
					</div>
				</div>
				<div className="flex mt-4">
					<div className="flex-shrink-0">
						<div className="flex items-center justify-center w-12 h-12 text-white bg-gray-200 rounded-md">
							📚
						</div>
					</div>
					<div className="ml-4">
						<dt className="font-medium text-gray-900 text-md leading-6">
							Read the blog
						</dt>
						<dd className="mt-1 text-sm text-gray-500">
							<OutboundLink to="https://getmakerlog.com/stories">
								We interview
							</OutboundLink>{" "}
							great makers weekly.
						</dd>
					</div>
				</div>
				<div className="flex mt-4">
					<div className="flex-shrink-0">
						<div className="flex items-center justify-center w-12 h-12 text-white bg-gray-200 rounded-md">
							🐦
						</div>
					</div>
					<div className="ml-4">
						<dt className="font-medium text-gray-900 text-md leading-6">
							Follow on Twitter
						</dt>
						<dd className="mt-1 text-sm text-gray-500">
							<TwitterFollowButton screenName={"getmakerlog"} />
						</dd>
					</div>
				</div>
			</OnboardingLayout.Tutorial>
			<OnboardingLayout.Action className="relative bg-green-900 bg-bubbles-large">
				<div className="absolute top-0 left-0 w-full h-full bg-green-900 opacity-75"></div>
			</OnboardingLayout.Action>
			<NextSeo title="Onboarding" />
		</OnboardingLayout>
	);
}

OnboardingFinished.getInitialProps = async () => {
	return {
		layout: {
			withoutShell: true,
		},
	};
};

export default requireAuth(OnboardingFinished);
