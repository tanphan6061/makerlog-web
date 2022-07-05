import { BaseStore, getOrCreateStore } from "next-mobx-wrapper";
import { action, observable, computed, flow } from "mobx";
import { getToken, getUser, patchUser } from "utils/auth";
import { setCookie } from "nookies";
import { isServer } from "config";
import { getLogger } from "utils/logging";
import { Router } from "routes";
import { useStores } from "utils/hooks";
import { useObserver } from "mobx-react";

const log = getLogger("AuthStore");

class AuthStore extends BaseStore {
	@observable loading = false;
	@observable patching = false;
	@observable token = null;
	@observable user = null;
	@observable errorMessages = null;

	@action.bound setToken(value) {
		this.token = value;
	}

	@action.bound setUser(value) {
		// temporarily set user as "requiring setup"
		this.user = value;
	}

	@computed get isLoggedIn() {
		return this.token && this.user;
	}

	loginWithCredentials = flow(function* (
		username,
		password,
		ctx = null,
		redir = false
	) {
		try {
			this.loading = true;
			// this.errorMessages = null;
			this.token = yield getToken(username, password);
			setCookie(
				isServer && ctx !== null ? ctx : null,
				"token",
				this.token,
				{
					maxAge: 30 * 24 * 60 * 60,
					path: "/",
				}
			);
			this.user = yield getUser();
			if (this.user && this.user.needs_setup && !isServer) {
				Router.pushRoute("onboarding");
			} else if (redir) {
				Router.pushRoute("index");
			}
			this.loading = false;
			this.errorMessages = null;
			if (!ctx) log("Logged in with credentials.");
			return true;
		} catch (e) {
			log(e.message);
			this.loading = false;
			this.errorMessages = e;
			this.token = null;
			this.user = null;
			return false;
		}
	});

	loginWithToken = flow(function* (token, ctx = null, redir = false) {
		try {
			this.loading = true;
			// this.errorMessages = null;
			this.token = token;
			setCookie(
				isServer && ctx !== null ? ctx : null,
				"token",
				this.token,
				{
					maxAge: 30 * 24 * 60 * 60,
					path: "/",
				}
			);
			this.user = yield getUser();
			if (this.user && this.user.needs_setup && !isServer) {
				Router.pushRoute("onboarding");
			} else if (redir) {
				Router.pushRoute("index");
			}
			this.loading = false;
			this.errorMessages = null;
			if (!ctx) log("Logged in with token.");
			return true;
		} catch (e) {
			log(e.message);
			this.loading = false;
			this.errorMessages = e;
			this.token = null;
			this.user = null;
			return false;
		}
	});

	@action.bound
	patchUser = flow(function* (payload, reflect = true, onSuccess = () => {}) {
		try {
			this.patching = true;
			this.errorMessages = null;
			if (reflect) {
				this.user = yield patchUser(payload);
			} else {
				this.user = { ...this.user, ...payload };
			}
			this.patching = false;
			this.errorMessages = null;
			if (onSuccess) onSuccess();
			return true;
		} catch (e) {
			log(e.message);
			this.patching = false;
			this.errorMessages = e;
			return false;
		}
	});

	@action.bound
	logout(ctx = null) {
		if (!ctx) log("Logging out.");
		this.token = null;
		this.user = null;
		if (!isServer) {
			Router.pushRoute("index");
		}
		setCookie(isServer && ctx !== null ? ctx : null, "token", "", {
			maxAge: 30 * 24 * 60 * 60,
			path: "/",
		});
	}
}

export const getAuthStore = getOrCreateStore("auth", AuthStore);

// Hooks

export function useAuth() {
	const { auth } = useStores();
	return useObserver(() => ({
		loading: auth.loading,
		patching: auth.patching,
		user: auth.user,
		token: auth.token,
		isLoggedIn: auth.isLoggedIn,
		errorMessages: auth.errorMessages,
		setUser: auth.setUser.bind(auth),
		loginWithCredentials: auth.loginWithCredentials.bind(auth),
		loginWithToken: auth.loginWithToken.bind(auth),
		logout: auth.logout.bind(auth),
		patchUser: auth.patchUser.bind(auth),
	}));
}
