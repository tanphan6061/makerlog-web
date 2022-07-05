import EmailRegisterForm from "components/auth/EmailRegisterForm";
import FacebookLogin from "components/auth/FacebookLogin";
import TwitterLogin from "components/auth/TwitterLogin";
import Card from "components/ui/Card";
import config from "config";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import React from "react";

function SignupPage() {
	return (
		<NarrowLayout
			maxWidthMultiplier={1}
			rightSidebar={null}
			leftSidebar={null}
		>
			<Card>
				<Card.Content>
					<div className="mb-4">
						<h3 className="font-bold">
							Join {config.WL_FULL_NAME}
						</h3>
						<p className="text-gray-700">
							Start your journey by{" "}
							{config.IS_WL
								? "creating an account in our instance"
								: "logging in with social media"}
							.
						</p>
					</div>
					{config.IS_WL ? (
						<EmailRegisterForm />
					) : (
						<>
							<div className="flex flex-col justify-center mt-4 text-center space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-row col-span-6">
								<div>
									<TwitterLogin />
								</div>
								<div>
									<FacebookLogin />
								</div>
							</div>

							<EmailRegisterForm />
						</>
					)}
				</Card.Content>
			</Card>
			<Card>
				<Card.Content>
					<h3 className="font-bold">Here's why you should join...</h3>
					<p>
						Join{" "}
						{config.IS_WL ? (
							"our community of creators"
						) : (
							<span>over 7,000 creators</span>
						)}{" "}
						building in public and staying productive — together.
					</p>
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
				</Card.Content>
			</Card>
			<NextSeo
				title="Get started"
				description="It's never too late to start building in public, with the world's friendliest community by your side."
			/>
		</NarrowLayout>
	);
}

SignupPage.getInitialProps = async () => {
	return {
		layout: {
			className: config.WL_BG_COLOR,
		},
	};
};

export default SignupPage;
