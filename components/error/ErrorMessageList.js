import React from "react";
import OutboundLink from "components/seo/OutboundLink";
import { isDev } from "config";
import Message from "components/ui/Message";
import Button from "components/ui/Button";

function renderError(error) {
	switch (error.type) {
		case "field":
			return (
				<>
					<strong>
						{error.fieldName.replace("project", "hashtag")}
					</strong>
					: {error.message}{" "}
					{error.link !== null ? (
						<OutboundLink to={error.link}>Read more</OutboundLink>
					) : (
						""
					)}
				</>
			);

		case "unknown":
			return (
				<>
					{error.message}
					{isDev && (
						<>
							<br />
							<pre>{error.stack}</pre>
						</>
					)}
				</>
			);
		default:
			return error.message;
	}
}

function renderMultipleErrors(error) {
	let res = [];
	error.errors.map((e) => (res = [...res, renderError(e)]));
	return (
		<ul className="pl-5 list-disc">
			{res.map((r, idx) => (
				<li key={idx}>{r}</li>
			))}
		</ul>
	);
}

const ErrorMessageList = ({ error = null }) => {
	if (error === null || !(error.type === "StdErrorCollection")) return null;

	if (error.getUnknownErrors && error.getUnknownErrors().length) {
		return (
			<>
				<Message
					className="relative overflow-hidden"
					danger
					title="An unknown error ocurred."
					titleHint={error.getUnknownErrors()[0].message}
				>
					{isDev && (
						<p className="mb-2">
							{error.getUnknownErrors()[0].message}
						</p>
					)}
					<div className="absolute opacity-50 nyan right-2 top-6">
						<img
							className="h-20 transform -rotate-12"
							src="/img/nyan.png"
							alt="A Nyan cat."
						/>
					</div>
					{error.getUnknownErrors()[0].link !== null ? (
						<Button
							sm
							anchorElem
							href={error.getUnknownErrors()[0].link}
						>
							Report error
						</Button>
					) : null}
				</Message>
			</>
		);
	}

	return (
		<Message
			danger
			title={
				error.message ? error.message : "Oops, something went wrong."
			}
		>
			{error.errors.length > 1 && renderMultipleErrors(error)}
		</Message>
	);
};

export default ErrorMessageList;
