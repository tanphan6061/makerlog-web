import IntegrationMedia from "components/integrations/IntegrationMedia";
import Card from "components/ui/Card";
import PageHeader from "components/ui/PageHeader";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import React from "react";

function IntegrationsPage() {
	return (
		<NarrowLayout>
			<PageHeader>
				<div>
					<h2 className="font-bold">Integrations</h2>
					<p>Makerlog works with the stuff you already use. </p>
				</div>
			</PageHeader>
			<Card>
				<Card.Content>
					<p className="heading">Community-made</p>
					<div className="space-y-2">
						<IntegrationMedia
							name="Makerlog Menubar"
							description="Log your tasks right from your menubar."
							logo={"/img/integrations/menubar.jpeg"}
							externalUrl="https://menubar.getmakerlog.com/"
						/>
						<IntegrationMedia
							name="Today for Makerlog"
							description="A simple task manager for Makerlog."
							logo={"/img/integrations/today.png"}
							externalUrl="https://today.jipfr.nl/"
						/>
						<IntegrationMedia
							name="Makerlog CLI"
							description="Log straight from the terminal."
							logo={"/img/integrations/cli.png"}
							externalUrl="https://github.com/MihaiVoinea/makerlog-cli/"
						/>
						<IntegrationMedia
							name="Logger for Makerlog"
							description="An unofficial mobile app for Makerlog"
							logo={"/img/integrations/logger.webp"}
							externalUrl="https://play.google.com/store/apps/details?id=com.brownfingers.getmakerlog"
						/>
						<IntegrationMedia
							name="Alfred Workflow for Makerlog"
							description="A simple Alfred workflow for Makerlog"
							logo={"/img/integrations/alfred.png"}
							externalUrl="https://github.com/meSingh/alfred-makerlog"
						/>
						<IntegrationMedia
							name="BuyMeACoffee for Makerlog"
							description="A simple BMC integration for Makerlog"
							logo={"/img/integrations/bmc.png"}
							externalUrl="https://buymeacoffee.netlify.com/"
						/>
					</div>
					<p className="mt-4 heading">Official integrations</p>
					<div className="space-y-2">
						<IntegrationMedia
							name="Telegram"
							description="The official Makerlog bot & community"
							logo={"/img/integrations/telegram.png"}
							linkParams={{
								route: "integration-telegram",
							}}
						/>
						<IntegrationMedia
							name="Slack"
							description="Log tasks and see your stats with Makebot."
							logo={"/img/integrations/slack.png"}
							linkParams={{
								route: "integration-slack",
							}}
						/>
						<IntegrationMedia
							name="Webhooks"
							description="Log from basically anywhere."
							logo={"/img/integrations/webhooks.png"}
							linkParams={{
								route: "integration-webhooks",
							}}
						/>
					</div>
				</Card.Content>
			</Card>

			<NextSeo title="Integrations" />
		</NarrowLayout>
	);
}

export default IntegrationsPage;
