import React from "react";
import TaskEditor from "./TaskEditor";

function Editor({ onFinish = () => {}, forceOpen = false }) {
	return <TaskEditor forceOpen={forceOpen} onFinish={onFinish} />;
}

export default Editor;
