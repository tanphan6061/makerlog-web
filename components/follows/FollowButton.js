import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/ui/Button";
import { useFollow, useIsFollowing } from "queries/users";
import React from "react";
import { Router } from "routes";
import { useAuth } from "stores/AuthStore";

export default function FollowButton({
	user,
	buttonProps = {},
	followBack = false,
}) {
	const { isLoggedIn, user: currentUser } = useAuth();
	const { isLoading, data: isFollowing } = useIsFollowing(user.username, {
		enabled: isLoggedIn,
	});
	const { mutate } = useFollow(user.username);
	if (!user || (isLoggedIn && user.id === currentUser.id)) return null;

	const onClickFollow = async () => {
		if (!isLoggedIn) {
			Router.pushRoute("register");
			return;
		}
		await mutate(user.username);
	};

	return (
		<Button
			loading={isLoggedIn && isLoading}
			secondary={!isFollowing}
			onClick={onClickFollow}
			{...buttonProps}
		>
			{isFollowing ? (
				<span>
					<FontAwesomeIcon icon="check-circle" /> &nbsp; Following
				</span>
			) : followBack ? (
				<span>
					<FontAwesomeIcon icon="plus-circle" /> &nbsp; Follow back
				</span>
			) : (
				<span>
					<FontAwesomeIcon icon="plus-circle" /> &nbsp; Follow maker
				</span>
			)}
		</Button>
	);
}
