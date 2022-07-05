import Spinner from "components/ui/Spinner";
import { useMyProducts } from "queries/products";
import React from "react";

export default function ProductSelector({ value, onChange = () => {} }) {
	const { isLoading, data: products } = useMyProducts();

	if (isLoading) return <Spinner small />;

	return products && products.length > 0 ? (
		<select
			className="flex-none block text-gray-700"
			value={value}
			onChange={(e) => {
				onChange(e.target.value);
			}}
		>
			<option value={null}>Post to...</option>
			{products.map((product) => (
				<option key={product.slug} value={product.slug}>
					{product.name}
				</option>
			))}
		</select>
	) : null;
}
