import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import Popover from "react-popover";

function HoverPopover({
	enterDelay,
	exitDelay,
	onMouseEnter,
	body,
	children,
	...props
}) {
	const [showPopover, setShowPopover] = useState(false);
	const childNode = useRef(null);
	let enterTimeoutConst = null;
	let exitTimeoutConst = null;

	useEffect(() => {
		return () => {
			if (enterTimeoutConst) {
				clearTimeout(enterTimeoutConst);
			}

			if (exitTimeoutConst) {
				clearTimeout(exitTimeoutConst);
			}
		};
	});

	const handleMouseEnter = () => {
		clearTimeout(exitTimeoutConst);
		enterTimeoutConst = setTimeout(() => {
			setShowPopover(true);
			onMouseEnter();
		}, enterDelay);
	};

	const handleMouseLeave = () => {
		clearTimeout(enterTimeoutConst);
		exitTimeoutConst = setTimeout(() => {
			setShowPopover(false);
			onMouseEnter();
		}, exitDelay);
	};

	const displayChild = React.Children.map(children, (child) =>
		React.cloneElement(child, {
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
			ref: (node) => {
				childNode.current = node;
				const { ref } = child;
				if (typeof ref === "function") {
					ref(node);
				}
			},
		})
	)[0];

	return (
		<Popover
			isOpen={showPopover}
			onMouseEnter={() => {
				setShowPopover(true);
			}}
			onMouseLeave={handleMouseLeave}
			id="popover"
			body={
				<div
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					{body}
				</div>
			}
			{...props}
		>
			{displayChild}
		</Popover>
	);
}

HoverPopover.defaultProps = {
	enterDelay: 300,
	exitDelay: 300,
	onMouseEnter: () => {},
};

export default HoverPopover;
