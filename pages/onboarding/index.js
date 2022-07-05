import Editor from "components/editor/Editor";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import React, { useEffect } from "react";
import { useAuth } from "stores/AuthStore";
import { requireAuth } from "utils/auth";
import dynamic from "next/dynamic";
import { Link } from "routes";
import OnboardingLayout from "layouts/OnboardingLayout";
import { NextSeo } from "next-seo";
import { trackEvent } from "vendor/segment";
import Feed from "components/feeds/Feed";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

const defaultOptions = {
	backgroundColor: "#fff",
	beaconSize: 36,
	overlayColor: "rgba(0, 0, 0, 0.5)",
	primaryColor: "#00ad71",
	spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
	textColor: "#333",
	width: undefined,
	zIndex: 100,
};

function OnboardingIndex() {
	// We patch the user to disable needs_setup.
	const { user, patchUser } = useAuth();

	useEffect(() => {
		trackEvent("Onboarding Opened");
	}, []);

	return (
		<OnboardingLayout>
			<OnboardingLayout.Progress className="w-1/3" />
			<OnboardingLayout.Tutorial
				buttons={
					<div className="flex w-full">
						<div
							onClick={() => {
								patchUser({});
								trackEvent("Onboarding Skipped");
							}}
						>
							<Link route="index">
								<Button>Skip</Button>
							</Link>
						</div>
						<div className="flex-grow"></div>
						<div>
							<Link route="onboarding-profile">
								<Button primary>Next</Button>
							</Link>
						</div>
					</div>
				}
			>
				<Joyride
					color="#00ad71"
					badgeContent={(curr, tot) => `${curr} of ${tot}`}
					className="rounded-md"
					rounded={0.375}
					disableInteraction={true}
					disableFocusLock={false}
					styles={{ options: defaultOptions }}
					steps={[
						{
							target: "#editor",
							content:
								"This is the task editor. Start by writing something you did today.",
							stepInteraction: true,
							className: "rounded-md",
							style: {
								"border-radius": "0.375em",
							},
						},
						{
							target: ".streak",
							content:
								"This is your streak, a consecutive count of days using Makerlog. Don't let it drop!",
							stepInteraction: true,
							className: "rounded-md",
							style: {
								"border-radius": "0.375em",
							},
						},
					]}
					run={true}
					spotlightClicks={true}
				/>
				<h2 style={{ marginBottom: "0.5em" }}>Welcome to Makerlog!</h2>
				<p>
					Makerlog is a community of software developers and creatives
					sharing their work daily.
				</p>
				<h4>How it works</h4>
				<p>
					<ul>
						<li>
							After you do something interesting, you{" "}
							<strong>log a completed task</strong> on site.
						</li>
						<li>
							Over time, you <strong>earn a streak</strong>, a
							score of consecutive days logging tasks.
						</li>
						<li>
							You'll <strong>receive feedback</strong> on your
							creations and help throughout your journey.
						</li>
					</ul>
				</p>
				<p>Let's get started. Create your first task to continue.</p>
			</OnboardingLayout.Tutorial>
			<OnboardingLayout.Action>
				<div className="mb-4" id="editor">
					<Card>
						<Card.Content>
							<Editor forceOpen />
						</Card.Content>
					</Card>
				</div>
				<Feed indexUrl={`/feeds/user/${user.username}/`} />
			</OnboardingLayout.Action>
			<NextSeo title="Onboarding" />
		</OnboardingLayout>
	);
}

OnboardingIndex.getInitialProps = async () => {
	return {
		layout: {
			withoutShell: true,
		},
	};
};

export default requireAuth(OnboardingIndex);
