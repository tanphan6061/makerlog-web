import config from "config";
import { isServer } from "config";
import flatten from "lodash/flatten";
import { differenceInCalendarDays, format } from "date-fns";

export function buildAbsoluteUrl(path) {
	return `${config.BASE_URL}${path}`;
}

export function buildSocketUrl(path) {
	return `${config.WS_URL}${path}`;
}

export function extractResultsFromGroups(data) {
	// see: https://react-query.tanstack.com/guides/migrating-to-react-query-3#useinfinitequery-is-now-bi-directional
	return data
		? flatten(data ? data.pages.map(({ results }) => results) : [])
		: [];
}

export function onCmdEnter(e, callback) {
	if ((e.ctrlKey || e.metaKey) && e.keyCode == 13) {
		e.preventDefault();
		callback();
	}
}

export function makeTwitterShareUrl(text) {
	return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function isMobileViewport() {
	if (isServer) return false;
	return /Mobi|Android/i.test(navigator.userAgent);
}

export function getCalendarDate(date) {
	return format(date, "MMMM d, yyyy");
}

export function getRelativeDate(date) {
	const calendarDate = getCalendarDate(date);
	const diff = differenceInCalendarDays(new Date(), date);
	const dayOfWeek = format(date, "EEEE");

	if (diff === 0) return "Today";
	if (diff === 1) return "Yesterday";
	if (diff >= 2 && diff <= 6) return `${dayOfWeek}`;
	if (diff > 6 && diff <= 12) return `Last ${dayOfWeek}`;

	return calendarDate;
}

export function openTweetWindow(url, windowName) {
	if (isServer) return;
	let newwindow = window.open(url, windowName, "height=400,width=600");
	if (window.focus && newwindow) {
		newwindow.focus();
	}
	return false;
}
