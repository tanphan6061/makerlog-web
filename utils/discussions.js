import { buildAbsoluteUrl } from "./random";

export function getTwitterShareUrl(thread) {
	// We assume it has been serialized and validated.
	if (!thread) return null;
	const text = `${thread.title} via @getmakerlog\n${buildAbsoluteUrl(
		`/discussions/${thread.slug}/`
	)}`;
	return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
