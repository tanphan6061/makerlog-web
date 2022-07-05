import config from "config";

export function getTwitterShareUrl(user) {
	// We assume it has been serialized and validated.
	if (!user) return null;
	const text = `I've built in public for 🔥${user.streak} consecutive days on @getmakerlog! 💪 \n #BuildInPublic \n\n ${config.BASE_URL}/@${user.username}`;
	return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
