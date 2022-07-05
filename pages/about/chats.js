import { NextSeo } from "next-seo";
import Container from "components/ui/Container";
import React from "react";
import Button from "components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "routes";

function ChatsPage() {
	return (
		<div>
			<Container className="flex flex-col items-center justify-center flex-grow">
				<h1 className="text-6xl font-bold">Chats 💬</h1>
				<p className="text-xl text-gray-700">
					Join the group chats to share your work, get feedback, and
					discuss indie maker culture.
				</p>
				<div className="mt-4 space-x-4">
					<Link href="/telegram">
						<Button lg>
							<FontAwesomeIcon icon={["fab", "telegram"]} />
							&nbsp;Telegram
						</Button>
					</Link>
					<Link href="/discord">
						<Button lg>
							<FontAwesomeIcon icon={["fab", "discord"]} />
							&nbsp;Discord
						</Button>
					</Link>
					<Link href="/slack">
						<Button lg>
							<FontAwesomeIcon icon={["fab", "slack"]} />
							&nbsp;Slack
						</Button>
					</Link>
				</div>
			</Container>
			<NextSeo title="Chats" />
		</div>
	);
}

ChatsPage.getInitialProps = async () => {
	return {
		layout: {
			contained: false,
			contentClassName:
				"bg-white flex flex-col items-center justify-center",
		},
	};
};

export default ChatsPage;
