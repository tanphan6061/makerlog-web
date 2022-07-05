import { BaseStore, getOrCreateStore } from "next-mobx-wrapper";
import { action, observable } from "mobx";
import { useStores } from "utils/hooks";
import { useObserver } from "mobx-react";
import { getLogger } from "utils/logging";

const log = getLogger("root");

class RootStore extends BaseStore {
	@observable ready = false;
	@observable editorOpen = false;
	@observable editorDefaultTab = 0;
	@observable searchOpen = false;
	@observable feedbackOpen = false;

	@action.bound toggleEditor(defaultTab = 0) {
		// Reset defaultTab state if closing.
		if (this.editorOpen) {
			this.editorDefaultTab = 0;
		} else if (defaultTab === parseInt(defaultTab, 10)) {
			// Make sure we're getting an integer.
			this.editorDefaultTab = defaultTab;
		}
		log(
			`${!this.editorOpen ? "Opening" : "Editor"} editor. (defaultTab: ${
				this.editorDefaultTab
			})`
		);
		this.editorOpen = !this.editorOpen;
	}

	@action.bound toggleSearch() {
		this.searchOpen = !this.searchOpen;
	}

	@action.bound toggleFeedback() {
		this.feedbackOpen = !this.feedbackOpen;
	}

	@action.bound setReady(value) {
		this.ready = value;
	}
}

export const getRootStore = getOrCreateStore("root", RootStore);

export function useRoot() {
	const { root } = useStores();
	return useObserver(() => ({
		ready: root.ready,
		editorOpen: root.editorOpen,
		editorDefaultTab: root.editorDefaultTab,
		searchOpen: root.searchOpen,
		feedbackOpen: root.feedbackOpen,
		toggleEditor: root.toggleEditor,
		toggleSearch: root.toggleSearch,
		toggleFeedback: root.toggleFeedback,
	}));
}
