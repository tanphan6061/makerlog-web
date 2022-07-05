import Container from "components/ui/Container";
import ErrorCard from "components/ui/ErrorCard";
import Spinner from "components/ui/Spinner";
import { useRouter } from "next/router";
import { getProduct, PRODUCT_QUERIES, useProduct } from "queries/products";
import React from "react";
import { QueryClient } from "react-query";
import NarrowLayout from "layouts/NarrowLayout";
import ProductSidebar from "components/sidebars/ProductSidebar";
import ProductHeader from "components/products/ProductHeader";
import { NextSeo } from "next-seo";
import config from "config";
import { dehydrate } from "react-query/hydration";
import { getErrorResponse } from "utils/error";
import Feed from "components/feeds/Feed";

function ProductPage() {
	const router = useRouter();
	const { slug } = router.query;

	const { isLoading, data: product, error } = useProduct(slug);

	if (error) {
		return <ErrorCard statusCode={error.intCode ? error.intCode() : 400} />;
	}

	if (isLoading) return <Spinner text="Loading product..." />;

	return (
		<div>
			<ProductHeader product={product} />

			<Container className="py-4">
				<NarrowLayout
					leftSidebar={<ProductSidebar product={product} left />}
					rightSidebar={
						<ProductSidebar product={product} left={false} />
					}
				>
					<Feed
						key={product.slug}
						indexUrl={`/feeds/product/${product.slug}/`}
						live={false}
					/>
				</NarrowLayout>
			</Container>

			<NextSeo
				title={product.name}
				description={`${product.name} is built publicly on Makerlog, a community of makers building products together.`}
				canonical={`${config.BASE_URL}/products/${product.slug}`}
				openGraph={{
					images: [
						{
							url: product.icon,
						},
					],
				}}
				twitter={{ cardType: "summary" }}
			/>
		</div>
	);
}

ProductPage.getInitialProps = async ({ res, query: { slug } }) => {
	const queryClient = new QueryClient();

	try {
		await queryClient.prefetchQuery(
			[PRODUCT_QUERIES.getProduct, { slug }],
			getProduct,
			{},
			{ throwOnError: true }
		);

		return {
			dehydratedState: dehydrate(queryClient),
			layout: {
				contained: false,
			},
		};
	} catch (e) {
		return getErrorResponse(e, res);
	}
};

export default ProductPage;
