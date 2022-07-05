import React from "react";
import Avatar from "./Avatar";

function FaceStack({ users = [], size = 10, limit = null }) {
	if (limit !== null) {
		users = users.slice(0, limit);
	}
	return (
		<div className="relative z-0 flex overflow-hidden">
			{users.map((u, idx) => (
				<Avatar
					size={size}
					className={
						"relative z-30 inline-block text-white shadow-solid " +
						(idx !== 0 ? "-ml-1" : "")
					}
					key={u.id}
					user={u}
				/>
			))}
		</div>
	);
}

export default FaceStack;
