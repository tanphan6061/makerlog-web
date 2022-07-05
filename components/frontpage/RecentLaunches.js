import ProductMedia from "components/products/ProductMedia";
import Card from "components/ui/Card";
import React from "react";

export default function RecentLaunches({ frontpage }) {
	if (
		!(
			frontpage &&
			frontpage.recent_launches &&
			frontpage.recent_launches.length > 0
		)
	)
		return null;

	return (
		<div className="mb-4">
			<div className="flex items-center">
				<h3 className="mb-2 font-semibold">Latest launches</h3>
			</div>
			<Card>
				<Card.Content>
					<div className="space-y-2">
						{frontpage.recent_launches
							.slice(0, 3)
							.map((product) => (
								<ProductMedia
									product={product}
									key={product.slug}
								/>
							))}
					</div>
				</Card.Content>
			</Card>
		</div>
	);
}
