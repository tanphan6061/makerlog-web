import OnboardingChecklist from "components/onboarding/OnboardingChecklist";
import Card from "components/ui/Card";
import React from "react";
import { useAuth } from "stores/AuthStore";
import { isNewUser } from "utils/user";
import SidebarItem from "./SidebarItem";

export default function OnboardingChecklistCard() {
	const { user } = useAuth();
	if (!isNewUser(user)) return null;

	return (
		<SidebarItem title="Welcome">
			<Card>
				<Card.Content>
					<OnboardingChecklist />
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}
