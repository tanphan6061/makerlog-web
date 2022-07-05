import React from "react";
import { QueryClient } from "react-query";
import { getUser, USER_QUERIES, useUser } from "queries/users";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/router";
import Spinner from "components/ui/Spinner";
import ErrorCard from "components/ui/ErrorCard";
import ProfileSidebar from "components/sidebars/ProfileSidebar";
import ProfileMenu from "components/users/ProfileMenu";
import { getUserStats, STATS_QUERIES } from "queries/stats";
import ProfileLayout from "components/users/ProfileLayout";
import {
	getUserProducts,
	PRODUCT_QUERIES,
	useUserProducts,
} from "queries/products";
import { getErrorResponse } from "utils/error";
import Feed from "components/feeds/Feed";

// TODO: make sure profiles only work if it's at the last of the routing stack
// TODO: make sure they throw 404 for user not found cause fuck bitches

function ProfilePage() {
	const router = useRouter();
	const { username } = router.query;
	const { isLoading, data: user, error } = useUser(username);
	const {
		isLoading: isLoadingProducts,
		data: products,
		error: productsError,
	} = useUserProducts(username);

	const err = error || productsError;
	if (err) {
		return <ErrorCard statusCode={err.intCode ? err.intCode() : 400} />;
	}

	if (isLoading || isLoadingProducts)
		return <Spinner text="Loading user..." />;

	return (
		<ProfileLayout
			user={user}
			layoutProps={{
				leftSidebar: (
					<ProfileSidebar left user={user} products={products} />
				),

				rightSidebar: (
					<ProfileSidebar user={user} products={products} />
				),
			}}
			headerProps={{
				bottomNav: <ProfileMenu user={user} />,
			}}
		>
			<Feed key={user.id} indexUrl={`/feeds/user/${user.username}/`} />
		</ProfileLayout>
	);
}

ProfilePage.getInitialProps = async ({ res, query: { username } }) => {
	const queryClient = new QueryClient();

	try {
		await queryClient.prefetchQuery(
			[USER_QUERIES.getUser, { username }],
			getUser,
			{},
			{ throwOnError: true }
		);

		await queryClient.prefetchQuery(
			[PRODUCT_QUERIES.getUserProducts, { username }],
			getUserProducts
		);

		await queryClient.prefetchQuery(
			[STATS_QUERIES.getUserStats, { username }],
			getUserStats
		);

		return {
			dehydratedState: dehydrate(queryClient),
			layout: {
				allowGuest: true,
				contained: false,
			},
		};
	} catch (e) {
		return getErrorResponse(e, res);
	}
};

export default ProfilePage;
