import React from "react";
import Button from "components/ui/Button";
import Avatar from "components/ui/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "routes";
import { useAuth } from "stores/AuthStore";
import { useRoot } from "stores/RootStore";
import NotificationsLink from "components/notifications/NotificationsLink";
import EditorModal from "components/editor/EditorModal";
import ActiveLink from "components/router/ActiveLink";
import Dropdown from "components/ui/Dropdown";
import Container from "components/ui/Container";
import GlobalSearch from "components/search/GlobalSearch";
import { useRouter } from "next/router";
import OutboundLink from "components/seo/OutboundLink";
import FeedbackModal from "components/feedback/FeedbackModal";
import config from "config";
import AchievementBar from "components/stats/AchievementBar";

function Navbar() {
	const { pathname } = useRouter();
	const { isLoggedIn, user } = useAuth();
	const {
		toggleEditor,
		editorOpen,
		editorDefaultTab,
		toggleSearch,
		searchOpen,
		toggleFeedback,
		feedbackOpen,
	} = useRoot();

	return (
		<>
			<AchievementBar user={user} />
			<nav className="flex-none bg-white dark:bg-dark-100 mt-safe-top">
				<div className="fixed top-0 left-0 z-50 w-full bg-green-500 h-safe-top"></div>
				{user && user.is_staff ? (
					<div className={`border-t`}></div>
				) : (
					<div
						className={`border-t ${config.WL_BORDER_COLOR} border-1.5`}
					></div>
				)}
				<div className="border-b border-gray-200 dark:border-dark-200">
					<Container className="flex items-center py-4">
						<div className="flex items-center sm:flex-1">
							<Link route="index">
								<a className="flex items-center flex-none h-full mr-4 text-green-500 space-x-2 logo">
									{config.WL_LOGO ? (
										<img
											className="w-auto h-8"
											src={config.WL_LOGO}
										/>
									) : (
										<FontAwesomeIcon icon="check-circle" />
									)}
								</a>
							</Link>
							<div
								className="hidden mr-4 md:block"
								style={{ width: "500px" }}
							>
								<input
									onClick={() => toggleSearch()}
									className=" w-full"
									placeholder="Search products, makers..."
								/>
							</div>
							<div
								className={
									"mobile-footer fixed sm:static flex flex-row bottom-0 left-0 w-full bg-white sm:bg-transparent z-40 border-t border-gray-200 sm:border-none"
								}
							>
								<ActiveLink
									route="index"
									wildcard
									notPath={[
										"stories",
										"about",
										"_error",
										"patron",
									]}
									inactiveClassName={"text-gray-500"}
									activeClassName={config.WL_TEXT_COLOR}
								>
									<a className="flex-1 py-4 mr-0 font-semibold text-center sm:mr-4 sm:py-0 sm:flex-initial">
										Community
									</a>
								</ActiveLink>
								<ActiveLink
									route="patron"
									inactiveClassName={"text-gray-500"}
									activeClassName={config.WL_TEXT_COLOR}
								>
									<a className="flex-1 hidden py-4 mr-0 font-semibold text-center sm:flex sm:mr-4 sm:py-0 sm:flex-initial">
										Patrons
									</a>
								</ActiveLink>
								<ActiveLink
									route="about"
									wildcard
									inactiveClassName={"text-gray-500"}
									activeClassName={config.WL_TEXT_COLOR}
								>
									<a className="flex-1 py-4 mr-0 font-semibold text-center sm:mr-4 sm:py-0 sm:flex-initial">
										More
									</a>
								</ActiveLink>
							</div>
						</div>
						<div className="flex justify-end flex-1">
							{isLoggedIn ? (
								<>
									<button
										className={
											"flex md:hidden circle-button"
										}
										onClick={() => toggleSearch()}
									>
										<FontAwesomeIcon icon="search" />
									</button>
									<button
										onClick={() => toggleEditor()}
										className={"circle-button"}
									>
										<FontAwesomeIcon icon="plus" />
									</button>
									<NotificationsLink />
									<div className="pl-2 cursor-pointer">
										<Dropdown
											hover
											items={
												<>
													<Link
														route="profile"
														params={{
															username:
																user.username,
														}}
													>
														<Dropdown.Item>
															<Dropdown.Item.Icon>
																<FontAwesomeIcon icon="user-circle" />
															</Dropdown.Item.Icon>{" "}
															You
														</Dropdown.Item>
													</Link>
													{!config.IS_WL ? (
														<Link route="integrations">
															<Dropdown.Item>
																<Dropdown.Item.Icon>
																	<FontAwesomeIcon icon="plug" />
																</Dropdown.Item.Icon>{" "}
																Integrations
															</Dropdown.Item>
														</Link>
													) : null}
													<Link route="onboarding">
														<Dropdown.Item>
															<Dropdown.Item.Icon>
																<FontAwesomeIcon icon="chalkboard" />
															</Dropdown.Item.Icon>{" "}
															Tutorial
														</Dropdown.Item>
													</Link>
													<Dropdown.Item
														onClick={toggleFeedback}
													>
														<Dropdown.Item.Icon>
															<FontAwesomeIcon icon="envelope" />
														</Dropdown.Item.Icon>{" "}
														Send feedback
													</Dropdown.Item>
													<Link route="settings">
														<Dropdown.Item>
															<Dropdown.Item.Icon>
																<FontAwesomeIcon icon="cogs" />
															</Dropdown.Item.Icon>{" "}
															Settings
														</Dropdown.Item>
													</Link>
													<Link route="logout">
														<Dropdown.Item>
															<Dropdown.Item.Icon>
																<FontAwesomeIcon icon="sign-out-alt" />
															</Dropdown.Item.Icon>{" "}
															Log out
														</Dropdown.Item>
													</Link>
												</>
											}
										>
											<Avatar user={user} size={8} />
										</Dropdown>
									</div>
								</>
							) : (
								<>
									<Link route="login">
										<Button className="ml-2">Log in</Button>
									</Link>
								</>
							)}
						</div>
					</Container>
				</div>
				{pathname.startsWith("/about") ? (
					<div className="border-b border-gray-200 dark:border-dark-200">
						<Container className="py-2">
							<div className="flex flex-auto max-w-full px-4 -mx-4 overflow-x-auto box-content">
								<ActiveLink
									route="about"
									inactiveClassName={"text-gray-500"}
									activeClassName={config.WL_TEXT_COLOR}
								>
									<a className="mr-4 font-medium">About</a>
								</ActiveLink>{" "}
								<ActiveLink
									route="chats"
									inactiveClassName={"text-gray-500"}
									activeClassName={config.WL_TEXT_COLOR}
								>
									<a className="mr-4 font-medium">Chats</a>
								</ActiveLink>
								{!config.IS_WL ? (
									<ActiveLink
										route="book-ad"
										inactiveClassName={"text-gray-500"}
										activeClassName={config.WL_TEXT_COLOR}
									>
										<a className="mr-4 font-medium">
											Advertise
										</a>
									</ActiveLink>
								) : null}
								<ActiveLink
									route="legal"
									inactiveClassName={"text-gray-500"}
									activeClassName={config.WL_TEXT_COLOR}
								>
									<a className="mr-4 font-medium">Legal</a>
								</ActiveLink>
								<ActiveLink
									route="contact"
									inactiveClassName={"text-gray-500"}
									activeClassName={config.WL_TEXT_COLOR}
								>
									<a className="mr-4 font-medium">Contact</a>
								</ActiveLink>
								<div className="flex-grow"></div>
								<OutboundLink
									to="https://open.getmakerlog.com"
									className="mr-4 font-medium text-gray-500"
								>
									Open
								</OutboundLink>
							</div>
						</Container>
					</div>
				) : (
					!pathname.startsWith("/patron") && (
						<div className="border-b border-gray-200 dark:border-dark-200">
							<Container className="py-2">
								<div className="flex flex-auto max-w-full px-4 -mx-4 overflow-x-auto box-content">
									<ActiveLink
										route="index"
										inactiveClassName={"text-gray-500"}
										activeClassName={config.WL_TEXT_COLOR}
									>
										<a className="mr-4 font-medium">Feed</a>
									</ActiveLink>
									<ActiveLink
										route="products"
										inactiveClassName={"text-gray-500"}
										activeClassName={config.WL_TEXT_COLOR}
									>
										<a className="mr-4 font-medium">
											Products
										</a>
									</ActiveLink>
									{isLoggedIn && (
										<>
											<div className="flex-grow"></div>
											<ActiveLink
												route="tasks"
												inactiveClassName={
													"text-gray-500"
												}
												activeClassName={
													config.WL_TEXT_COLOR
												}
											>
												<a className="flex-none pr-4 font-medium md:pr-0">
													Your Tasks
												</a>
											</ActiveLink>
										</>
									)}
								</div>
							</Container>
						</div>
					)
				)}
				{isLoggedIn && (
					<EditorModal
						open={editorOpen}
						onClose={() => toggleEditor()}
						defaultTab={editorDefaultTab}
					/>
				)}
				<GlobalSearch open={searchOpen} onClose={toggleSearch} />
				<FeedbackModal open={feedbackOpen} onClose={toggleFeedback} />
			</nav>
		</>
	);
}

export default Navbar;
