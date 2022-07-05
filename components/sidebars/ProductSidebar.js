import { useProductMakers, useRelatedProducts } from "queries/products";
import React from "react";
import SocialsCard from "./SocialsCard";
import SidebarItem from "./SidebarItem";
import Card from "components/ui/Card";
import Spinner from "components/ui/Spinner";
import UserMedia from "components/ui/UserMedia";
import Tag from "components/ui/Tag";
import ProductMedia from "components/products/ProductMedia";

function MakersCard({ product }) {
	const { isLoading, data, error } = useProductMakers(product.slug);

	if (!product || error) return null;

	return (
		<SidebarItem title="Makers">
			<Card>
				<Card.Content>
					{isLoading && <Spinner text="Loading makers..." small />}
					{data && data.length > 0 && (
						<div className="space-y-2">
							{data.map((user) => (
								<UserMedia
									extraStreakText={false}
									key={user.id}
									user={user}
								/>
							))}
						</div>
					)}
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}

function RelatedProductsCard({ product }) {
	const { isLoading, data, error } = useRelatedProducts(product.slug);

	if (!product || error) return null;

	return (
		<SidebarItem title="Related Products">
			<Card>
				<Card.Content>
					{isLoading && <Spinner text="Loading products..." small />}
					{data && data.length === 0 && (
						<div className="text-sm text-center text-gray-500">
							No related products yet.
						</div>
					)}
					{data && data.length > 0 && (
						<div className="space-y-2">
							{data.map((product) => (
								<ProductMedia
									key={product.id}
									product={product}
								/>
							))}
						</div>
					)}
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}

function TagsCard({ product }) {
	if (!product) return null;

	return (
		<SidebarItem title="Tags">
			<Card>
				<Card.Content>
					{product.tags.length === 0 && (
						<div className="text-sm text-center text-gray-500">
							No tags yet.
						</div>
					)}
					{product.tags.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}

export default function ProductSidebar({ product, left = false }) {
	// TODO: Implement feed filtering so the left sidebar is filter controls only.
	return (
		<div>
			{left && (
				<>
					<SocialsCard object={product} />
					<TagsCard product={product} />
				</>
			)}
			{!left && (
				<>
					<MakersCard product={product} />
					<RelatedProductsCard product={product} />
				</>
			)}
		</div>
	);
}
