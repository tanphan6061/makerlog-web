import ProductIcon from "components/products/ProductIcon";
import OutboundLink from "components/seo/OutboundLink";
import React from "react";
import { Link } from "routes";

export default function IntegrationMedia({
	logo,
	name,
	description,
	externalUrl = null,
	linkParams = {},
}) {
	return (
		<div className="flex items-center justify-between break-words space-x-3">
			{externalUrl ? (
				<OutboundLink to={externalUrl}>
					<ProductIcon
						size={10}
						product={{
							name,
							icon: logo,
						}}
					/>
				</OutboundLink>
			) : (
				<Link {...linkParams}>
					<a className="flex flex-shrink-0">
						<ProductIcon
							size={10}
							product={{
								name,
								icon: logo,
							}}
						/>
					</a>
				</Link>
			)}
			<div className="flex-1" style={{ minWidth: 0 }}>
				{externalUrl ? (
					<OutboundLink to={externalUrl}>
						<h2 className="text-sm font-medium text-gray-900 leading-5">
							{name}
						</h2>
					</OutboundLink>
				) : (
					<Link {...linkParams}>
						<a>
							<h2 className="text-sm font-medium text-gray-900 leading-5">
								{name}
							</h2>
						</a>
					</Link>
				)}
				<p className="text-sm text-gray-500 truncate leading-5">
					{description}
				</p>
			</div>
		</div>
	);
}
