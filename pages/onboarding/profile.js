import Button from "components/ui/Button";
import Card from "components/ui/Card";
import React from "react";
import { requireAuth } from "utils/auth";
import OnboardingCard from "components/auth/OnboardingCard";
import { Link } from "routes";
import OnboardingLayout from "layouts/OnboardingLayout";
import SkillSelector from "components/users/skills/SkillSelector";
import { NextSeo } from "next-seo";

function OnboardingProfile() {
	return (
		<OnboardingLayout>
			<OnboardingLayout.Progress className="w-2/3" />
			<OnboardingLayout.Tutorial
				buttons={
					<div className="flex w-full">
						<Link route="onboarding">
							<div>
								<Button>Previous</Button>
							</div>
						</Link>
						<div className="flex-grow"></div>
						<div>
							<Link route="onboarding-finished">
								<Button primary>Next</Button>
							</Link>
						</div>
					</div>
				}
			>
				<h2 style={{ marginBottom: "0.5em" }}>Make it yours</h2>
				<p>
					A well-made creative profile helps you stand out, make more
					friends and get more value.
				</p>
				<h4>Tips</h4>
				<p>
					<ul>
						<li>Set up a good profile picture!</li>
						<li>Add your interests and a good bio.</li>
					</ul>
				</p>
				<p>Set up your profile now on the right.</p>
			</OnboardingLayout.Tutorial>
			<OnboardingLayout.Action>
				<OnboardingCard forceOpen />
				<Card>
					<Card.Content>
						<SkillSelector />
					</Card.Content>
				</Card>
			</OnboardingLayout.Action>
			<NextSeo title="Onboarding" />
		</OnboardingLayout>
	);
}

OnboardingProfile.getInitialProps = async () => {
	return {
		layout: {
			withoutShell: true,
		},
	};
};

export default requireAuth(OnboardingProfile);
