import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/ui/Button";
import React, { useEffect, useState } from "react";
import { getTwitterShareUrl } from "utils/stats";
import { CSSTransition } from "react-transition-group";
import { useStats } from "stores/StatsStore";
import { isServer } from "config";
import Confetti from "react-dom-confetti";
import { trackEvent } from "vendor/segment";

function shouldOpen(previous, current) {
	return (
		(previous === 0 && current === 1) ||
		(previous === 6 && current === 7) ||
		(previous === 24 && current === 25) ||
		(previous % 50 !== 0 && current > 0 && current % 50 === 0)
	);
}

function AchievementBarText({ current }) {
	if (current === 1) {
		return (
			<>
				<p className="text-sm font-medium text-gray-900">
					You've kicked off a streak! ✨
				</p>
				<p className="mt-1 text-sm text-gray-500">
					You're starting to build consistently. Keep on logging for
					more surprises!
				</p>
			</>
		);
	}

	if (current === 7) {
		return (
			<>
				<p className="text-sm font-medium text-gray-900">
					One week of building daily 💪
				</p>
				<p className="mt-1 text-sm text-gray-500">
					Give yourself a pat on the back and keep building!
				</p>
			</>
		);
	}

	if (current === 25) {
		return (
			<>
				<p className="text-sm font-medium text-gray-900">
					A month of building consistently 😱
				</p>
				<p className="mt-1 text-sm text-gray-500">
					That's incredible progress, high five!
				</p>
			</>
		);
	}

	if (current > 0 && current % 50 === 0) {
		return (
			<>
				<p className="text-sm font-medium text-gray-900">
					The {current} Day Club {current === 100 ? "💯" : "🔥"}
				</p>
				<p className="mt-1 text-sm text-gray-500">
					You've built consistently for {current} days!
				</p>
			</>
		);
	}

	return null;
}

export default function AchievementBar({ user }) {
	const { stats, previousStats } = useStats();
	const [open, setOpen] = useState(false);
	const [confetti, setConfetti] = useState(false);

	const previousStreak = previousStats ? previousStats.streak : null;
	const currentStreak = stats ? stats.streak : null;

	useEffect(() => {
		if (shouldOpen(previousStreak, currentStreak)) {
			let timer = setTimeout(() => {
				trackEvent("Displayed Achievement Bar", {
					previousStreak: previousStreak,
					streak: currentStreak,
				});
				setOpen(true);
				setConfetti(true);
			}, 1000);
			let closeTimer = setTimeout(() => {
				setOpen(false);
				setConfetti(false);
			}, 8000);
			return () => {
				clearTimeout(timer);
				clearTimeout(closeTimer);
			};
		}
	}, [currentStreak, previousStreak]);

	if (isServer) return null;

	return (
		<CSSTransition
			classNames={"slide"}
			in={open}
			timeout={150}
			unmountOnExit
		>
			<div className="fixed inset-x-0 z-30 flex flex-col justify-end px-4 pb-2 sm:px-0 bottom-16 sm:bottom-0 sm:pb-5">
				<div className="flex items-center w-full max-w-3xl mx-auto bg-white border-4 border-green-500 rounded-lg shadow-xl pointer-events-auto ring-1 ring-black ring-opacity-5">
					<div className="flex-1 w-0 p-4">
						<div className="flex items-start">
							<div className="flex-shrink-0 pt-0.5">
								<span className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
									<FontAwesomeIcon
										icon="fire"
										color="white"
									/>
									<Confetti active={confetti} />
								</span>
							</div>
							<div className="flex-1 w-0 ml-3">
								<AchievementBarText
									current={currentStreak}
									previous={previousStreak}
								/>

								<div className="flex mt-4 sm:hidden">
									<Button
										secondary
										sm
										anchorElem
										href={getTwitterShareUrl(user)}
										target="_blank"
									>
										<Button.Icon>
											<FontAwesomeIcon
												icon={["fab", "twitter"]}
											/>
										</Button.Icon>
										Tweet
									</Button>
								</div>
							</div>
						</div>
					</div>
					<div className="hidden sm:flex">
						<Button
							secondary
							sm
							anchorElem
							href={getTwitterShareUrl(user)}
							target="_blank"
						>
							<Button.Icon>
								<FontAwesomeIcon icon={["fab", "twitter"]} />
							</Button.Icon>
							Tweet
						</Button>
					</div>
					<div className="flex">
						<button
							onClick={() => {
								setOpen(false);
								setConfetti(false);
							}}
							className="flex items-center justify-center w-full p-4 text-sm font-medium text-gray-400 border border-transparent rounded-none rounded-r-lg hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<svg
								className="w-6 h-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</CSSTransition>
	);
}
