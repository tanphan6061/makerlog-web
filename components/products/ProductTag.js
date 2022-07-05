import React from "react";
import { Link } from "routes";
import { imageUrl } from "vendor/imagekit";

function ProductTag({ product, tag }) {
	tag = tag.replace("#", "");
	return (
		<Link route="product" params={{ slug: product.slug }}>
			<a
				style={{ height: 20 }}
				className="inline-flex flex-row items-baseline px-1 font-medium cursor-pointer"
			>
				{product.icon !== null && (
					<div className="flex-none">
						<img
							style={{ marginBottom: -2 }}
							className="h-4 mr-1 border border-gray-100 rounded-sm dark:border-dark-200"
							src={imageUrl(product.icon, 12)}
							alt={product.name}
						/>
					</div>
				)}
				<div>#{tag}</div>
			</a>
		</Link>
	);
}

export default ProductTag;
