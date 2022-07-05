import AchievementBar from "components/stats/AchievementBar";
import Avatar from "components/ui/Avatar";
import React from "react";
import { Link } from "routes";
import { useAuth } from "stores/AuthStore";

function Progress({ className }) {
	return (
		<div
			className={
				"fixed top-0 left-0 z-20 h-2 bg-green-500 transition-all " +
				className
			}
		></div>
	);
}

function Action({ children, hidden = false, className = "" }) {
	if (hidden) return null;
	return (
		<div
			className={
				"flex justify-center flex-1 pb-16 lg:pb-0 lg:overflow-hidden bg-green-900 " +
				className
			}
		>
			<div className="flex-grow max-w-2xl px-4 lg:p-8">{children}</div>
		</div>
	);
}

function Tutorial({ children, buttons = null }) {
	const { user } = useAuth();

	return (
		<div className="flex flex-col flex-grow bg-white border-r lg:max-w-lg">
			<div className="flex-grow p-8 content">
				<div className="flex items-center">
					<Link route="index">
						<img className="h-5" src="/img/logo.svg" />
					</Link>
					<div className="flex-grow"></div>
					<Link route="profile" params={{ username: user.username }}>
						<Avatar size={8} user={user} />
					</Link>
				</div>
				<div className="mt-12 prose dark:prose-dark">{children}</div>
			</div>
			<div className="fixed bottom-0 z-20 w-full px-8 py-4 bg-white border-t lg:border-t-0 lg:static">
				{buttons}
			</div>
		</div>
	);
}
function OnboardingLayout({ children }) {
	const { user } = useAuth();

	return (
		<div className="flex flex-col bg-gray-50">
			<AchievementBar user={user} />
			<div className="flex flex-col flex-grow h-screen lg:flex-row">
				{children}
			</div>
		</div>
	);
}

OnboardingLayout.Action = Action;
OnboardingLayout.Tutorial = Tutorial;
OnboardingLayout.Progress = Progress;

export default OnboardingLayout;
