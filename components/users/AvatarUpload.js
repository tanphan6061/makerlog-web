import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/ui/Button";
import React from "react";

export default function AvatarUpload({
	user,
	attachmentState = {},
	open,
	getInputProps = () => ({}),
}) {
	return (
		<div className="flex items-center">
			<div className="flex-none mr-2">
				<img
					className={`h-8 w-8 rounded-full`}
					src={
						attachmentState.preview
							? attachmentState.preview
							: user.avatar
					}
				/>
			</div>
			<div>
				<input {...getInputProps()}></input>
				<Button sm onClick={open}>
					<Button.Icon>
						<FontAwesomeIcon icon="camera" />
					</Button.Icon>
					{attachmentState.name ? attachmentState.name : "Upload"}
				</Button>
			</div>
		</div>
	);
}
