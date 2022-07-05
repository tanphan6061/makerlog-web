import Button from "components/ui/Button";
import Container from "components/ui/Container";
import { NextSeo } from "next-seo";
import { Link } from "routes";
import { useRoot } from "stores/RootStore";
import config from "config";
import OutboundLink from "components/seo/OutboundLink";

export const ERROR_LAYOUT_PROPS = {
	contained: false,
	bgClassName: "bg-white",
	contentClassName: "flex flex-col justify-center",
};

function Error({ statusCode, ...props }) {
	const { toggleFeedback } = useRoot();
	const statusMessage = config.MAINTENANCE_MODE
		? "Makerlog is undergoing temporary maintenance. Please check back later."
		: statusCode
		? statusCode === 403
			? "You're not allowed to perform this action."
			: `A ${statusCode} error occurred on the server.`
		: "An unexpected error occurred on the client.";

	return (
		<Container className="relative flex flex-col justify-center flex-grow h-full">
			<div>
				<img
					className="w-auto h-8"
					src="/img/nyan.png"
					alt="A Nyan cat."
				/>
			</div>
			<h1>
				{config.MAINTENANCE_MODE
					? "We're building..."
					: "Oh no! Something went wrong."}
			</h1>
			<p className="mb-8 text-gray-700">{statusMessage}</p>
			{config.MAINTENANCE_MODE ? (
				<div className="mb-8 space-y-2 sm:space-x-2 sm:space-y-0">
					<OutboundLink to="https://twitter.com/getmakerlog">
						<Button secondary>Twitter</Button>
					</OutboundLink>
					<OutboundLink to="https://t.me/makerlog">
						<Button>Telegram</Button>
					</OutboundLink>
				</div>
			) : (
				<div className="mb-8 space-y-2 sm:space-x-2 sm:space-y-0">
					<Button secondary onClick={toggleFeedback}>
						Report an issue
					</Button>
					<Link route="index">
						<Button>Go home</Button>
					</Link>
				</div>
			)}
			{props.errorMessage && (
				<p className="help">
					Ref: {props.errorMessage} ({statusCode})
				</p>
			)}
			<NextSeo title="Oops!" />
		</Container>
	);
}

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return {
		statusCode,
		err,
		layout: ERROR_LAYOUT_PROPS,
	};
};

export default Error;
