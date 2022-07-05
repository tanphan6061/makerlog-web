import React from "react";
import AdSidebarCard from "./AdSidebarCard";
import FeedbackCard from "./FeedbackCard";
import TelegramCard from "./TelegramCard";

function StdSidebar() {
	return (
		<>
			<AdSidebarCard />
			<FeedbackCard />
			<TelegramCard />
		</>
	);
}

export default StdSidebar;
