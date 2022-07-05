import React from "react";
import Container from "./Container";

export default function Hero({ children, className = "", style={} }) {
	return (
		<div
		style={style}
			className={
				"py-12 mb-4 bg-white border-b border-gray-200 last:mb-0 " +
				className
			}
		>
			<Container>{children}</Container>
		</div>
	);
}
