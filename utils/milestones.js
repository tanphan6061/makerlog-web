import { buildAbsoluteUrl } from "./random";

export function getTwitterShareUrl(milestone) {
	// We assume it has been serialized and validated.
	if (!milestone) return null;
	const text = `${milestone.title} via @getmakerlog\n${buildAbsoluteUrl(
		`/milestones/${milestone.slug}/`
	)}`;
	return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
