import React, { useState } from "react";
import { requireAuth } from "utils/auth";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import Card from "components/ui/Card";
import Message from "components/ui/Message";
import Form from "components/ui/Form";
import Button from "components/ui/Button";
import { useChangePassword } from "queries/users";
import ErrorMessageList from "components/error/ErrorMessageList";
import { useAuth } from "stores/AuthStore";

function ChangePasswordPage() {
	const { logout } = useAuth();
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const { mutate, isLoading, error, isSuccess } = useChangePassword();

	const onChangePassword = async () => {
		mutate(
			{ oldPassword, newPassword },
			{
				onSuccess: () => {
					logout();
				},
			}
		);
	};

	return (
		<NarrowLayout>
			<h2 className="mb-2 font-bold">Delete your account</h2>
			<Card>
				<Card.Content>
					{isSuccess ? (
						<Message success>All done.</Message>
					) : (
						<>
							<div>
								<Form>
									<Form.Group>
										<Form.Field
											span={6}
											label="Old password"
										>
											<input
												type="password"
												value={oldPassword}
												onChange={(e) =>
													setOldPassword(
														e.target.value
													)
												}
											/>
											<p className="help">
												Type your old password or leave
												blank if you logged in via
												socials.
											</p>
										</Form.Field>
										<Form.Field
											span={6}
											label="New password"
										>
											<input
												type="password"
												value={newPassword}
												onChange={(e) =>
													setNewPassword(
														e.target.value
													)
												}
											/>
										</Form.Field>
										<Form.Field
											span={6}
											label="Repeat new password"
										>
											<input
												type="password"
												value={repeatPassword}
												onChange={(e) =>
													setRepeatPassword(
														e.target.value
													)
												}
											/>
										</Form.Field>
									</Form.Group>

									{error && (
										<ErrorMessageList error={error} />
									)}
									<Form.Actions>
										<Button
											onClick={onChangePassword}
											loading={isLoading}
											primary
											disabled={
												newPassword.length === 0 ||
												newPassword !== repeatPassword
											}
										>
											Change password
										</Button>
									</Form.Actions>
								</Form>
							</div>
						</>
					)}
				</Card.Content>
			</Card>
			<NextSeo title="Change your password" />
		</NarrowLayout>
	);
}

export default requireAuth(ChangePasswordPage);
