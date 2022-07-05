import React from "react";
import { useThreadRepliers } from "queries/discussions";
import FaceStack from "components/ui/FaceStack";

function ThreadReplyFaces({ size = 4, thread }) {
	const { data } = useThreadRepliers(thread.slug, thread.reply_count > 0);
	if (!data) return null;
	return <FaceStack size={size} users={data.slice(0, 5)} />;
}

export default ThreadReplyFaces;
