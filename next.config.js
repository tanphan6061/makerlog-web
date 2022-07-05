const withOffline = require("next-offline");

const config = {
	async rewrites() {
		return [
			{ source: "/@:username", destination: "/users/:username" },
			{
				source: "/@:username/products",
				destination: "/users/:username/products",
			},
			{
				source: "/@:username/milestones",
				destination: "/users/:username/milestones",
			},
			{
				source: "/@:username/lists/:year/:month/:day",
				destination: "/users/:username/lists/:year/:month/:day",
			},
			{
				source: "/service-worker.js",
				destination: "/_next/static/service-worker.js",
			},
			{
				source: "/ads",
				destination: "/about/book-ad",
			},
			{
				source: "/slack",
				destination:
					"https://join.slack.com/t/makerlog/shared_invite/zt-nht66v1s-CMD~~ma3G6CpMSJVdJt0eQ",
			},
			{
				source: "/telegram",
				destination: "https://t.me/makerlog",
			},
			{
				source: "/discord",
				destination: "https://discord.gg/hDRFW74N79",
			},
		];
	},
	images: {
		domains: [
			"blog.getmakerlog.com",
			"getmakerlog.com",
			"api.getmakerlog.com",
			"ik.imagekit.io",
		],
	},
	workboxOpts: {
		swDest: process.env.NEXT_EXPORT
			? "service-worker.js"
			: "static/service-worker.js",
	},
	analyticsId: "badKEl4FENXOC6WuM8na6CFg2Vl",
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(withOffline(config));
