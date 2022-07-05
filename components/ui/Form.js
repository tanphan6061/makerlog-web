import React from "react";

// eslint-disable-next-line no-unused-vars
const classNames =
	"sm:col-span-3 sm:col-span-6 sm:col-span-12 col-span-12 col-span-3 col-span-6";

export function FormActions({
	children,
	span = null,
	justifyEnd = true,
	className = "",
}) {
	return (
		<div
			className={
				"mt-4 border-t border-gray-200 pt-4 " +
				(span ? ` col-span-12 sm:col-span-${span} ` : ``) +
				className
			}
		>
			<div className={`flex ${justifyEnd ? "justify-end" : ""}`}>
				{children}
			</div>
		</div>
	);
}

export function FormField({
	children,
	span = 4,
	name = "",
	label = "",
	help = null,
	error = null,
	className = "",
}) {
	return (
		<div className={`col-span-12 sm:col-span-${span} ` + className}>
			{label ? (
				<label
					htmlFor={name}
					className="block text-sm font-medium text-gray-700 leading-5"
				>
					{label}
				</label>
			) : null}
			<div className="w-full mt-1">{children}</div>
			{help || error ? (
				<p
					className={`mt-2 text-sm text-${
						error ? "red" : "gray"
					}-500`}
				>
					{error || help}
				</p>
			) : null}
		</div>
	);
}

export function FormControls({ children, className = "" }) {
	return (
		<div
			className={
				"grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 " + className
			}
		>
			{children}
		</div>
	);
}

export function FormGroup({
	children,
	title,
	subtitle = null,
	className = "",
}) {
	return (
		<>
			{title && <strong>{title}</strong>}
			{subtitle && (
				<p className="mb-1 text-sm text-gray-700">{subtitle}</p>
			)}
			<FormControls
				className={
					"p-2 mb-4 border-l border-gray-200 last:mb-0 " + className
				}
			>
				{children}
			</FormControls>
		</>
	);
}

function Form({ onSubmit = null, stopPropagation = true, children, ...props }) {
	return (
		<form
			className={props.className}
			action="#"
			onSubmit={(e) => {
				if (!onSubmit) return null;
				if (stopPropagation) {
					e.preventDefault();
					e.stopPropagation();
				}
				onSubmit(e);
			}}
		>
			{children}
		</form>
	);
}

Form.Controls = FormControls;
Form.Actions = FormActions;
Form.Field = FormField;
Form.Group = FormGroup;

export default Form;
