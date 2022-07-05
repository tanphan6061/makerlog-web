import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "./Card";
import Button from "./Button";
import { Link } from "routes";

function getMessageForError(code) {
	switch (code) {
		case 400:
			return "A request error ocurred.";

		case 404:
			return "This wasn't found or it just vanished magically.";

		case 403:
			return "You must sign in to do this.";

		case 500:
			return "A server error ocurred.";

		default:
			return "An unknown error ocurred.";
	}
}

function getActionsForError(code) {
	switch (code) {
		case 400:
			return <Button>Report error</Button>;

		case 404:
			return (
				<Link route="index">
					<Button>Go home</Button>
				</Link>
			);

		case 403:
			return (
				<Link route="login">
					<Button primary>Sign in</Button>
				</Link>
			);

		case 500:
			return <Button>Report error</Button>;

		default:
			return <Button>Report error</Button>;
	}
}

class ErrorCard extends Component {
	static defaultProps = {
		nyan: true,
	};

	render() {
		const { title = "Oops, something went wrong." } = this.props;
		return (
			<Card className="relative overflow-hidden">
				<Card.Content>
					{this.props.nyan ? (
						<div className="absolute opacity-50 nyan right-2 top-6">
							<img
								className="h-20 transform -rotate-12"
								src="/img/nyan.png"
								alt="A Nyan cat."
							/>
						</div>
					) : null}
					<h1 className="text-xl font-bold text-gray-900">{title}</h1>
					<p className="mb-4 text-gray-700">
						{this.props.message
							? this.props.message
							: this.props.statusCode
							? getMessageForError(this.props.statusCode)
							: "An unknown error ocurred."}
					</p>
					{this.props.actions
						? this.props.actions
						: this.props.statusCode
						? getActionsForError(this.props.statusCode)
						: null}
					{this.props.trace ? (
						<Button>
							<Button.Icon>
								<FontAwesomeIcon icon="external-link-alt" />
							</Button.Icon>
							Report error
						</Button>
					) : null}
				</Card.Content>
			</Card>
		);
	}
}

export default ErrorCard;
