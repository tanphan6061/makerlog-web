import OutboundLink from "components/seo/OutboundLink";
import Container from "components/ui/Container";
import normalizeUrl from "normalize-url";
import React from "react";
import ProductIcon from "./ProductIcon";
import TimeAgo from "react-timeago";
import { useAuth } from "stores/AuthStore";
import { isInProduct } from "utils/products";
import Button from "components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "routes";

function ProductHeader({ product, bottomNav = null, halfWidth = false }) {
	const { user } = useAuth();
	const makerCount = 1 + product.team.length;

	return (
		<div className="bg-white border-b border-gray-200">
			<div
				className={`object-cover w-full ${halfWidth ? "h-16" : "h-32"}`}
				style={{ backgroundColor: product.accent }}
			></div>
			<Container>
				<div className="flex flex-row p-4 space-x-4">
					<div>
						<ProductIcon product={product} size={16} />
					</div>
					<div className="flex-grow">
						<div className="mb-2 sm:max-w-lg last:mb-0">
							<h2 className="text-xl font-bold text-gray-900 sm:truncate">
								{product.name}
							</h2>
							{product.description ? (
								<p>{product.description}</p>
							) : null}
						</div>
						<div className="flex text-sm text-gray-500 space-x-4">
							{product.website ? (
								<OutboundLink
									icon
									to={normalizeUrl(product.website)}
								>
									Website
								</OutboundLink>
							) : null}
							{makerCount > 1 && (
								<small className="hidden sm:block">
									{makerCount} makers
								</small>
							)}
							{product.launched_at ? (
								<small className="hidden sm:block">
									Launched{" "}
									<TimeAgo date={product.launched_at} />
								</small>
							) : null}
						</div>
					</div>
					{isInProduct(product, user) && (
						<div className="flex items-center">
							<Link
								route="product-edit"
								params={{ slug: product.slug }}
							>
								<Button>
									<Button.Icon>
										<FontAwesomeIcon icon="edit" />
									</Button.Icon>
									Edit
								</Button>
							</Link>
						</div>
					)}
				</div>
				{bottomNav}
			</Container>
		</div>
	);
}

export default ProductHeader;
