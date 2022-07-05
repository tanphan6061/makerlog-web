import OutboundLink from "components/seo/OutboundLink";
import Card from "components/ui/Card";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import React from "react";

export default function ContactPage() {
	return (
		<NarrowLayout>
			<h2 className="mb-2 font-bold">Contact the makers</h2>
			<Card>
				<Card.Content>
					<p className="prose dark:prose-dark">
						<p>
							<strong>
								You can reach me quite easily via Twitter,
								Telegram, or email.
							</strong>
						</p>
						<p>
							<ul>
								<li>
									<strong>Sergio Mattei: </strong>
									<OutboundLink href="https://twitter.com/matteing">
										Twitter
									</OutboundLink>
									,{" "}
									<OutboundLink href="https://t.me/matteing">
										Telegram
									</OutboundLink>
								</li>
							</ul>
						</p>
						<p>
							You can also&nbsp;
							<OutboundLink
								icons
								href="https://calendly.com/matteing"
							>
								schedule a call
							</OutboundLink>{" "}
							with me, Sergio, to discuss maker-related matters or
							ideas. Just don't try to sell me anything, please!
						</p>
						<p>
							<img
								style={{ height: 50 }}
								src="https://i.imgur.com/5WY22Q1.png"
							/>
						</p>
					</p>
				</Card.Content>
			</Card>
			<NextSeo title="Contact" />
		</NarrowLayout>
	);
}
