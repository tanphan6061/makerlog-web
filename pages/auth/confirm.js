import Card from "components/ui/Card";
import Message from "components/ui/Message";
import Spinner from "components/ui/Spinner";
import config from "config";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useActivateUser } from "queries/users";
import React, { useEffect } from "react";
import { useAuth } from "stores/AuthStore";

function ConfirmPage() {
	const { query } = useRouter();
	const { loginWithToken } = useAuth();
	const { mutate, isLoading, error } = useActivateUser();

	useEffect(() => {
		if (query.uid && query.token) {
			mutate(
				{ uid: query.uid, token: query.token },
				{
					onSuccess: (data) => {
						if (data && data.token) {
							loginWithToken(data.token);
						}
					},
				}
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	return (
		<NarrowLayout
			maxWidthMultiplier={1}
			leftSidebar={null}
			rightSidebar={null}
		>
			<Card>
				<Card.Content>
					<div className="mb-4">
						<h3 className="font-bold">Welcome to Makerlog</h3>
					</div>
					{!query.uid || !query.token ? (
						<Message danger>No token provided.</Message>
					) : (
						<div>
							{!error && (
								<Spinner text="Activating your account..." />
							)}
							{error && !isLoading && (
								<Message danger>
									Something went wrong. Contact support.
								</Message>
							)}
						</div>
					)}
				</Card.Content>
			</Card>

			<NextSeo title="Confirm email" />
		</NarrowLayout>
	);
}

ConfirmPage.getInitialProps = async () => {
	return {
		layout: {
			className: config.WL_BG_COLOR,
		},
	};
};

export default ConfirmPage;
