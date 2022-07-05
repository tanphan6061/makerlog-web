import MilestoneLine from "components/milestones/MilestoneLine";
import Card from "components/ui/Card";
import React from "react";

export default function LatestMilestones({ frontpage }) {
	if (!(frontpage && frontpage.milestones && frontpage.milestones.length > 0))
		return null;

	return (
		<div className="mb-4">
			<h3 className="mb-2 font-semibold">Latest milestone</h3>
			<Card>
				<Card.Content>
					{frontpage.milestones.slice(0, 1).map((milestone) => (
						<MilestoneLine
							milestone={milestone}
							key={milestone.slug}
						/>
					))}
				</Card.Content>
			</Card>
		</div>
	);
}
