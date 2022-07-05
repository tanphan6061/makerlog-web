import axios, { axiosWrapper } from "./axios";

export async function createProject(name) {
	const response = await axiosWrapper(axios.post, `/projects/`, {
		name: name,
	});
	return response.data;
}

export const getOrCreateProject = async (text, projects) => {
	// Errors are handled upstream
	const tagText = text.replace("#", "").trim();
	if (tagText.length === 0) return [];
	// Find in redux projects.
	// If it does not exist, then create it.
	// Finally, return the fucken array.
	const found = projects.find(
		(p) => p.name.toLowerCase() === tagText.toLowerCase()
	);
	if (found) {
		return [found.id];
	} else {
		let newProject = await createProject(tagText.toLowerCase());
		return [newProject.id];
	}
};
