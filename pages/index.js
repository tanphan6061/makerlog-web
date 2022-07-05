import Card from "../components/ui/Card";
import { useAuth } from "stores/AuthStore";
import Editor from "components/editor/Editor";
import NarrowLayout from "layouts/NarrowLayout";
import { requiresOnboarding } from "utils/auth";
import OnboardingCard from "components/auth/OnboardingCard";
import { NextSeo } from "next-seo";
import DayView from "components/tasks/DayView";
import MyStreakCard from "components/sidebars/MyStreakCard";
import StdSidebar from "components/sidebars/StdSidebar";
import TopStreaksCard from "components/sidebars/TopStreaksCard";
import RisingMakersCard from "components/sidebars/RisingMakersCard";
import { dehydrate } from "react-query/hydration";
import { QueryClient } from "react-query";
import Hero from "components/ui/Hero";
import Container from "components/ui/Container";
import ContentLayout from "layouts/ContentLayout";
import { useRoot } from "stores/RootStore";
import OnboardingChecklistCard from "components/sidebars/OnboardingChecklistCard";
import Feed from "components/feeds/Feed";
import Message from "components/ui/Message";

function HomePage() {
	return (
		<div>
			<Hero
				className="bg-bubbles-gradient"
				style={{
					padding: 0,
					marginBottom: 0,
				}}
			>
				<div className="flex items-stretch w-full text-center sm:text-left">
					<div className="flex-1 flex-shrink-0 py-12 sm:pr-6 sm:py-48">
						<h1 className="text-2xl font-extrabold sm:text-4xl">
							How makers stay productive
						</h1>
						<p className="mb-8 text-gray-700">
							Your task list made public. Get feedback, stay
							accountable and ship better products with us.
						</p>

						<Message warning>
							Sign ups are temporarily closed for product updates.
							Stay tuned on Twitter for updates.
						</Message>
					</div>
					<div className="flex-1 flex-shrink-0 hidden w-full sm:block"></div>
				</div>
			</Hero>
			<div className="px-4 py-12 border-b border-gray-200 bg-gray-50">
				<Container>
					<div className="text-center">
						<h3 className="font-semibold">It's simple.</h3>
						<p className="mb-6 text-gray-700">
							Consistency & value is what makes you shine on
							Makerlog.
						</p>
					</div>

					<div className="max-w-lg mx-auto grid gap-4 lg:grid-cols-3 lg:max-w-none">
						<div>
							<div className="flex">
								<span
									className={
										"flex-none flex items-center justify-center w-8 h-8 p-2 mx-2 font-semibold text-center rounded-full bg-green-500 text-white"
									}
								>
									1
								</span>
								<p className="flex flex-col">
									<span className="font-medium">
										Log your daily tasks.
									</span>
									<span className="text-gray-700">
										Share your completed tasks publicly to
										stay accountable.
									</span>
								</p>
							</div>
						</div>

						<div>
							<div className="flex">
								<span
									className={
										"flex-none flex items-center justify-center w-8 h-8 p-2 mx-2 font-semibold text-center rounded-full bg-green-500 text-white"
									}
								>
									2
								</span>
								<p className="flex flex-col">
									<span className="font-medium">
										Earn a streak.
									</span>
									<span className="text-gray-700">
										A streak is the count of consecutive
										days of completed tasks.
									</span>
								</p>
							</div>
						</div>

						<div>
							<div className="flex">
								<span
									className={
										"flex-none flex items-center justify-center w-8 h-8 p-2 mx-2 font-semibold text-center rounded-full bg-green-500 text-white"
									}
								>
									3
								</span>
								<p className="flex flex-col">
									<span className="font-medium">
										Learn & grow.
									</span>
									<span className="text-gray-700">
										Share your achievements, encourage
										others, and grow with us.
									</span>
								</p>
							</div>
						</div>
					</div>
				</Container>
			</div>

			<ContentLayout
				rightSidebar={
					<>
						<StdSidebar />
						<TopStreaksCard />
						<RisingMakersCard />
					</>
				}
			>
				<Feed indexUrl={`/feeds/world/`} live={false} />
			</ContentLayout>
		</div>
	);
}

function FeedPage() {
	const { isOnboarding } = useRoot();
	const { user } = useAuth();

	return (
		<Container className="py-4">
			<NarrowLayout
				leftSidebar={
					<>
						<StdSidebar />
						<OnboardingChecklistCard />
					</>
				}
				rightSidebar={
					<>
						<MyStreakCard />
						<TopStreaksCard />
						<RisingMakersCard />
					</>
				}
			>
				{requiresOnboarding(user) || isOnboarding ? (
					<OnboardingCard />
				) : (
					<>
						<Card>
							<Card.Content>
								<Editor />
							</Card.Content>
						</Card>
						<div className="mb-4">
							<DayView small withHeader={false} />
						</div>
						<Feed />
					</>
				)}
				<NextSeo title="Feed" />
			</NarrowLayout>
		</Container>
	);
}

function IndexPage() {
	const { isLoggedIn } = useAuth();

	return !isLoggedIn ? <HomePage /> : <FeedPage />;
}

IndexPage.getInitialProps = async () => {
	const queryClient = new QueryClient();
	return {
		dehydratedState: dehydrate(queryClient),
		layout: {
			footer: false,
			contained: false,
		},
	};
};

export default IndexPage;
