import ErrorMessageList from "components/error/ErrorMessageList";
import Button from "components/ui/Button";
import Form from "components/ui/Form";
import Message from "components/ui/Message";
import { useCreateUser } from "queries/users";
import React, { useState } from "react";

export default function EmailRegisterForm() {
	const { mutate, isLoading, error, isSuccess } = useCreateUser();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const onSubmit = async () => {
		mutate({
			username,
			email,
			password,
			repeat_password: repeatPassword,
			recaptcha_token: "****",
		});
	};

	if (isSuccess) {
		return (
			<Message success>
				<strong>🥳 All done!</strong> Make sure to check your email for
				a confirmation email.
			</Message>
		);
	}

	return (
		<Form onSubmit={onSubmit}>
			{error && <ErrorMessageList error={error} />}
			<Form.Controls>
				<Form.Field span={6} label="Username">
					<input
						onChange={(e) => setUsername(e.target.value)}
						value={username}
					/>
					<p className="help">Get creative.</p>
				</Form.Field>
				<Form.Field span={6} label="Email">
					<input
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
					<p className="help">I don't spam, I promise.</p>
				</Form.Field>
				<Form.Field span={3} label="Password">
					<input
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
					<p className="help">Make it real strong.</p>
				</Form.Field>
				<Form.Field span={3} label="Repeat password">
					<input
						type="password"
						onChange={(e) => setRepeatPassword(e.target.value)}
						value={repeatPassword}
					/>
					<p className="help">Make it real strong... again</p>
				</Form.Field>
				<Form.Actions span={6}>
					<Button loading={isLoading} primary type="submit">
						Finish
					</Button>
				</Form.Actions>
			</Form.Controls>
		</Form>
	);
}
