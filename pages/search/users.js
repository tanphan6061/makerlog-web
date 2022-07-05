import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSearchUsers } from "queries/search";
import { useDebounce } from "utils/hooks";
import Card from "components/ui/Card";
import NarrowLayout from "layouts/NarrowLayout";
import SidebarNav from "components/ui/SidebarNav";
import InfiniteSearch from "components/search/InfiniteSearch";
import UserMedia from "components/ui/UserMedia";
import { NextSeo } from "next-seo";

export default function SearchUsersPage() {
	const {
		query: { q },
	} = useRouter();
	const [query, setQuery] = useState(q ? q : "");
	const debouncedQuery = useDebounce(query, 300);
	const queryState = useSearchUsers(debouncedQuery);

	return (
		<NarrowLayout
			leftSidebar={
				<SidebarNav>
					<p className="heading">Search...</p>
					<SidebarNav.Link
						route="search-discussions"
						params={{ q: query }}
					>
						Discussions
					</SidebarNav.Link>
					<SidebarNav.Link
						route="search-products"
						params={{ q: query }}
					>
						Products
					</SidebarNav.Link>
					<SidebarNav.Link route="search-users" params={{ q: query }}>
						Makers
					</SidebarNav.Link>
					<SidebarNav.Link route="search-tasks" params={{ q: query }}>
						Tasks
					</SidebarNav.Link>
				</SidebarNav>
			}
		>
			<Card>
				<Card.Content>
					<input
						className="mb-4 last:mb-0"
						placeholder="Search users..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<InfiniteSearch
						queryState={queryState}
						renderData={(user) => {
							if (!user) return null;
							return <UserMedia user={user} />;
						}}
					/>
				</Card.Content>
			</Card>

			<NextSeo title="Search" />
		</NarrowLayout>
	);
}
