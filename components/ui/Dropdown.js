import React, { useState, useRef } from "react";
import { Transition } from "@tailwindui/react";
import { useOutsideClick } from "utils/hooks";

function DropdownItemIcon({ children }) {
	return (
		<span className="w-3 h-3 mr-3 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500">
			{children}
		</span>
	);
}

const DropdownItem = React.forwardRef(
	({ children, elem = "a", ...props }, ref) => {
		const Elem = elem;
		return (
			<Elem
				{...props}
				ref={ref}
				className="block text-sm text-gray-700 cursor-pointer px-3.5 py-1.5 leading-5 hover:bg-gray-100 dark:hover:bg-dark-200 focus:outline-none focus:bg-gray-100 dark:focus:bg-dark-200"
			>
				{children}
			</Elem>
		);
	}
);

DropdownItem.displayName = "DropdownItem";

function Dropdown({
	children,
	items,
	origin = "top-right",
	className = "",
	hover = false,
	left = false,
}) {
	const [open, setOpen] = useState(false);

	const dropdownRef = useRef();

	useOutsideClick(
		dropdownRef,
		() => {
			setOpen(!open);
		},
		open
	);

	return (
		<div
			className="relative"
			onClick={!hover ? () => setOpen(!open) : () => {}}
			onMouseEnter={hover ? () => setOpen(true) : () => {}}
			onMouseLeave={hover ? () => setOpen(false) : () => {}}
			ref={dropdownRef}
		>
			<div>{children}</div>

			<Transition
				show={open}
				enter="transition ease-out duration-75 transform"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="transition ease-in duration-75 transform"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				{(ref) => (
					<div
						ref={ref}
						className={
							`origin-${origin} absolute mt-2 w-56 rounded-md shadow-lg z-20 ` +
							(left ? " left-0 " : " right-0 ") +
							className
						}
					>
						<div className="bg-white rounded-md shadow-xs">
							<div
								className="py-1"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="options-menu"
							>
								{items}
							</div>
						</div>
					</div>
				)}
			</Transition>
		</div>
	);
}

Dropdown.Item = DropdownItem;
Dropdown.Item.Icon = DropdownItemIcon;

export default Dropdown;
