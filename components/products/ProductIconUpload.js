import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/ui/Button";
import React from "react";

export default function ProductIconUpload({
	attachmentState = {},
	open,
	getInputProps = () => ({}),
}) {
	return (
		<div className="flex items-center">
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
