import React from "react";
import { useState } from "react";
import { onCmdEnter } from "utils/random";
import { useUpdateThread } from "queries/discussions";
import ErrorMessageList from "components/error/ErrorMessageList";
import MarkdownEnabled from "components/ui/MarkdownEnabled";
import Button from "components/ui/Button";

function ThreadEditForm({ thread, onFinish = () => {} }) {
	const [body, setBody] = useState(thread.body);
	const { mutate, isLoading, error } = useUpdateThread(thread.slug);

	const onSubmit = async () => {
		mutate(
			{ slug: thread.slug, body },
			{
				onSuccess: () => {
					if (onFinish) onFinish();
				},
			}
		);
	};

	return (
		<div>
			<textarea
				value={body}
				onChange={(e) => setBody(e.target.value)}
				onKeyDown={(e) => onCmdEnter(e, onSubmit)}
				rows={4}
				className="w-full h-32 mt-2"
				placeholder="Write away..."
			/>
			{error && (
				<div className="mt-2">
					<ErrorMessageList error={error} />
				</div>
			)}
			<div className="flex flex-row w-full mt-4">
				<div className="flex-none">
					<MarkdownEnabled />
				</div>
				<div className="flex-grow"></div>
				<div className="flex-none">
					<Button primary sm loading={isLoading} onClick={onSubmit}>
						Update
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ThreadEditForm;
