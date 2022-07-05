import { isServer } from "config";

export function isPatron(user) {
	if (!user) return false;
	return !!user.gold || !!user.patron;
}

export function isDarkMode(user) {
	if (!user) return false;
	return (isPatron(user) && user.dark_mode) || !!user.purchased;
}

export function isAdsDisabled(user) {
	if (!user) return false;
	return isPatron(user) && !user.ads_enabled;
}

export function setDarkMode(user, force = null) {
	if (isServer) return;
	document.documentElement.classList.toggle(
		"dark",
		force !== null ? force : isDarkMode(user)
	);
}
