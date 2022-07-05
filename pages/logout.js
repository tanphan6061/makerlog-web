import React from "react";
import { requireAuth } from "utils/auth";
import Card from "components/ui/Card";
import Spinner from "components/ui/Spinner";
import { isServer } from "config";
import { useAuth } from "stores/AuthStore";
import { NextSeo } from "next-seo";

function LogoutPage() {
	const { logout } = useAuth();
	if (!isServer) {
		setTimeout(() => {
			logout();
		}, 1000);
	}
	return (
		<Card>
			<Card.Content>
				<Spinner text="Logging you out..." color="gray" />
			</Card.Content>

			<NextSeo title="Logging out..." />
		</Card>
	);
}

LogoutPage.getInitialProps = async () => {
	return {
		layout: {
			layout: "app",
			allowGuest: true,
		},
	};
};

export default requireAuth(LogoutPage);
