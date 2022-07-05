import React from "react";

function CardContent({ children, className = "" }) {
	return <div className={"p-4 " + className}>{children}</div>;
}

function Card({
	children,
	className = null,
	image = null,
	mb = true,
	floating = false,
	style = {},
}) {
	return (
		<div
			className={
				"Card bg-white dark:bg-dark-100 rounded-md " +
				(className ?? "") +
				(image ? " flex flex-col " : "") +
				(mb ? " mb-4 last:mb-0 " : "") +
				(floating ? " shadow " : " shadow-xs ")
			}
			style={style}
		>
			{image && (
				<div
					className="relative h-64 overflow-hidden border-r border-gray-200 rounded-t-md"
					style={{
						backgroundImage: `url(${image})`,
						backgroundPosition: "center",
						backgroundSize: "cover",
					}}
				></div>
			)}
			{image ? (
				<div className="flex items-center flex-1">{children}</div>
			) : (
				children
			)}
		</div>
	);
}

Card.Content = CardContent;

export default Card;
