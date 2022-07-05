import axios, { axiosWrapper } from "./axios";
import nookies from "nookies";
import { Component } from "react";
import { Router } from "routes";
import config from "config";

export async function getToken(username, password) {
	const { data } = await axiosWrapper(axios.post, "/api-token-auth/", {
		username,
		password,
	});
	return data.token;
}

export async function getUser() {
	const { data } = await axiosWrapper(axios.get, "/me/privileged/");
	return data;
}

export async function loginWithTwitterToken(oauth_token, oauth_verifier) {
	const { data } = await axiosWrapper(
		axios.post,
		`/login/social/token_user/`,
		{ provider: "twitter", oauth_token, oauth_verifier }
	);
	return data;
}

export async function loginWithFacebookToken(code, redirect_uri) {
	const { data } = await axiosWrapper(
		axios.post,
		`/login/social/token_user/`,
		{ provider: "facebook", code, redirect_uri }
	);
	return data;
}

export async function resetPassword(uid, token, password) {
	await axiosWrapper(axios.post, "/accounts/reset/", {
		uidb64: uid,
		token: token,
		repeat_password: password,
		password: password,
	});
}

export async function requestPasswordReset(email) {
	await axiosWrapper(axios.post, "/accounts/forgot/", {
		email,
	});
}

export async function patchUser(form) {
	let formCopy = form;
	let data = new FormData();
	const headers = {
		"Content-Type": "multipart/form-data",
	};
	if (formCopy.avatar !== null && formCopy.avatar !== undefined) {
		data.append("avatar", form.avatar);
	}
	if (formCopy.header !== null && formCopy.header !== undefined) {
		data.append("header", form.header);
	}
	Object.keys(formCopy).forEach(function (key) {
		if (key === "avatar") return;
		if (key === "header") return;
		data.append(key, formCopy[key]);
	});
	const response = await axiosWrapper(axios.patch, "/me/privileged/", data, {
		headers,
	});
	return response.data;
}

export const auth = (ctx) => {
	const { token } = nookies.get(ctx);

	if (ctx.req && (!token || token === "")) {
		ctx.res.writeHead(302, { Location: "/login" });
		ctx.res.end();
		return;
	}

	if (!token || token === "") {
		Router.pushRoute("login");
	}

	return token;
};

export const unauthed = (ctx) => {
	const { token } = nookies.get(ctx);

	if (ctx.req && token && token !== "") {
		ctx.res.writeHead(302, { Location: "/" });
		ctx.res.end();
		return;
	}

	if (token && token !== "") {
		Router.pushRoute("index");
	}

	return token;
};

const getDisplayName = (Component) =>
	Component.displayName || Component.name || "Component";

export const requireAuth = (WrappedComponent) =>
	class extends Component {
		static displayName = `withAuthSync(${getDisplayName(
			WrappedComponent
		)})`;

		static async getInitialProps(ctx) {
			auth(ctx);

			const componentProps =
				WrappedComponent.getInitialProps &&
				(await WrappedComponent.getInitialProps(ctx));

			return { ...componentProps };
		}

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};

export const requireUnauthed = (WrappedComponent) =>
	class extends Component {
		static displayName = `withAuthSync(${getDisplayName(
			WrappedComponent
		)})`;

		static async getInitialProps(ctx) {
			unauthed(ctx);

			const componentProps =
				WrappedComponent.getInitialProps &&
				(await WrappedComponent.getInitialProps(ctx));

			return { ...componentProps };
		}

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};

export function getAuthProvider(query) {
	switch (query.provider) {
		case "twitter":
			if (!query.oauth_token || !query.oauth_verifier) return {};
			return {
				method: loginWithTwitterToken,
				params: [query.oauth_token, query.oauth_verifier],
			};

		case "facebook":
			if (!query.code) return {};
			return {
				method: loginWithFacebookToken,
				params: [query.code, `${config.API_URL}/complete/facebook/`],
			};

		default:
			return {};
	}
}

export function requiresOnboarding(user) {
	return user.needs_setup || !user.email;
}
