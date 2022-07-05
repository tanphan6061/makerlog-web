import React from "react";
import { Link } from "routes";
import ThreadReplyFaces from "./ThreadReplyFaces";

export default function ThreadLine({ thread }) {
	return (
		<div className="flex mb-4 last:mb-0">
			<div>
				<Link route="discussions-thread" params={{ slug: thread.slug }}>
					<a className="text-gray-900 unstyled-a">
						<h5 className="text-sm font-semibold md:text-base">
							{thread.title}
						</h5>
					</a>
				</Link>
				<div className="flex items-center text-xs text-gray-500 space-x-2">
					<span>by @{thread.owner.username}</span>
					<span>
						<Link
							route="discussions-thread"
							params={{ slug: thread.slug }}
						>
							<a>{thread.reply_count} replies</a>
						</Link>
					</span>
					{thread.reply_count > 0 ? (
						<div className="flex-none">
							<ThreadReplyFaces size={4} thread={thread} />
						</div>
					) : (
						<span>✨ NEW</span>
					)}
				</div>
			</div>
		</div>
	);
}
