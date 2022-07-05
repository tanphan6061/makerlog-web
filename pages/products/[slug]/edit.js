import ProductEditForm from "components/products/forms/ProductEditForm";
import Card from "components/ui/Card";
import ErrorCard from "components/ui/ErrorCard";
import PageHeader from "components/ui/PageHeader";
import Spinner from "components/ui/Spinner";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { getProduct, PRODUCT_QUERIES, useProduct } from "queries/products";
import React from "react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { Link } from "routes";
import { requireAuth } from "utils/auth";
import { isInProduct } from "utils/products";

function EditProductPage() {
	const router = useRouter();
	const { slug } = router.query;

	const { isLoading, data: product, error } = useProduct(slug);

	if (error) {
		return <ErrorCard statusCode={error.intCode ? error.intCode() : 400} />;
	}

	if (isLoading) return <Spinner text="Loading product..." />;

	return (
		<NarrowLayout rightSidebar={null}>
			<PageHeader>
				<div>
					<h2 className="mb-2 font-bold">
						Editing{" "}
						<Link route="product" params={{ slug: product.slug }}>
							<a>"{product.name}"</a>
						</Link>
					</h2>
				</div>
			</PageHeader>
			<Card>
				<Card.Content>
					<ProductEditForm product={product} />
				</Card.Content>
			</Card>
			<NextSeo title={`Editing "${product.name}"`} />
		</NarrowLayout>
	);
}

EditProductPage.getInitialProps = async ({
	store: { auth },
	query: { slug },
}) => {
	const queryClient = new QueryClient();

	const product = await queryClient.fetchQuery(
		[PRODUCT_QUERIES.getProduct, { slug }],
		getProduct
	);

	if (auth.user && product && !isInProduct(product, auth.user)) {
		return {
			statusCode: 403,
		};
	}

	return { dehydratedState: dehydrate(queryClient) };
};

export default requireAuth(EditProductPage);
