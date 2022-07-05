import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OutboundLink from "components/seo/OutboundLink";
import { isDev } from "config";
import React from "react";

export default function AdminBar() {
	return (
		<div
			className={
				"flex px-4 overflow-x-auto text-xs bg-white space-x-4 " +
				(isDev
					? "border-t-2 border-yellow-300"
					: "border-t-2 border-green-500")
			}
		>
			<div className="py-1">
				{isDev ? (
					<span className="font-bold text-yellow-300">
						<FontAwesomeIcon icon="check-circle" /> Local
					</span>
				) : (
					<span className="font-bold text-green-500">
						<FontAwesomeIcon icon="check-circle" /> Production
					</span>
				)}
			</div>
			<div className="flex py-1 pr-4 border-r space-x-4">
				<div>
					<OutboundLink to="https://api.getmakerlog.com/admin">
						Admin
					</OutboundLink>
				</div>
				<div>
					<OutboundLink to="https://data.mattei.dev/dashboard/9">
						KPIs
					</OutboundLink>
				</div>
			</div>
			<div className="flex-grow"></div>
			<span className="py-1 italic text-gray-400">Excelsior</span>
		</div>
	);
}
