import React, { useState, useEffect } from "react";
import Button from "components/ui/Button";
import { usePraise, usePraiseMutation } from "queries/praise";
import { getLogger } from "utils/logging";
import FaceStack from "components/ui/FaceStack";
import { isServer } from "config";
import { Router } from "routes";
import PraiseIcon from "./PraiseIcon";
import { useAuth } from "stores/AuthStore";

const log = getLogger("PraiseButton");

// TODO: On click, redirect to sign in if not logged in.

function PraiseButton({
	indexUrl,
	initialCount,
	disabled = false,
	small = false,
}) {
	const { isLoggedIn, user } = useAuth();
	const [clicked, setClicked] = useState(false);
	const { isLoading, error, data } = usePraise(
		indexUrl,
		initialCount > 0 || clicked
	);
	const { mutate } = usePraiseMutation(initialCount, user);

	const onPraise = async (e) => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		if (!isLoggedIn && !isServer) {
			log(`User is not signed in. Redirecting...`);
			Router.pushRoute("login");
			return;
		}
		setClicked(true);
		mutate(indexUrl);
	};

	useEffect(() => {
		if (error) {
			log(`Failed to load praise for ${indexUrl}.`, error);
		}
	}, [error, indexUrl]);

	return (
		<Button
			loading={isLoading}
			disabled={disabled}
			xs
			onClick={onPraise}
			className={
				data && data.praised
					? "force-praise-color praised"
					: "force-praise-color"
			}
		>
			<Button.Icon>
				<PraiseIcon />
			</Button.Icon>
			{data && data.praised ? (
				small ? null : (
					<span className="hidden font-medium sm:block">Praised</span>
				)
			) : small ? null : (
				<span className="hidden sm:block">Praise</span>
			)}
			<span className="text-gray-500">
				{data ? (
					<span className={small ? "" : "sm:ml-2"}>{data.total}</span>
				) : (
					<span className={small ? "" : "sm:ml-2"}>
						{initialCount}
					</span>
				)}
			</span>
			{data && data.praised_by !== null && data.praised_by.length > 0 && (
				<span className="ml-2">
					<FaceStack size={4} users={data.praised_by} />
				</span>
			)}
		</Button>
	);
}

export default PraiseButton;
