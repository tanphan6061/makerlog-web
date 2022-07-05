import OutboundLink from "components/seo/OutboundLink";
import Card from "components/ui/Card";
import React from "react";
import SidebarItem from "./SidebarItem";
import normalizeUrl from "normalize-url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function SocialsCard({ object }) {
	if (!object) return null;
	const twitter = object.twitter || object.twitter_handle;
	const website = object.website || object.url;
	const github = object.github || object.github_handle;
	const telegram = object.telegram || object.telegram_handle;
	const bmc = object.bmc_handle || object.bmc;

	if (!twitter && !website && !github && !telegram && !bmc) return null;

	return (
		<SidebarItem title={`Links`}>
			<Card>
				<Card.Content>
					{website && (
						<div className="text-xs">
							<OutboundLink to={normalizeUrl(website)}>
								<FontAwesomeIcon icon="globe" />{" "}
								{normalizeUrl(website)
									.replace("http://", "")
									.replace("https://", "")}
							</OutboundLink>
						</div>
					)}
					{twitter && (
						<div className="text-xs">
							<OutboundLink to={`https://twitter.com/${twitter}`}>
								<FontAwesomeIcon icon={["fab", "twitter"]} />{" "}
								{twitter}
							</OutboundLink>
						</div>
					)}

					{github && (
						<div className="text-xs">
							<OutboundLink to={`https://github.com/${github}`}>
								<FontAwesomeIcon icon={["fab", "github"]} />{" "}
								{github}
							</OutboundLink>
						</div>
					)}

					{bmc && (
						<div className="text-xs">
							<OutboundLink
								to={`https://buymeacoffee.com/${bmc}`}
							>
								<FontAwesomeIcon icon={"mug-hot"} /> {bmc}
							</OutboundLink>
						</div>
					)}

					{telegram && (
						<div className="text-xs">
							<OutboundLink to={`https://t.me/${telegram}`}>
								<FontAwesomeIcon icon={["fab", "telegram"]} />{" "}
								{telegram}
							</OutboundLink>
						</div>
					)}
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}

export default SocialsCard;
