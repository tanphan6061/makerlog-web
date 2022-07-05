import Card from "components/ui/Card";
import React from "react";
import truncate from "lodash/truncate";
import { Link } from "routes";

export default function MilestoneMedia({ milestone }) {
	return (
		<Card>
			<Card.Content>
				<p className="heading">
					🏆 Milestone #{milestone.id}{" "}
					{milestone.product && `· ${milestone.product.name}`}
				</p>
				<Link route="milestone" params={{ slug: milestone.slug }}>
					<a>
						<h3 className="font-semibold text-gray-900">
							{milestone.title}
						</h3>
					</a>
				</Link>
				<p className="mb-2 text-gray-700">
					{truncate(milestone.body, { length: 144 })}
				</p>

				<Link route="milestone" params={{ slug: milestone.slug }}>
					<a className="text-sm">Read more</a>
				</Link>
			</Card.Content>
		</Card>
	);
}
