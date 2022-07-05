import { isDev } from "config";
import { isServer } from "config";
import { getLogger } from "utils/logging";

const log = getLogger("segment");

export function trackEvent(...args) {
	if (isServer) return;
	if (isDev) {
		log(...args);
	} else if (window.analytics) {
		window.analytics.track(...args);
	}
}
