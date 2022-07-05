import React from "react";
import { useState } from "react";
import { Lightbox } from "react-modal-image";
import { imageUrl } from "vendor/imagekit";

export default function TaskAttachments({ task }) {
	const [imageOpen, setImageOpen] = useState(false);
	if (!task || (!task.attachment && !task.video)) return null;
	const { attachment, video } = task;
	let elem = null;
	if (attachment && video) {
		elem = (
			<div>
				<video
					controls
					playsInline
					preload={"none"}
					poster={imageUrl(attachment)}
				>
					<source
						src={imageUrl(video, null, true) + "#t=0.5"}
						type="video/mp4"
					/>
					Sorry, your browser doesn't support embedded videos.
				</video>
			</div>
		);
	} else if (attachment) {
		elem = (
			<div className="flex h-32">
				<img
					onClick={() => setImageOpen(true)}
					className="object-cover cursor-pointer hover:ring-2 ring-green-500 rounded-md"
					src={imageUrl(attachment)}
					alt={"Attachment to task."}
				/>
				{imageOpen && (
					<Lightbox
						medium={imageUrl(attachment, null, true)}
						large={imageUrl(attachment, null, true)}
						alt={task.content}
						onClose={() => setImageOpen(false)}
					/>
				)}
			</div>
		);
	}

	return <div className="flex space-x-4 attachment">{elem}</div>;
}
