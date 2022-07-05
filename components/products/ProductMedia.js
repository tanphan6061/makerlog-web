import React from "react";
import ProductIcon from "./ProductIcon";
import truncate from "lodash/truncate";
import { Link } from "routes";

function ProductMedia({ product }) {
	if (!product) return null;
	return (
		<div className="flex items-center justify-between break-words space-x-3">
			<Link route="product" params={{ slug: product.slug }}>
				<a className="flex flex-shrink-0">
					<ProductIcon size={10} product={product} />
				</a>
			</Link>
			<div className="flex-1" style={{ minWidth: 0 }}>
				<Link route="product" params={{ slug: product.slug }}>
					<a>
						<h2 className="text-sm font-medium text-gray-900 leading-5">
							{product.name}
						</h2>
					</a>
				</Link>
				<p className="text-sm text-gray-500 truncate leading-5">
					{truncate(product.description, { length: 140 })}
				</p>
			</div>
		</div>
	);
}

export default ProductMedia;
