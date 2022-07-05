export function isNewUser(user) {
	if (user.date_joined) {
		const joined = new Date(user.date_joined);
		return Math.round((new Date() - joined) / (1000 * 60 * 60 * 24)) <= 1;
	} else {
		return false;
	}
}
