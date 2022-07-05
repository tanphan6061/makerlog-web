import React from "react";
import { QueryClient } from "react-query";
import { getUser, USER_QUERIES, useUser } from "queries/users";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/router";
import Spinner from "components/ui/Spinner";
import ErrorCard from "components/ui/ErrorCard";
import ProductMedia from "components/products/ProductMedia";
import Card from "components/ui/Card";
import ProfileMenu from "components/users/ProfileMenu";
import { getUserStats, STATS_QUERIES } from "queries/stats";
import ProfileLayout from "components/users/ProfileLayout";
import {
	getUserProducts,
	PRODUCT_QUERIES,
	useUserProducts,
} from "queries/products";
import { getErrorResponse } from "utils/error";

function ProfileProductsPage() {
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
			headerProps={{
				bottomNav: <ProfileMenu user={user} />,
			}}
		>
			<Card>
				<Card.Content>
					<div className="space-y-2">
						{products.map((product) => (
							<ProductMedia
								key={product.slug}
								product={product}
							/>
						))}
					</div>
				</Card.Content>
			</Card>
		</ProfileLayout>
	);
}

ProfileProductsPage.getInitialProps = async ({ res, query: { username } }) => {
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

export default ProfileProductsPage;
