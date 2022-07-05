import ErrorMessageList from "components/error/ErrorMessageList";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import Form from "components/ui/Form";
import Message from "components/ui/Message";
import config from "config";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { requestPasswordReset, resetPassword } from "utils/auth";

function ForgotPage() {
	const { query } = useRouter();
	const [complete, setComplete] = useState(false);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [passwordState, setPasswordState] = useState({
		password: "",
		repeatPassword: "",
	});
	const [errorMessages, setErrorMessages] = useState(null);

	async function onRequestReset() {
		try {
			setLoading(true);
			setErrorMessages(null);
			await requestPasswordReset(email);
			setLoading(false);
			setComplete(true);
		} catch (e) {
			setLoading(false);
			setErrorMessages(e);
		}
	}

	async function onReset() {
		try {
			setLoading(true);
			setErrorMessages(null);
			await resetPassword(query.uid, query.token, passwordState.password);
			setLoading(false);
			setComplete(true);
		} catch (e) {
			setLoading(false);
			setErrorMessages(e);
		}
	}

	return (
		<NarrowLayout
			maxWidthMultiplier={1}
			leftSidebar={null}
			rightSidebar={null}
		>
			<Card>
				<Card.Content>
					<div className="mb-4">
						<h3 className="font-bold">Forgot password</h3>
					</div>
					{query.uid && query.token ? (
						<div>
							{complete ? (
								<Message success>
									All done. You can sign in.
								</Message>
							) : (
								<Form onSubmit={onReset}>
									<Form.Controls>
										{errorMessages && (
											<div className="col-span-6">
												<ErrorMessageList
													error={errorMessages}
												/>
											</div>
										)}

										<Form.Field span={6} label="Password">
											<input
												value={passwordState.password}
												type="password"
												onChange={(e) =>
													setPasswordState({
														...passwordState,
														password:
															e.target.value,
													})
												}
											/>
										</Form.Field>

										<Form.Field
											span={6}
											label="Repeat password"
										>
											<input
												value={
													passwordState.repeatPassword
												}
												type="password"
												onChange={(e) =>
													setPasswordState({
														...passwordState,
														repeatPassword:
															e.target.value,
													})
												}
											/>
										</Form.Field>

										<Form.Actions
											span={6}
											className="items-center"
										>
											<div>
												<Button
													loading={loading}
													primary
													type="submit"
												>
													Submit
												</Button>
											</div>
										</Form.Actions>
									</Form.Controls>
								</Form>
							)}
						</div>
					) : (
						<Form onSubmit={onRequestReset}>
							<Form.Controls>
								{errorMessages && (
									<div className="col-span-6">
										<ErrorMessageList
											error={errorMessages}
										/>
									</div>
								)}

								{complete && (
									<div className="col-span-6">
										<Message success>
											All done. Remember to check the spam
											folder.
										</Message>
									</div>
								)}

								<Form.Field span={6} label="Email">
									<input
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</Form.Field>
								<Form.Actions span={6} className="items-center">
									<div>
										<Button
											loading={loading}
											primary
											type="submit"
										>
											Submit
										</Button>
									</div>
								</Form.Actions>
							</Form.Controls>
						</Form>
					)}
				</Card.Content>
			</Card>

			<NextSeo title="Forgot" />
		</NarrowLayout>
	);
}

ForgotPage.getInitialProps = async () => {
	return {
		layout: {
			className: config.WL_BG_COLOR,
		},
	};
};

export default ForgotPage;
