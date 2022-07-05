/* eslint-disable no-mixed-spaces-and-tabs */
import React from "react";
import Navbar from "components/nav/Navbar";
import Container from "components/ui/Container";
import Footer from "components/nav/Footer";
import Error, { ERROR_LAYOUT_PROPS } from "pages/_error";
import config from "config";

// TODO: refactor, make nicer

function Shell({ layoutProps, ...props }) {
	const errored =
		(props.statusCode && props.statusCode >= 400) ||
		config.MAINTENANCE_MODE;
	const { children } = props;

	if (layoutProps && layoutProps.withoutShell && !errored) {
		return children;
	}

	if (errored) {
		layoutProps = ERROR_LAYOUT_PROPS;
	}

	return (
		<div
			className={
				"flex flex-col min-h-screen pb-12 sm:pb-0 " +
				(layoutProps && layoutProps.bgClassName
					? layoutProps.bgClassName
					: " bg-gray-100 dark:bg-dark-50  ") +
				" " +
				(layoutProps && layoutProps.className
					? layoutProps.className
					: "")
			}
		>
			<Navbar />
			<div className={"flex-grow " + layoutProps.contentClassName ?? ""}>
				{errored ? (
					<Error {...props} />
				) : !layoutProps ||
				  (layoutProps && layoutProps.contained === undefined) ||
				  (layoutProps && layoutProps.contained) ? (
					<Container className={"py-4"}>{children}</Container>
				) : (
					children
				)}
			</div>
			{layoutProps && layoutProps.footer !== false && <Footer />}
		</div>
	);
}

Shell.defaultProps = {
	// Whether to display the container by default.
	layoutProps: {
		contained: true,
	},
};

export default Shell;
