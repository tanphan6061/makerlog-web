import { differenceInHours } from "date-fns";

export function isProductTeam(product, user) {
	return !!product.team.includes(user.id);
}

export function isInProduct(product, user) {
	if (!user) return false;
	return !!(product.user === user.id || isProductTeam(product, user));
}

export function isRecentlyLaunched(product) {
	return (
		product.launched &&
		product.launched_at &&
		differenceInHours(new Date(), new Date(product.launched_at)) <= 24
	);
}
