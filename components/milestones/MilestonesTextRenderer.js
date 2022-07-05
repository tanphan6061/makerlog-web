import URLComponent from "components/renderers/URLComponent";
import ReactMarkdown from "react-markdown";
import linkifyRegex from "remark-linkify-regex";
import mentionsRegex from "mentions-regex";
import MentionComponent from "components/renderers/MentionComponent";
import config from "config";
import EmbedTaskActivity from "components/tasks/EmbedTaskActivity";

function MilestonesTextRenderer({ milestone, className = "" }) {
	// Hack to preserve newlines.
	// https://github.com/remarkjs/react-markdown/issues/278
	// Begin splitting text for embeds.
	return (
		<ReactMarkdown
			className={"whitespace-pre-line " + className}
			linkTarget="_blank"
			renderers={{
				link: ({ href, ...props }) => {
					if (href.startsWith("@")) {
						// It's a mention
						return MentionComponent(href, [href]);
					} else {
						// aw. ful.
						const urlText = props.children[0]
							? props.children[0].props.value
							: href;
						if (
							href.startsWith(config.BASE_URL + "/tasks/") &&
							href === urlText
						) {
							// It's a task URL
							const idFragment = href.split(
								config.BASE_URL + "/tasks/"
							)[1];
							const id = idFragment.replace(/[^0-9]/g, "");
							return (
								<div className="prose-unprose">
									{EmbedTaskActivity({ id })}
								</div>
							);
						}
						return URLComponent(href, [href, urlText]);
					}
				},
			}}
			source={milestone.body}
			plugins={[linkifyRegex(mentionsRegex())]}
		/>
	);
}

export default MilestonesTextRenderer;
