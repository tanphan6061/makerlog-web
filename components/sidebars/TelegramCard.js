import Button from "components/ui/Button";
import Card from "components/ui/Card";
import React from "react";
import SidebarItem from "./SidebarItem";
import OutboundLink from "components/seo/OutboundLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TelegramCard() {
	return (
		<SidebarItem title="Telegram chat">
			<Card>
				<Card.Content>
					<div className="mb-2 text-xs text-gray-700">
						Share what you're working on, get feedback, ask for
						help.
					</div>
					<OutboundLink to="https://t.me/makerlog">
						<Button xs>
							<Button.Icon>
								<FontAwesomeIcon icon={["fab", "telegram"]} />
							</Button.Icon>{" "}
							Start Chatting
						</Button>
					</OutboundLink>
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}
