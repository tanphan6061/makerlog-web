import React from "react";
import Modal from "components/ui/Modal";

function ActivityDebugger({ open, onClose, activity }) {
	return (
		<Modal open={open} onClose={onClose}>
			<strong>ID: {activity.getId()}</strong>
			<br />
			<strong>To: {JSON.stringify(activity.getTo())}</strong>
			<pre style={{ height: 500, overflowY: "auto" }}>
				{JSON.stringify(activity.getRawActivity(), null, "\t")}
			</pre>
		</Modal>
	);
}

export default ActivityDebugger;
