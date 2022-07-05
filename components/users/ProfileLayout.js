import Container from "components/ui/Container";
import config from "config";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import { useUserStats } from "queries/stats";
import React from "react";
import { getFullNameOrUsername } from "./FullName";
import ProfileHeader from "./ProfileHeader";

export default function ProfileLayout({
	user,
	headerProps = {},
	layoutProps = {},
	children,
	withSeo = true,
}) {
	// not terribly essential, not to worried about error states
	const { data: stats } = useUserStats(user.username);

	return (
		<div>
			<ProfileHeader
				{...headerProps}
				user={user}
				stats={stats ? stats : null}
			/>

			<Container className="py-4">
				<NarrowLayout {...layoutProps}>{children}</NarrowLayout>
			</Container>

			{withSeo && (
				<NextSeo
					title={getFullNameOrUsername(user)}
					description={`${getFullNameOrUsername(
						user
					)} is on Makerlog, the community where makers build products together.`}
					canonical={`${config.BASE_URL}/@${user.username}`}
					openGraph={{
						type: "profile",
						profile: {
							firstName: user.first_name,
							lastName: user.last_name,
							username: user.username,
						},
						images: [
							{
								url: user.og_image,
							},
						],
					}}
				/>
			)}
		</div>
	);
}
