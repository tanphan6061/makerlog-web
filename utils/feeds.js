import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import { toDate } from "date-fns-tz";
import { formatISO, parseISO } from "date-fns";

function fixUtcDate(d) {
	if ((typeof d === "string" || d instanceof String) && !d.endsWith("Z")) {
		return d + "Z";
	}
	return d;
}

export function normalizeTimezones(activities, tzname = null) {
	return activities.map((activity) => {
		if (tzname) {
			activity.created_at = toDate(fixUtcDate(activity.created_at), {
				timeZone: tzname,
			});
			activity.updated_at = toDate(fixUtcDate(activity.updated_at), {
				timeZone: tzname,
			});
			activity.date = toDate(fixUtcDate(activity.date), {
				timeZone: tzname,
			});
		} else {
			activity.created_at = toDate(fixUtcDate(activity.created_at));
			activity.updated_at = toDate(fixUtcDate(activity.updated_at));
			activity.date = toDate(fixUtcDate(activity.date));
		}
		return activity;
	});
}

export function orderByDate(
	data,
	order = "desc",
	tz = true,
	tzname = null,
	fname = "updated_at"
) {
	let tzified = data;
	if (tz) {
		tzified = data.map((o) => {
			if (tzname) {
				o[fname] = toDate(o[fname], { timeZone: tzname });
			} else {
				o[fname] = toDate(o[fname]);
			}
			return o;
		});
	}
	return orderBy(tzified, [fname], [order]);
}

export function dateWithoutTime(date) {
	date.setHours(0, 0, 0, 0);
	return date;
}

export function sortStreamByActivity(data, timezone = null) {
	// Algorithm:
	// 1. Do a simple upwards sort for date.
	// 2. Convert all UTC (!!!) returned dates to local Date objects.
	// 3. Group by those Date objects.
	// 4. Group by user.
	// 5. ?? profit ??
	if (data) {
		let orderedData = orderBy(data, "date", "desc");
		// TODO: Order sortStreamByActivity by Date
		let groupedByDate = groupBy(orderedData, (obj) => {
			// this is the big deal here!
			if (timezone) {
				return formatISO(
					dateWithoutTime(
						toDate(parseISO(obj.date), { timeZone: timezone })
					)
				);
			} else {
				return formatISO(
					dateWithoutTime(
						toDate(parseISO(obj.date), { timeZone: "UTC" })
					)
				);
			}
		});
		let groupedByUser = {};
		Object.keys(groupedByDate).forEach((key) => {
			groupedByUser[key] = groupBy(groupedByDate[key], (obj) => {
				if (typeof obj.user === "object") {
					return `user-${obj.user.id}`;
				} else if (typeof obj.user === "number") {
					return `user-${obj.user}`;
				}
			});
		});

		return groupedByUser;
	}
}
