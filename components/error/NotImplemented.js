import React from "react";
import { Link } from "routes";

function NotImplemented({ children }) {
	return <Link route="not-implemented">{children}</Link>;
}

export default NotImplemented;
