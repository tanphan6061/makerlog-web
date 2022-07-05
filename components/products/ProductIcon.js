import React from "react";
import { imageUrl } from "vendor/imagekit";

function darken(color, amount) {
	return (
		"#" +
		color
			.replace(/^#/, "")
			.replace(/../g, (color) =>
				(
					"0" +
					Math.min(
						255,
						Math.max(0, parseInt(color, 16) + amount)
					).toString(16)
				).substr(-2)
			)
	);
}

function ProductLetter({ product }) {
	return (
		<span
			className={`rounded-md w-full h-full text-center flex items-center justify-center text-white`}
			style={{ backgroundColor: darken(product.accent, -30) }}
		>
			{product.name.length ? product.name.charAt(0) : "P"}
		</span>
	);
}

function ProductIcon({ size, product, className = "" }) {
	//const optSize = size >= 32 ? 128 : 32;
	return (
		<figure
			className={
				`p-1 relative bg-gray-100 dark:bg-dark-100 border border-gray-200 flex items-center justify-content h-${size} w-${size} rounded-md ` +
				className
			}
		>
			{product.icon ? (
				<img
					className={`rounded-md w-full h-full ` + className}
					src={imageUrl(product.icon)}
					alt={product.name}
				/>
			) : (
				<ProductLetter product={product} size={size} />
			)}
			{product.launched && (
				<span className="absolute top-0 right-0 block w-5 h-5 text-xs text-center bg-white rounded-full shadow-xs leading-5 transform -translate-y-1/2 translate-x-1/2 ring-2 ring-white dark:ring-dark-200">
					🚀
				</span>
			)}
		</figure>
	);
}

export default ProductIcon;
