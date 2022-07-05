import ProductCreateForm from "components/products/forms/ProductCreateForm";
import Card from "components/ui/Card";
import PageHeader from "components/ui/PageHeader";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import React from "react";
import { requireAuth } from "utils/auth";

function CreateProductPage() {
	return (
		<NarrowLayout rightSidebar={null}>
			<PageHeader>
				<h2 className="mb-2 font-bold">Add product</h2>
			</PageHeader>
			<Card>
				<Card.Content>
					<ProductCreateForm />
				</Card.Content>
			</Card>
			<NextSeo title="Create product" />
		</NarrowLayout>
	);
}

export default requireAuth(CreateProductPage);
