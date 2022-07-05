/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import PropTypes from "prop-types";
import { Link, useRouter, routerHelper } from "routes";

// TODO: Add params support.

function ActiveLink({
	href,
	route,
	params = {},
	inactiveClassName,
	activeClassName,
	notPath = [],
	wildcard = false,
	children,
	...props
}) {
	const router = useRouter();

	const child = React.Children.only(children);

	let className = child.props.className || "";
	const routeData = routerHelper.resolveRoute(route).getRouteData(params);
	if (
		(router.pathname === href ||
			(routeData.as
				? routeData.href.pathname == router.pathname &&
				  router.asPath == routeData.as.pathname
				: routeData.href.pathname == router.pathname) ||
			(wildcard &&
				router.pathname.startsWith(
					routerHelper.resolveRoute(route).getRouteData(params).href
						.pathname
				))) &&
		!notPath.some((v) => router.pathname.includes(v)) &&
		activeClassName
	) {
		className = `${className} ${activeClassName}`.trim();
	} else {
		className = `${className} ${inactiveClassName}`.trim();
	}

	return (
		<Link href={href} route={route} params={params} {...props}>
			{React.cloneElement(child, { className })}
		</Link>
	);
}

ActiveLink.propTypes = {
	href: PropTypes.string,
	activeClassName: PropTypes.string,
	children: PropTypes.node.isRequired,
};

ActiveLink.defaultProps = {
	href: "",
	activeClassName: "",
};

export default ActiveLink;
