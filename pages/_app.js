import "../styles/index.css";
import "../styles/images.css";
import "../utils/fa";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-responsive-modal/styles.css";
import "react-colorful/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import "emoji-mart/css/emoji-mart.css";
import "react-slidedown/lib/slidedown.css";
import "mobx-react-lite/batchingForReactDom";
import "axios-debug-log";

import React from "react";
import App from "next/app";
import { Provider, useStaticRendering } from "mobx-react";

// eslint-disable-next-line no-unused-vars
import { isServer, isDev, DEFAULT_SEO_CONFIG } from "../config";
import config, { onStoreInit } from "stores";
import { configureMobx } from "utils/mobx";
import Shell from "layouts/Shell";
import { ReactQueryDevtools } from "react-query/devtools";
import NProgressContainer from "vendor/nprogress";
import { configure, autorun } from "mobx";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import { setDarkMode } from "utils/patron";
import { Router } from "routes";

if (isDev && !isServer) {
	localStorage.debug = "makerlog*,axios";
}

configure({ enforceActions: "observed" });

// This is not a hook.
// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer); // NOT `true` value

Router.events.on("routeChangeComplete", (url) => {
	if (!isServer && window.analytics) window.analytics.page(url);
});

class Makerlog extends App {
	static async getInitialProps({ Component, ctx }) {
		let pageProps = {};

		/* 
		THIS IS DANGEROUS!

		onStoreInit MUST run before getInitialProps, otherwise cross-request state pollution may occur!
		
		onStoreInit flushes previos request state (tokens) and clears stores. 

		This could be a serious security issue. 
		Do not touch this initialization code.
		*/

		if (onStoreInit && isServer) {
			// Loads onStoreInit - this is the place to put your cookie things.
			await onStoreInit(ctx);
		}

		if (typeof Component.getInitialProps === "function") {
			pageProps = await Component.getInitialProps(ctx);
		}

		return { pageProps };
	}

	constructor(props) {
		super(props);

		this.queryClientRef = React.createRef();
	}

	componentDidMount() {
		autorun(() => {
			if (
				this.props.store &&
				this.props.store.auth &&
				this.props.store.auth.user
			) {
				setDarkMode(this.props.store.auth.user);
			}
		});

		autorun(() => {
			if (
				this.props.store &&
				this.props.store.auth &&
				this.props.store.auth.user &&
				this.props.store.stats
			) {
				this.props.store.stats.openSocket(this.props.store.auth.token);
			} else if (
				this.props.store &&
				this.props.store.auth &&
				!this.props.store.auth.user
			) {
				this.props.store.stats.closeSocket();
			}
		});

		autorun(() => {
			if (
				this.props.store &&
				this.props.store.auth &&
				this.props.store.auth.user
			) {
				if (!isServer && window.analytics) {
					const user = this.props.store.auth.user;
					window.analytics.identify(user.id, user);
				}
			}
		});
	}

	render() {
		if (!this.queryClientRef.current) {
			this.queryClientRef.current = new QueryClient();
		}
		const { Component, pageProps, store } = this.props;
		const { statusCode, errorMessage } = pageProps;
		const layoutProps = pageProps.layout ? pageProps.layout : {};

		return (
			<>
				<Head>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, user-scalable=0, minimal-ui, viewport-fit=cover"
					/>
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="black-translucent"
					/>
				</Head>
				<DefaultSeo {...DEFAULT_SEO_CONFIG} />
				<QueryClientProvider client={this.queryClientRef.current}>
					<Hydrate state={pageProps.dehydratedState}>
						<Provider {...store}>
							<Shell
								statusCode={statusCode}
								errorMessage={errorMessage}
								layoutProps={layoutProps}
							>
								<Component {...pageProps} />
								<NProgressContainer spinner={false} />
							</Shell>
							<ReactQueryDevtools />
						</Provider>
					</Hydrate>
				</QueryClientProvider>
			</>
		);
	}
}

export default configureMobx(config, Makerlog);
