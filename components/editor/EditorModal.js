import React from "react";
import Modal from "components/ui/Modal";
import Editor from "./Editor";
import { useHotkeys } from "react-hotkeys-hook";

function EditorModal({ open, onClose, defaultTab = 0 }) {
	useHotkeys("command+b,ctrl+B", () => onClose());

	return (
		<Modal open={open} onClose={onClose}>
			<Editor defaultTab={defaultTab} onFinish={onClose} />
		</Modal>
	);
}

export default EditorModal;
