import React from "react";
import { useLocalStorage } from "react-use";
import { Link } from "routes";
import { useAuth } from "stores/AuthStore";
import { useStats } from "stores/StatsStore";

export default function OnboardingChecklist() {
	const [chatChecked, setChatChecked] = useLocalStorage(
		"onboarding__chatchecked",
		false
	);
	const { stats } = useStats();
	const { user } = useAuth();

	const doneTasks = stats ? stats.done_tasks + stats.remaining_tasks : 0;
	const tasksDone = doneTasks > 0;
	const profileSetUp = user
		? user.first_name && user.last_name && user.description
		: false;

	return (
		<div className="text-sm">
			<p>
				<span
					className={
						"flex items-center mb-2 text-gray-700 space-x-1 last:mb-0" +
						(tasksDone ? " line-through text-gray-400 " : "")
					}
				>
					<input
						readOnly
						type="checkbox"
						id="first_task"
						name="first_task"
						checked={tasksDone}
					/>
					<label htmlFor="first_task">Post your first task</label>
				</span>
				<Link route="settings">
					<span
						className={
							"flex cursor-pointer items-center mb-2 text-gray-700 space-x-1 last:mb-0" +
							(profileSetUp ? " line-through text-gray-400 " : "")
						}
					>
						<input
							type="checkbox"
							id="profile_setup"
							name="profile_setup"
							readOnly
							checked={profileSetUp}
						/>
						<label
							htmlFor="profile_setup"
							className="cursor-pointer"
						>
							Set up your profile
						</label>
					</span>
				</Link>
				<Link route="chats">
					<span
						onClick={() => setChatChecked(true)}
						className={
							"flex items-center mb-2 text-gray-700 space-x-1 last:mb-0" +
							(chatChecked ? " line-through text-gray-400 " : "")
						}
					>
						<input
							type="checkbox"
							id="chat"
							name="chat"
							readOnly
							checked={chatChecked}
						/>
						<label htmlFor="chat" className="cursor-pointer">
							Join the chat
						</label>
					</span>
				</Link>
			</p>
		</div>
	);
}
