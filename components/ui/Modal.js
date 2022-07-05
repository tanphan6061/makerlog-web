import React from "react";
import { Modal as ReactModal } from "react-responsive-modal";

function ModalHeader({ title }) {
	return (
		<div className="flex flex-row mb-4">
			<div className="flex-none">
				<h4 className="font-semibold text-gray-700">{title}</h4>
			</div>
			<div className="flex-grow"></div>
			<div className="flex-none"></div>
		</div>
	);
}

function ModalFooter({ children }) {
	return (
		<div className="flex flex-row mt-4">
			<div className="flex-grow"></div>
			<div className="flex flex-row flex-none">{children}</div>
		</div>
	);
}

function Modal({ open, center = true, children, onClose, className = "" }) {
	return (
		<ReactModal
			classNames={{
				modal:
					"bg-white dark:bg-dark-100 rounded-md px-4 py-4 text-left overflow-hidden sm:my-8 sm:align-middle sm:max-w-sm mx-0 sm:mx-auto sm:w-full " +
					className,
			}}
			animationDuration={150}
			open={open}
			onClose={onClose}
			center={center}
			showCloseIcon={false}
		>
			{children}
		</ReactModal>
	);
}

Modal.Header = ModalHeader;
Modal.Footer = ModalFooter;

export default Modal;
