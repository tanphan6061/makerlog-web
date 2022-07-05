import React, { useState } from "react";
import Form from "components/ui/Form";
import Button from "components/ui/Button";
import ErrorMessageList from "components/error/ErrorMessageList";
import { requireUnauthed } from "utils/auth";
import { Link } from "routes";
import { useAuth } from "stores/AuthStore";
import NarrowLayout from "layouts/NarrowLayout";
import Card from "components/ui/Card";
import TwitterLogin from "components/auth/TwitterLogin";
import FacebookLogin from "components/auth/FacebookLogin";
import { NextSeo } from "next-seo";

function LoginPage() {
	const { loginWithCredentials, loading, errorMessages } = useAuth();
	const [redirecting, setRedirecting] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const onLogin = async () => {
		setRedirecting(true);
		const loggedIn = await loginWithCredentials(
			username,
			password,
			null,
			true
		);
		if (!loggedIn) {
			setRedirecting(false);
		}
	};

	return (
		<NarrowLayout
			maxWidthMultiplier={1}
			leftSidebar={null}
			rightSidebar={null}
		>
			<Card>
				<Card.Content>
					<h3 className="font-bold">Sign in</h3>
					<p className="text-gray-700">
						Welcome back to the maker community.
					</p>

					<Form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onLogin();
						}}
					>
						<Form.Controls>
							<div className="flex flex-col justify-center mt-4 text-center space-y-2 sm:space-y-0 sm:space-x-2 sm:flex-row col-span-12 sm:col-span-6">
								<div>
									<TwitterLogin />
								</div>
								<div>
									<FacebookLogin />
								</div>
							</div>

							{errorMessages && (
								<div className="col-span-12 sm:col-span-6">
									<ErrorMessageList error={errorMessages} />
								</div>
							)}

							<Form.Field span={6} label="Username">
								<input
									type="text"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
								/>
							</Form.Field>
							<Form.Field
								span={6}
								label="Password"
								help={
									<Link route="forgot-password">
										<a>Forgot?</a>
									</Link>
								}
							>
								<input
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									type="password"
								/>
							</Form.Field>
							<Form.Actions span={6} className="items-center">
								<div>
									<Button
										primary
										loading={loading || redirecting}
										type="submit"
									>
										Sign in
									</Button>
								</div>
							</Form.Actions>
						</Form.Controls>
					</Form>
				</Card.Content>
			</Card>
			<NextSeo title="Login" />
		</NarrowLayout>
	);
}

LoginPage.getInitialProps = async () => {
	return {
		layout: {
			className: "bg-green-500",
		},
	};
};

export default requireUnauthed(LoginPage);
