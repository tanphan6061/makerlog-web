import Document, { Html, Head, Main, NextScript } from "next/document";
import config, { isDev } from "../config";
import * as snippet from "@segment/snippet";

class AlphaDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	renderSegment() {
		const opts = {
			apiKey: config.SEGMENT_KEY,
			// note: the page option only covers SSR tracking.
			// Page.js is used to track other events using `window.analytics.page()`
			page: true,
		};

		if (isDev) {
			return snippet.max(opts);
		}

		return snippet.min(opts);
	}

	render() {
		return (
			<Html>
				<Head>
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/img/icons/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/img/icons/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/img/icons/favicon-16x16.png"
					/>
					<link rel="manifest" href="/img/icons/site.webmanifest" />
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossOrigin="true"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:wght@400;700&display=swap"
						rel="stylesheet"
					/>
					<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
					<script
						type="text/javascript"
						dangerouslySetInnerHTML={{
							__html: `Paddle.Setup({ vendor: ${
								config.PADDLE_VENDOR
							}, debug: ${JSON.stringify(config.isDev)} });`,
						}}
					/>
					{!isDev && (
						<>
							<script
								dangerouslySetInnerHTML={{
									__html: this.renderSegment(),
								}}
							/>
							<script
								dangerouslySetInnerHTML={{
									__html: `window.$crisp=[];window.CRISP_WEBSITE_ID="5c4829a7-2df8-4db7-a179-a35621e614a8";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
								}}
							/>
						</>
					)}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default AlphaDocument;
