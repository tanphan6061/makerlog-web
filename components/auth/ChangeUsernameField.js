import Button from "components/ui/Button";
import Form from "components/ui/Form";
import { useChangeUsername, useCheckUsername } from "queries/users";
import React, { useCallback, useState } from "react";
import { useAuth } from "stores/AuthStore";
import debounce from "lodash/debounce";
import Message from "components/ui/Message";

export default function ChangeUsernameField() {
	const { user, setUser } = useAuth();
	const [username, setUsername] = useState(user ? user.username : "");
	const {
		mutateAsync,
		isLoading: isChangingUsername,
		isSuccess: isChanged,
	} = useChangeUsername();
	const {
		mutate: check,
		isLoading: isChecking,
		isSuccess: isChecked,
		error: isErrorChecked,
		reset,
	} = useCheckUsername();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const checkUsername = useCallback(
		debounce((e) => {
			check(e.target.value, true);
		}, 500),
		[]
	);

	const onChange = async () => {
		const newUser = await mutateAsync(username);
		setUser(newUser);
		reset();
	};

	return (
		<Form>
			<Form.Field span={6}>
				{isChanged && (
					<Message success>
						Username changed. Refresh to see changes take effect.
					</Message>
				)}
				<div className="flex items-center text-sm text-gray-700 space-x-2">
					<span className="hidden sm:flex">getmakerlog.com/@</span>
					<div className="relative">
						<input
							onChange={(e) => {
								setUsername(e.target.value);
								checkUsername(e);
							}}
							value={username}
							type="text"
						/>
						<span className="absolute">
							{isChecking ? (
								<p className="help">Checking...</p>
							) : isChecked ? (
								<p className="text-xs text-green-500">
									Available!
								</p>
							) : isErrorChecked ? (
								<p className="text-xs text-red-500">Taken!</p>
							) : null}
						</span>
					</div>
					<Button
						disabled={
							username === user.username ||
							!isChecked ||
							username.length === 0
						}
						loading={isChangingUsername}
						secondary={isChecked}
						onClick={onChange}
					>
						Change
					</Button>
				</div>
			</Form.Field>
		</Form>
	);
}
