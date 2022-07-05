import ActiveLink from "components/router/ActiveLink";
import React from "react";

export default function ProfileMenu({ user }) {
	return (
		<div className="flex flex-row flex-grow h-full max-w-full overflow-x-auto sm:flex-none">
			<ActiveLink
				route="profile"
				params={{ username: user.username }}
				activeClassName="text-green-500 border-b-2 border-green-500"
			>
				<a className="flex items-center justify-center flex-grow h-full px-6 py-4 pt-2 font-semibold text-center text-gray-500">
					Feed
				</a>
			</ActiveLink>
			<ActiveLink
				route="profile-products"
				params={{ username: user.username }}
				activeClassName="text-green-500 border-b-2 border-green-500"
			>
				<a className="flex items-center justify-center flex-grow h-full px-6 py-4 pt-2 font-semibold text-center text-gray-500">
					Products
				</a>
			</ActiveLink>
			<ActiveLink
				route="not-implemented"
				params={{ username: user.username }}
				activeClassName="text-green-500 border-b-2 border-green-500"
			>
				<a className="flex items-center justify-center flex-grow h-full px-6 py-4 pt-2 font-semibold text-center text-gray-500">
					Discussions
				</a>
			</ActiveLink>
		</div>
	);
}
