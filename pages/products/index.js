import Button from "components/ui/Button";
import ErrorCard from "components/ui/ErrorCard";
import Spinner from "components/ui/Spinner";
import { useMyProducts } from "queries/products";
import React from "react";
import { useAuth } from "stores/AuthStore";
import orderBy from "lodash/orderBy";
import Card from "components/ui/Card";
import PageHeader from "components/ui/PageHeader";
import { Link } from "routes";
import { NextSeo } from "next-seo";
import NarrowLayout from "layouts/NarrowLayout";
import ProductMedia from "components/products/ProductMedia";
import { requireAuth } from "utils/auth";

// This page will be better, for now though...

function MyProductsList() {
	const { isLoggedIn } = useAuth();
	const { isLoading, data: products, error, refetch } = useMyProducts();

	if (!isLoggedIn) return null;

	return (
		<div>
			<PageHeader>
				<div className="flex items-center w-full">
					<h3 className="font-semibold">Your products</h3>
					<div className="flex-grow"></div>
					<div>
						<Link route="products-create">
							<Button secondary>Add product</Button>
						</Link>
					</div>
				</div>
			</PageHeader>
			{isLoading && <Spinner text="Loading your products..." />}
			{error && (
				<ErrorCard
					message={error.message}
					actions={<Button onClick={refetch}>Retry</Button>}
				/>
			)}
			{products && (
				<Card>
					<Card.Content className="space-y-2">
						<div className="space-y-2">
							{products.length === 0 && (
								<center>
									<div className="text-xs text-gray-700">
										🍃 Nothing yet.
									</div>
								</center>
							)}
							{orderBy(products, "created_at").map((product) => (
								<ProductMedia
									key={product.slug}
									product={product}
								/>
							))}
						</div>
					</Card.Content>
				</Card>
			)}
		</div>
	);
}

function ProductsPage() {
	const { isLoggedIn } = useAuth();

	return (
		<NarrowLayout>
			{isLoggedIn && <MyProductsList />}
			<NextSeo
				title="Products"
				description="Discover the world's largest community of software products built in public."
			/>
		</NarrowLayout>
	);
}

export default requireAuth(ProductsPage);
