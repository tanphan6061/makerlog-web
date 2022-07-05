import config, { isServer } from "config";
import { isDev } from "config";
import { getLogger } from "utils/logging";

const log = getLogger("GA");

export const pageview = (url) => {
	if (isDev) {
		log(`Pageview: ${url}`);
		return;
	}
	if (isServer || !window.gtag) {
		log(`!!Pageview ran on server. (${url})`);
		return;
	}
	window.gtag("config", config.GA_UA, {
		page_path: url,
	});
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const gaEvent = (...args) => {
	if (isDev) {
		log(`Event:`, ...args);
		return;
	}
	if (isServer || !window.gtag) {
		log(`!!Event ran on server.`);
		return;
	}
	window.gtag(...args);
};
