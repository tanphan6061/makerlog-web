import routes from "@fuelrats/next-named-routes";

// https://github.com/FuelRats/next-named-routes

// Destructure what you need
const routerHelper = routes()
	.add("index", "/")
	.add("login", "/login")
	.add("register", "/start")
	.add("forgot-password", "/auth/forgot/")
	.add("auth-confirm", "/auth/confirm/")
	.add("auth-complete", "/auth/complete/[method]")
	.add("auth-delete-account", "/auth/delete-account/")
	.add("auth-change-password", "/auth/change-password/")
	.add("task", "/tasks/[id]")
	.add("profile", "/users/[username]")
	.add("profile-products", "/users/[username]/products")
	.add("profile-tasks-day", "/users/[username]/lists/[year]/[month]/[day]")
	.add("settings", "/settings")
	.add("logout", "/logout")
	.add("tasks", "/tasks")
	.add("notifications", "/notifications")
	.add("discussions-thread", "/discussions/[slug]")
	.add("products", "/products")
	.add("products-create", "/products/create")
	.add("product", "/products/[slug]")
	.add("product-edit", "/products/[slug]/edit")
	.add("integrations", "/integrations")
	.add("integration-telegram", "/integrations/telegram")
	.add("integration-slack", "/integrations/slack")
	.add("integration-webhooks", "/integrations/webhooks")
	.add("search-products", "/search/products")
	.add("search-tasks", "/search/tasks")
	.add("search-users", "/search/users")
	.add("search-discussions", "/search/discussions")
	.add("stories", "/stories")
	.add("stories-post", "/stories/[slug]")
	.add("stories-tag", "/stories/tags/[slug]")
	.add("about", "/about")
	.add("book-ad", "/about/book-ad")
	.add("legal", "/about/legal")
	.add("contact", "/about/contact")
	.add("patron", "/patron")
	.add("not-implemented", "/not-implemented")
	.add("milestone", "/milestones/[slug]")
	.add("onboarding", "/onboarding")
	.add("onboarding-profile", "/onboarding/profile")
	.add("onboarding-finished", "/onboarding/finished")
	.add("chats", "/about/chats");

const { Link, Router, useRouter, withRouter } = routerHelper;

// export what you need
export { Link, Router, useRouter, withRouter, routerHelper };
