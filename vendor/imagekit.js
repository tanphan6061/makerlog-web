import config from "config";

export function imageUrl(src, sz = null, optimOnly = false) {
	if (!src) return src;
	if (src.startsWith("/media/")) return `${config.API_URL}${src}`;
	if (!config.IMGOPT_ENABLED) return src;
	if (src.startsWith("data:")) return src;
	if (src.includes("gif")) return src;
	if (optimOnly) return `${src}?auto=compress`;

	let optims = {
		tr: "",
	};

	if (sz) {
		if (typeof sz === "object") {
			optims.tr += `w-${sz.w},h-${sz.h}`;
		} else {
			optims.tr += `w-${sz},h-${sz}`;
			optims.tr += `,fo-auto`;
		}
	}

	const params = new URLSearchParams(optims);

	if (src.includes("gravatar")) {
		return `${src}&${params.toString()}`;
	}

	return `${src}?${params.toString()}`;
}
