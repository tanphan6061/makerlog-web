import React, { useState } from "react";
import { requireAuth } from "utils/auth";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import Card from "components/ui/Card";
import Message from "components/ui/Message";
import Form from "components/ui/Form";
import Button from "components/ui/Button";
import { useDeleteUser } from "queries/users";
import { useAuth } from "stores/AuthStore";

function DeleteAccountPage() {
	const { user, logout } = useAuth();
	const [username, setUsername] = useState("");
	const { mutate, isLoading, isSuccess } = useDeleteUser();

	const onDeleteAccount = async () => {
		mutate(
			{ repeatUsername: username },
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
							<Message danger>
								<strong>
									There is no turning back, there is no amount
									of support tickets that can bring it back.
									This is not a "hidden" toggle, it's a
									straight up wipe.
								</strong>
								<br /> <br /> Make sure you really want to do
								this!
							</Message>
							<div className="mt-4">
								<Form>
									<Form.Field
										span={3}
										label="Type your username"
									>
										<input
											value={username}
											onChange={(e) =>
												setUsername(e.target.value)
											}
										/>
										<p className="help">
											Type your username here to confirm &
											proceed.
										</p>
									</Form.Field>
									<Form.Actions>
										<Button
											onClick={onDeleteAccount}
											loading={isLoading}
											danger
											disabled={
												!user ||
												username !== user.username
											}
										>
											Delete my stuff
										</Button>
									</Form.Actions>
								</Form>
							</div>
						</>
					)}
				</Card.Content>
			</Card>
			<NextSeo title="Delete your account" />
		</NarrowLayout>
	);
}

export default requireAuth(DeleteAccountPage);
