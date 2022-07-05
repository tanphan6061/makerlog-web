import Avatar from "components/ui/Avatar";
import React from "react";
import { Link } from "routes";
import TimeAgo from "react-timeago";
import truncate from "lodash/truncate";

export default function MilestoneLine({ milestone }) {
	return (
		<div className="flex mb-4 last:mb-0">
			<div className="flex-none mr-2">
				<Link
					route="profile"
					params={{ username: milestone.user.username }}
				>
					<a className="flex-shrink-0">
						<Avatar size={8} user={milestone.user} />
					</a>
				</Link>
			</div>
			<div>
				<Link route="milestone" params={{ slug: milestone.slug }}>
					<a className="text-gray-900 unstyled-a">
						<h5 className="text-sm font-semibold md:text-base">
							{milestone.title}
						</h5>
					</a>
				</Link>
				<p className="text-sm text-gray-700">
					{truncate(milestone.body, { length: 72 })}
				</p>
				<div className="flex items-center text-xs text-gray-500 space-x-2">
					<span>@{milestone.user.username}</span>
					<span>
						<TimeAgo date={milestone.created_at} />
					</span>
					<span>
						<Link
							route="milestone"
							params={{ slug: milestone.slug }}
						>
							<a>{milestone.comment_count} comments</a>
						</Link>
					</span>
				</div>
			</div>
		</div>
	);
}
