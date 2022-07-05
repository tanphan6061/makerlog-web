import WallOfLove from "components/about/WallOfLove";
import SidebarItem from "components/sidebars/SidebarItem";
import StdSidebar from "components/sidebars/StdSidebar";
import Card from "components/ui/Card";
import Container from "components/ui/Container";
import UserLine from "components/ui/UserLine";
import ContentLayout from "layouts/ContentLayout";
import { NextSeo } from "next-seo";
import React from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";

function AboutPage() {
	return (
		<div>
			<div className="py-24 border-b border-gray-200 bg-bubbles-gradient">
				<Container>
					<h1>Learn, build, and grow with us.</h1>
					<p className="text-gray-700">
						Makerlog is a community of 8,000+ makers building
						software products publicly, together.
					</p>
				</Container>
			</div>

			<ContentLayout
				rightSidebar={
					<>
						<StdSidebar />
						<SidebarItem title="Quick stats">
							<Card>
								<Card.Content>
									<div className="flex space-x-2">
										<div className="flex-1 text-center">
											<h4 className="font-bold">200k+</h4>
											<small className="text-xs text-gray-700">
												Tasks posted
											</small>
										</div>
										<div className="flex-1 text-center">
											<h4 className="font-bold">8k+</h4>
											<small className="text-xs text-gray-700">
												Makers
											</small>
										</div>
										<div className="flex-1 text-center">
											<h4 className="font-bold">100k+</h4>
											<small className="text-xs text-gray-700">
												Reach
											</small>
										</div>
									</div>
								</Card.Content>
							</Card>
						</SidebarItem>
						<SidebarItem title="Twitter">
							<TwitterTimelineEmbed
								sourceType="profile"
								screenName="getmakerlog"
								options={{ height: 400 }}
							/>
						</SidebarItem>
					</>
				}
			>
				<div className="mb-8">
					<h3 className="mb-2 font-bold">What's Makerlog?</h3>
					<Card>
						<Card.Content>
							<div className="p-4 mb-4 border-l border-gray-200 bg-gray-50">
								<div>
									<h4>maker</h4>
									<small>
										<em>noun · /ˈmeɪ.kər/</em>
									</small>
								</div>
								<div>
									<ul className="list-disc list-inside">
										<li>
											someone who creates or invents
											things, either using traditional
											crafts or technology
										</li>
										<li>
											the people or company that make
											something
										</li>
										<li>an avid Makerlog user</li>
									</ul>
								</div>
							</div>
							<p>
								Makerlog is a community of over 7,000 makers in
								tech shipping side projects together. Folks can
								post their daily tasks and grow a network of
								supportive, like-minded people! Which is pretty
								awesome.
							</p>
						</Card.Content>
					</Card>
				</div>
				<div className="mb-8">
					<h3 className="mb-2 font-bold">How does it work?</h3>
					<Card>
						<Card.Content>
							<p>
								Makerlog works by logging your daily
								project-related tasks, earning streaks
								(consecutive days of work), and interacting with
								other makers to get feedback or early users.
							</p>
						</Card.Content>
					</Card>
				</div>
				<div className="mb-8">
					<h3 className="mb-2 font-bold">Umm... why?</h3>
					<Card>
						<Card.Content>
							<p>
								Making can be a really lonely thing. Depending
								on where you are, you might not have access to a
								supportive environment for your entrepreneurship
								endeavors. We believe every maker could benefit
								from a group of like-minded peers to help them
								in their journey! <br /> <br /> Also...
								Traditional social media is all about
								consumption. We're all about productivity first.
								Makerlog's the platform that makes you more
								productive rather than less!
							</p>
						</Card.Content>
					</Card>
				</div>
				<div>
					<h3 className="mb-2 font-bold">How'd it start?</h3>
					<Card>
						<Card.Content>
							<p>
								I started Makerlog in 2018, while in high
								school. I've been a maker since childhood, and
								throughout that entire time I never really felt
								anyone understood what I did. I never had a
								support network until I found the maker
								community. I grew to love the community and
								developed a huge passion for this really weird,
								yet amazing group of people... I then decided to
								make Makerlog to help push this movement
								forward.
							</p>
							<div className="flex mt-2 space-x-1">
								<UserLine
									user={{
										id: 1,
										username: "sergio",
										first_name: "Sergio",
										last_name: "Mattei 🇵🇷",
										status: "shipping Makerlog & Opsbot",
										description: "Maker of Makerlog.",
										verified: true,
										private: false,
										avatar: "https://ik.imagekit.io/makerlog/media/uploads/avatars/2020/07/22/IMG-20200623-WA0106.jpg",
										streak: 723,
										timezone: "America/Puerto_Rico",
										week_tda: 3,
										twitter_handle: "matteing",
										instagram_handle: "diettam",
										product_hunt_handle: "ftxrc",
										github_handle: "matteing",
										telegram_handle: "matteing",
										nomadlist_handle: "",
										bmc_handle: "mattei",
										header: "https://ik.imagekit.io/makerlog/media/uploads/headers/2020/10/19/sale_1.png",
										is_staff: true,
										donor: false,
										shipstreams_handle: "sergiomattei",
										website: "https://mattei.link",
										tester: false,
										is_live: false,
										digest: true,
										gold: true,
										accent: "#B4B7FF",
										maker_score: 2407,
										dark_mode: true,
										weekends_off: false,
										hardcore_mode: false,
										email_notifications: true,
										og_image:
											"https://ik.imagekit.io/makerlog/media/uploads/og/2020/11/15/5e7906b9-cb45-4a08-a809-9d18206df34d.jpg",
										date_joined: "2018-03-14T09:19:05Z",
										interests: [],
									}}
								/>
							</div>
						</Card.Content>
					</Card>
				</div>
			</ContentLayout>
			<div className="py-8 bg-white border-t border-gray-200">
				<Container>
					<h1>Wall of Love</h1>
					<p className="text-gray-700">
						This is the maker community.
					</p>
					<div className="mt-8">
						<WallOfLove />
					</div>
				</Container>
			</div>

			<NextSeo title="About" />
		</div>
	);
}

AboutPage.getInitialProps = async () => {
	return {
		layout: {
			contained: false,
		},
	};
};

export default AboutPage;
