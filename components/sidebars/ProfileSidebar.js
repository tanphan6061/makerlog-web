import Card from "components/ui/Card";
import React from "react";
import SidebarItem from "./SidebarItem";
import ProductMedia from "components/products/ProductMedia";
import orderBy from "lodash/orderBy";
import UserHeatmap from "components/stats/UserHeatmap";
import SocialsCard from "./SocialsCard";
import { useUserSkills } from "queries/tags";
import Spinner from "components/ui/Spinner";
import SkillList from "components/users/skills/SkillList";
import Skill from "components/users/skills/Skill";
import { useAuth } from "stores/AuthStore";
import { Link } from "routes";

function ProductsCard({ products }) {
	if (!products) return null;

	return (
		<SidebarItem title="Products made">
			<Card>
				<Card.Content>
					{orderBy(products, "created_at", "asc").map((product) => (
						<div className="mb-2 last:mb-0" key={product.slug}>
							<ProductMedia product={product} />
						</div>
					))}
					{products.length === 0 && (
						<div className="text-sm text-center text-gray-500">
							This maker has no products yet.
						</div>
					)}
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}

function HeatmapCard({ user }) {
	if (!user) return null;

	return (
		<SidebarItem title="Activity graph">
			<Card>
				<Card.Content>
					<UserHeatmap user={user} />
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}

function SkillsCard({ user }) {
	const { user: authedUser } = useAuth();
	const { data, isLoading, error } = useUserSkills(
		user ? user.username : null
	);
	if (!user || error) return null;

	return (
		<SidebarItem title="Skills">
			<Card>
				<Card.Content>
					{isLoading && <Spinner small text="Loading skills..." />}
					{data && data.length > 0 && (
						<SkillList>
							{data.map((skill) => (
								<Skill key={skill.id} skill={skill} readOnly />
							))}
						</SkillList>
					)}
					{data && data.length === 0 && (
						<p className="help">
							No skills yet.{" "}
							{user.id === authedUser.id && (
								<Link route="settings">
									<a>Add your skills &raquo;</a>
								</Link>
							)}{" "}
						</p>
					)}
				</Card.Content>
			</Card>
		</SidebarItem>
	);
}

export default function ProfileSidebar({
	user,
	products = null,
	left = false,
}) {
	// TODO: Implement feed filtering so the left sidebar is filter controls only.
	return (
		<div>
			{left && (
				<>
					<SocialsCard object={user} />
					<HeatmapCard user={user} />
					<SkillsCard user={user} />
				</>
			)}
			{!left && <ProductsCard products={products} />}
		</div>
	);
}
