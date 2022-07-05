import PostCard from "components/stories/PostCard";
import config from "config";
import React from "react";

export default function FeaturedStory({ frontpage }) {
	if (config.IS_WL) {
		return (
			<div className="mb-4">
				<h3 className="mb-2 font-semibold">
					On {config.WL_NAME} Stories
				</h3>
				<PostCard
					post={{
						slug: "announcing-makerlog-beta",
						id: "5fbde1d8c6d7340006798173",
						uuid: "a7d61771-233b-4844-bb4d-2c2cf706b24d",
						title: "Makerlog raises $150m from Rye Ventures",
						html:
							'<p>Hi folks. Your friendly neighborhood Sergio here.</p><p><a href="https://beta.getmakerlog.com">I\'ll cut to the chase: I\'m very happy to announce the open beta for an all-new Makerlog.</a> I\'ve been hard at work listening to your feedback, fixing bugs, &amp; delivering a solid community platform to be proud of.</p><p>There\'s small improvements all across the board, but here\'s the major ones.</p><h2 id="mobile-">Mobile.</h2><figure class="kg-card kg-image-card kg-card-hascaption"><img src="https://blog.getmakerlog.com/content/images/2020/11/Mobile..png" class="kg-image"><figcaption>It sounds dumb to say this out loud in 2020, but...</figcaption></figure><p>I\'m proud to report that the new Makerlog now works everywhere beautifully: phone, desktop, toaster. </p><h2 id="all-new-profiles-product-pages-">All-new profiles &amp; product pages.</h2><p></p><figure class="kg-card kg-image-card kg-card-hascaption"><img src="https://blog.getmakerlog.com/content/images/2020/11/Ali.png" class="kg-image"><figcaption>Maker Ali Salah\'s profile.</figcaption></figure><p>Showcase your maker journey with beautiful, all-new profiles &amp; product pages. Use your <strong>maker.to/username</strong> link on your social profiles to spread the makerness everywhere!</p><h2 id="all-new-makerlog-stories-">All-new Makerlog Stories.</h2><figure class="kg-card kg-image-card"><img src="https://blog.getmakerlog.com/content/images/2020/11/Twitter-Post---79.png" class="kg-image"></figure><p>I love this one. Makerlog Stories is redesigned from the ground up to be a beautifully pleasant reading experience. </p><figure class="kg-card kg-image-card kg-card-hascaption"><img src="https://blog.getmakerlog.com/content/images/2020/11/Screen-Shot-2020-11-25-at-1.38.17-AM.png" class="kg-image"><figcaption>The end of a story on Makerlog Beta.</figcaption></figure><p>Stories now also come hyperlinked with Makerlog products, profiles, &amp; relevant discussions so you can discover more about the interviewed maker\'s journey.</p><h2 id="a-more-inspiring-homepage-">A more inspiring homepage.</h2><figure class="kg-card kg-image-card"><img src="https://blog.getmakerlog.com/content/images/2020/11/Screen-Shot-2020-11-25-at-1.39.56-AM.png" class="kg-image"></figure><p>No longer must you enter Makerlog to simply log. Now, you can get inspired as well! Top tasks of the day show up top + empty threads to help other makers out. </p><p>Think it\'s too distracting? No worries! There\'s a new feed option: You -&gt; Tasks. It\'ll show your tasks for the day + your personal log only. It\'s great for focus.</p><h2 id="it-s-really-fast-">It\'s really fast.</h2><p>We\'re seeing up to 6x performance improvements on most browsers. The new Makerlog is made to load fast, really fast – in any device &amp; any network condition. </p><h2 id="a-lot-more-">A lot more.</h2><p>Honestly, there\'s just so much to discover in the new Makerlog Beta. Tons of bugs were fixed &amp; new flows were created to make getting those shiny streaks much more enjoyable.</p><p>I\'m aiming for a full production launch near late December.</p><p><strong>It\'s not production-ready yet, which is why we need you! Make sure to submit feedback on the sidebar: we\'re looking to build this openly &amp; publicly. </strong></p><p><a href="https://beta.getmakerlog.com/">Click to check out the new Makerlog.</a></p><p>That\'s it, thanks for reading, and enjoy the new and improved site!</p><h2></h2>',
						comment_id: "5fbde1d8c6d7340006798173",
						feature_image:
							"https://blog.getmakerlog.com/content/images/2020/11/Mobile.-1.png",
						featured: true,
						visibility: "public",
						created_at: "2020-11-25T04:47:20.000+00:00",
						updated_at: "2020-11-25T06:34:20.000+00:00",
						published_at: "2020-11-25T05:49:56.000+00:00",
						custom_excerpt: "",
						codeinjection_head: null,
						codeinjection_foot: null,
						custom_template: null,
						canonical_url: null,
						send_email_when_published: false,
						tags: [
							{
								id: "5ed5624542b8340006e4218f",
								name: "News",
								slug: "news",
								description: "Maker news or product updates.",
								feature_image: null,
								visibility: "public",
								meta_title: null,
								meta_description: null,
								url: "https://blog.getmakerlog.com/tag/news/",
							},
						],
						primary_tag: {
							id: "5ed5624542b8340006e4218f",
							name: "News",
							slug: "news",
							description: "Maker news or product updates.",
							feature_image: null,
							visibility: "public",
							meta_title: null,
							meta_description: null,
							url: "https://blog.getmakerlog.com/tag/news/",
						},
						url:
							"https://blog.getmakerlog.com/posts/announcing-makerlog-beta/",
						excerpt:
							"One of our startups raised $150m earlier this week, according to TechCrunch.",
						reading_time: 2,
						og_image: null,
						og_title: null,
						og_description: null,
						twitter_image: null,
						twitter_title: null,
						twitter_description: null,
						meta_title: null,
						meta_description: null,
						email_subject: null,
					}}
				/>
			</div>
		);
	}

	if (!(frontpage && frontpage.featuredPost)) return null;

	return (
		<div className="mb-4">
			<h3 className="mb-2 font-semibold">On {config.WL_NAME} Stories</h3>
			<PostCard post={frontpage.featuredPost} />
		</div>
	);
}
