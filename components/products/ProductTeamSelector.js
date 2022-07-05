import ErrorMessageList from "components/error/ErrorMessageList";
import Button from "components/ui/Button";
import Form from "components/ui/Form";
import { getUser } from "queries/users";
import React, { useState } from "react";
import { useAuth } from "stores/AuthStore";
import uniqBy from "lodash/uniqBy";
import { StdErrorCollection } from "utils/error";
import { useEffect } from "react";
import { usePrevious } from "utils/hooks";
import UserLine from "components/ui/UserLine";

export default function ProductTeamSelector({
	initialTeam = null,
	onChange = () => {},
}) {
	const { user: authedUser } = useAuth();
	const [team, setTeam] = useState([]);
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const prevInitialTeam = usePrevious(initialTeam);

	useEffect(() => {
		const getInitialData = async () => {
			try {
				setLoading(true);
				setError(null);
				// TODO: This is a hack. IDs vs. Usernames
				const newTeam = await Promise.all(
					initialTeam.map((u) => getUser("", { username: u }))
				);
				setTeam(uniqBy(newTeam, "id"));
				setLoading(false);
				setUsername("");
			} catch (e) {
				setLoading(false);
				setError(e);
			}
		};

		if (
			initialTeam !== null &&
			initialTeam.length > 0 &&
			prevInitialTeam !== initialTeam
		) {
			getInitialData();
		}
	}, [prevInitialTeam, initialTeam]);

	const onAdd = async () => {
		try {
			setLoading(true);
			setError(null);
			if (username.length === 0)
				throw new StdErrorCollection("Field is empty.");
			if (username === authedUser.username)
				throw new StdErrorCollection("You can't add yourself.");

			const user = await getUser("", { username });
			setTeam(uniqBy([...team, user], "id"));
			onChange([...team, user].map((user) => user.id));
			setLoading(false);
		} catch (e) {
			setLoading(false);
			setError(e);
		}
	};

	const onRemove = (id) => {
		const newTeam = team.filter((user) => user.id !== id);
		setTeam(newTeam);
		onChange(newTeam.map((user) => user.id));
	};

	return (
		<>
			<Form.Field span={6} label="Team">
				<ErrorMessageList error={error} />
				<div className="inline-flex w-full mb-2 space-x-2 last:mb-0">
					<input
						className="flex-1"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Username"
						type="text"
					/>
					<div className="flex-none">
						<Button secondary onClick={onAdd} loading={loading}>
							Add
						</Button>
					</div>
				</div>
				<div className="space-y-2">
					{team.map((user) => (
						<div key={user.id} className="flex">
							<div className="flex-grow">
								<UserLine user={user} />
							</div>
							<span>
								<Button
									onClick={() => onRemove(user.id)}
									danger
									xs
								>
									Remove
								</Button>
							</span>
						</div>
					))}
				</div>
			</Form.Field>
		</>
	);
}
