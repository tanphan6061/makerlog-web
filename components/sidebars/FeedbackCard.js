import Button from "components/ui/Button";
import Card from "components/ui/Card";
import config from "config";
import React from "react";
import { useRoot } from "stores/RootStore";
import SidebarItem from "./SidebarItem";

export default function FeedbackCard() {
	const { toggleFeedback } = useRoot();

	return (
		<SidebarItem title="Send feedback">
			<Card>
				<Card.Content>
					<div className="mb-2 text-xs text-gray-700">
						{config.IS_WL
							? `${config.WL_NAME}'s Makerlog is a work in progress. Help us build it with you.`
							: "Help us build Makerlog with you."}
					</div>
					<Button xs onClick={toggleFeedback}>
						Send feedback 💌
					</Button>
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}
