import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSearchDiscussions } from "queries/search";
import { useDebounce } from "utils/hooks";
import Card from "components/ui/Card";
import NarrowLayout from "layouts/NarrowLayout";
import SidebarNav from "components/ui/SidebarNav";
import InfiniteSearch from "components/search/InfiniteSearch";
import Thread from "components/discussions/Thread";
import { NextSeo } from "next-seo";

export default function SearchDiscussionsPage() {
	const {
		query: { q },
	} = useRouter();
	const [query, setQuery] = useState(q ? q : "");
	const debouncedQuery = useDebounce(query, 300);
	const queryState = useSearchDiscussions(debouncedQuery);

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
						placeholder="Search discussions..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<InfiniteSearch
						queryState={queryState}
						renderData={(thread) => {
							if (!thread) return null;
							return <Thread thread={thread} />;
						}}
					/>
				</Card.Content>
			</Card>

			<NextSeo title="Search" />
		</NarrowLayout>
	);
}
