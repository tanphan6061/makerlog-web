import React from "react";
import Skill from "./Skill";
import SkillCreator from "./SkillCreator";
import SkillList from "./SkillList";
import {
	useCommonTags,
	useCreateSkill,
	useDeleteSkill,
	useUserSkills,
} from "queries/tags";
import { useAuth } from "stores/AuthStore";
import Spinner from "components/ui/Spinner";
import ErrorMessageList from "components/error/ErrorMessageList";

export default function SkillSelector() {
	const { user } = useAuth();
	const { data, isLoading, error } = useUserSkills(
		user ? user.username : null
	);
	const {
		data: commonSkills,
		isLoading: isLoadingCommonSkills,
		error: errorCommonSkills,
	} = useCommonTags("users");
	const { mutate: addSkill } = useCreateSkill(user ? user.username : null);
	const { mutate: deleteSkill } = useDeleteSkill(user ? user.username : null);

	const onAdd = (name, emoji) => {
		addSkill({ name, emoji, username: user.username });
	};

	const onDelete = (id) => {
		deleteSkill({ id, username: user.username });
	};

	if (isLoading) return <Spinner small text="Loading skills..." />;
	if (error) return <ErrorMessageList error={error} />;

	return (
		<div>
			<p className="heading">Your skills</p>
			<SkillList>
				{data.map((skill) => (
					<Skill
						selected
						skill={skill}
						key={skill.id}
						onClick={(skill) => onDelete(skill.id)}
					/>
				))}
				<SkillCreator />
			</SkillList>
			<p className="heading">Popular skills</p>
			<SkillList>
				{isLoadingCommonSkills && (
					<Spinner small text="Loading common skills..." />
				)}
				{commonSkills && commonSkills.length === 0 && (
					<p className="help">No popular skills.</p>
				)}
				{commonSkills &&
					commonSkills.map((skill) => (
						<Skill
							onClick={(skill) => onAdd(skill.name, skill.emoji)}
							key={skill.id}
							skill={skill}
						/>
					))}
				{errorCommonSkills && (
					<ErrorMessageList error={errorCommonSkills} />
				)}
			</SkillList>
		</div>
	);
}
