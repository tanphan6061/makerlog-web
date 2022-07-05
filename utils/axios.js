import axios from "axios";
import appConfig from "config";
import nookies from "nookies";
import { isServer } from "config";
import { StdErrorCollection, prettyAxiosError } from "./error";
import { getLogger } from "./logging";

const log = getLogger("axiosWrapper");

const client = axios.create({
	baseURL: appConfig.API_URL,
});

client.interceptors.request.use(function (config) {
	if (!isServer) {
		const cookies = nookies.get();
		const token = cookies.token;
		if (token && token !== "" && token !== "null") {
			config.headers.Authorization = `Token ${token}`;
		}
	}
	return config;
});

export async function axiosWrapper(fn, ...args) {
	try {
		return await fn(...args);
	} catch (e) {
		// eslint-disable-next-line no-console
		log(`Makerlog (axios): ${e.message}`);
		throw new StdErrorCollection(prettyAxiosError(e));
	}
}

export default client;
