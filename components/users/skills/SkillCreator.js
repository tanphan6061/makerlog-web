import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/ui/Button";
import { useCreateSkill } from "queries/tags";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores/AuthStore";
import { useSkillAutocomplete } from "utils/hooks";
import Skill from "./Skill";
import SkillList from "./SkillList";
import { Picker } from "emoji-mart";

export default function SkillCreator() {
	const { user, isLoggedIn } = useAuth();
	const [open, setOpen] = useState(false);
	const [emoji, setEmoji] = useState("⚪️");
	const [openEmoji, setOpenEmoji] = useState(false);
	const [name, setName] = useState("");
	const { suggestions, onInput } = useSkillAutocomplete("users");
	// TODO: Error state.
	const { mutate, isLoading, isSuccess, data, reset } = useCreateSkill();

	useEffect(() => {
		if (isSuccess) {
			setOpen(false);
			setEmoji("⚪️");
			setName("");
			reset();
		}
	}, [isSuccess, data, reset]);

	if (!isLoggedIn) return null;

	const onEmojiClick = (emoji) => {
		setEmoji(emoji.native);
		setOpenEmoji(false);
	};

	const onSubmit = async (payload = null) => {
		if (!payload) {
			if (name.length === 0) return;
			payload = {
				name,
				emoji,
			};
		}
		payload = { ...payload, username: user.username };
		mutate(payload);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			onSubmit();
		}
	};

	if (open) {
		return (
			<span className="w-full bg-white border border-gray-300 outline-none appearance-none dark:bg-dark-100 px-2.5 py-1.5 rounded-md shadow-xs dark:border-dark-300 focus:ring-1 focus:ring-green-500">
				<div className="flex items-center space-x-2">
					<span
						onClick={() => {
							if (!openEmoji) setOpenEmoji(!openEmoji);
						}}
						className="relative flex items-center justify-center w-8 h-8 leading-none cursor-pointer rounded-md hover:bg-gray-200 transition-all"
					>
						{emoji}
						{openEmoji && (
							<span className="absolute left-0 top-10">
								<Picker onSelect={onEmojiClick} />
							</span>
						)}
					</span>{" "}
					<span className="flex-grow">
						<input
							onChange={(e) => {
								setName(e.target.value);
								onInput(e.target.value);
							}}
							value={name}
							className="unstyled-input"
							placeholder="e.g. knitting..."
							style={{ boxShadow: "none" }}
							onKeyDown={handleKeyDown}
						/>
					</span>
					<Button
						onClick={() => onSubmit()}
						loading={isLoading}
						disabled={name.length === 0}
						xs
						type="submit"
					>
						Add
					</Button>
				</div>
				<p className="mt-4 heading">Suggestions</p>
				<SkillList>
					{suggestions.length === 0 && (
						<p className="help">
							Start typing to see skill suggestions...
						</p>
					)}
					{suggestions.map((skill) => (
						<span
							key={skill.id}
							onClick={() => {
								onSubmit({
									name: skill.name,
									emoji: skill.emoji,
								});
							}}
						>
							<Skill skill={skill} />
						</span>
					))}
				</SkillList>
			</span>
		);
	}

	return (
		<span
			onClick={() => setOpen(true)}
			className="inline-flex items-center text-sm font-medium text-gray-800 bg-gray-100 dark:bg-dark-200 space-x-2 px-2.5 py-0.5 rounded-md"
		>
			<span>
				<FontAwesomeIcon icon="plus" />
			</span>
		</span>
	);
}
