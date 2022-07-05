export const isServer = !process.browser;
export const isDev = !(process.env.NODE_ENV === "production");

const API_URL = process.env.NEXT_PUBLIC_API_URL
	? process.env.NEXT_PUBLIC_API_URL
	: "https://api.getmakerlog.com";

const WS_URL = process.env.WS_URL
	? process.env.WS_URL
	: API_URL.replace("http", "ws");

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
	? process.env.NEXT_PUBLIC_BASE_URL
	: "https://getmakerlog.com";

const STREAM_TYPES = (following = true) => ({
	tasks: following ? "/stream" : "/explore/stream/",
});

const IMGOPT_ENABLED = process.env.NEXT_PUBLIC_IMGOPT_ENABLED
	? process.env.NEXT_PUBLIC_IMGOPT_ENABLED == 1
	: true;
const GA_UA = process.env.GA_UA ? process.env.GA_UA : "UA-121772728-1";
const GO_TAG = process.env.GO_TAG ? process.env.GO_TAG : "GTM-TPWQXJ4";
// prevent ssr mismatches by rendering everything in one timezone unless logged in
// est time
const DEFAULT_TZ = process.env.NEXT_PUBLIC_DEFAULT_TZ
	? process.env.NEXT_PUBLIC_DEFAULT_TZ
	: "America/New_York";

const PADDLE_VENDOR = process.env.NEXT_PUBLIC_PADDLE_VENDOR
	? process.env.NEXT_PUBLIC_PADDLE_VENDOR
	: "38022";

const GHOST_API_URL = process.env.NEXT_PUBLIC_GHOST_API_URL
	? process.env.NEXT_PUBLIC_GHOST_API_URL
	: "https://blog.getmakerlog.com";

const GHOST_CONTENT_KEY = process.env.NEXT_PUBLIC_GHOST_CONTENT_KEY
	? process.env.NEXT_PUBLIC_GHOST_CONTENT_KEY
	: "e5916b3b39ba7e8dc6ce696625";

const GHOST_API_VER = process.env.NEXT_PUBLIC_GHOST_API_VER
	? process.env.NEXT_PUBLIC_GHOST_API_VER
	: "v3";

const TWITTER_CLIENT_KEY = process.env.NEXT_PUBLIC_TWITTER_CLIENT_KEY
	? process.env.NEXT_PUBLIC_TWITTER_CLIENT_KEY
	: "qlWMjt6mQmLOw3IaKua0T3qJo";

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY
	? process.env.NEXT_PUBLIC_STREAM_API_KEY
	: "ztyjtywyeb28";

const STREAM_APP_ID = process.env.NEXT_PUBLIC_STREAM_APP_ID
	? process.env.NEXT_PUBLIC_STREAM_APP_ID
	: "97497";

const SENTRY_DSN =
	process.env.SENTRY_DSN ??
	"https://2a9f23af62a74638b4c5c24a7cc132c2@o197126.ingest.sentry.io/3170364";

const MAINTENANCE_MODE =
	process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== undefined
		? process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1"
		: false;

const RECAPTCHA_KEY =
	process.env.NEXT_PUBLIC_RECAPTCHA_KEY ??
	"6LenByMaAAAAANcshhCc6gbZLmh8XDvHUOdTSmjY";

// Whitelabeling settings
const IS_WL =
	process.env.NEXT_PUBLIC_IS_WL !== undefined
		? process.env.NEXT_PUBLIC_IS_WL === "1"
		: false;
const WL_NAME = process.env.NEXT_PUBLIC_WL_NAME ?? null;
const WL_FULL_NAME = WL_NAME ? `${WL_NAME}'s Makerlog` : "Makerlog";
const WL_LOGO = process.env.NEXT_PUBLIC_WL_LOGO ?? null;
const WL_BG_COLOR = process.env.NEXT_PUBLIC_WL_BG_COLOR ?? "bg-green-500";
const WL_BORDER_COLOR =
	process.env.NEXT_PUBLIC_WL_BORDER_COLOR ??
	"border-green-500 dark:border-dark-900";
const WL_TEXT_COLOR = process.env.NEXT_PUBLIC_WL_TEXT_COLOR ?? "text-green-500";

const SEGMENT_KEY =
	process.env.NEXT_PUBLIC_SEGMENT_KEY ?? "FUB5FEIqk5iGeFS3MUv5IHm7nIRZJIxS";

export const DEFAULT_SEO_CONFIG = {
	title: "Home",
	titleTemplate:
		`%s | ` +
		(WL_NAME
			? `${WL_NAME}'s Makerlog`
			: isDev
			? "🚧 Makerlog Dev"
			: "Makerlog"),
	description:
		"Makerlog is where makers & indie hackers build products in public.",
	openGraph: {
		url: BASE_URL,
		title: WL_FULL_NAME ? WL_FULL_NAME : "Makerlog",
		description:
			"Makerlog is where makers & indie hackers build products in public.",
		images: [
			{
				url: `${BASE_URL}/img/og/default.png`,
			},
		],
		site_name: "Makerlog",
	},
	twitter: {
		// Handle is the creator of the content given, not the site handle.
		handle: "@getmakerlog",
		site: "@getmakerlog",
		cardType: "summary_large_image",
	},
};

const AWESOME_CLUB = [
	"poppacalypse",
	"joshmanders",
	"jamesmkenny",
	"jip",
	"woutertoday",
	"jivings",
	"lori",
	"Mike_Miner",
	"gabriel4649",
	"zicsus",
];

const config = {
	API_URL,
	WS_URL,
	BASE_URL,
	STREAM_TYPES,
	GA_UA,
	GO_TAG,
	IMGOPT_ENABLED,
	isDev,
	DEFAULT_TZ,
	PADDLE_VENDOR,
	GHOST_API_URL,
	GHOST_API_VER,
	GHOST_CONTENT_KEY,
	TWITTER_CLIENT_KEY,
	STREAM_API_KEY,
	STREAM_APP_ID,
	SENTRY_DSN,
	MAINTENANCE_MODE,
	IS_WL,
	WL_NAME,
	WL_FULL_NAME,
	WL_LOGO,
	WL_BORDER_COLOR,
	WL_BG_COLOR,
	WL_TEXT_COLOR,
	RECAPTCHA_KEY,
	AWESOME_CLUB,
	SEGMENT_KEY,
};
export default config;
