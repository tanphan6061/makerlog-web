import { buildAbsoluteUrl } from "./random";

export function getTwitterShareUrl(post) {
	// We assume it has been serialized and validated.
	if (!post) return null;
	const text = `${post.title} via @getmakerlog\n${buildAbsoluteUrl(
		`/stories/${post.slug}/`
	)}`;
	return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function getLinkedInShareUrl(post) {
	if (!post) return null;
	const url = buildAbsoluteUrl(`/stories/${post.slug}/`);
	return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
}
