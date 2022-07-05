import React, { useCallback, useState } from "react";
import { useRef, useEffect } from "react";
import { MobXProviderContext } from "mobx-react";
import { useDropzone } from "react-dropzone";
import { useCommonTags, useSuggestedTags } from "queries/tags";
import union from "lodash/union";
import uniqBy from "lodash/uniqBy";

export function useStores() {
	return React.useContext(MobXProviderContext);
}

export function useOutsideClick(ref, callback, tracking) {
	useEffect(() => {
		if (!tracking) return;

		const handleClick = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				callback();
			}
		};

		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, [callback, ref, tracking]);
}

export function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

export function useImageUpload() {
	const [attachmentState, setAttachmentState] = useState({
		attachment: null,
		name: null,
		preview: null,
	});

	const onDrop = useCallback((acceptedFiles) => {
		const reader = new FileReader();
		const attachment = acceptedFiles[0];

		reader.onloadend = () => {
			setAttachmentState({
				attachment,
				name: attachment.name,
				preview: reader.result,
			});
		};

		if (attachment) {
			reader.readAsDataURL(attachment);
		}
	}, []);

	const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
		onDrop,
		noClick: true,
		noKeyboard: true,
		accept: "image/jpeg, image/png",
	});

	return {
		getRootProps,
		getInputProps,
		open,
		isDragActive,
		attachmentState,
	};
}

export function useEventListener(eventName, handler, element = window) {
	// Create a ref that stores handler
	const savedHandler = useRef();

	// Update ref.current value if handler changes.
	// This allows our effect below to always get latest handler ...
	// ... without us needing to pass it in effect deps array ...
	// ... and potentially cause effect to re-run every render.
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(
		() => {
			// Make sure element supports addEventListener
			// On
			const isSupported = element && element.addEventListener;
			if (!isSupported) return;

			// Create event listener that calls handler function stored in ref
			const eventListener = (event) => savedHandler.current(event);

			// Add event listener
			element.addEventListener(eventName, eventListener);

			// Remove event listener on cleanup
			return () => {
				element.removeEventListener(eventName, eventListener);
			};
		},
		[eventName, element] // Re-run if eventName or element changes
	);
}

export function useDebounce(value, delay) {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);

			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout(handler);
			};
		},
		[value, delay] // Only re-call effect if value or delay changes
	);

	return debouncedValue;
}

export function useTagAutocomplete(type, initialTags = []) {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const [tags, setTags] = useState(initialTags);
	const { data: commonTags } = useCommonTags(type);
	const { data: suggestedTags } = useSuggestedTags(type, debouncedQuery);

	const onAddition = (tag) => {
		setTags([].concat(tags, tag));
	};

	const onDelete = (i) => {
		const newTags = tags.slice(0);
		newTags.splice(i, 1);
		setTags(newTags);
	};

	let suggestions = union(
		commonTags ? commonTags : [],
		suggestedTags ? suggestedTags : []
	);

	suggestions = suggestions.map((name, id) => ({ id, name }));

	return {
		suggestions,
		tags,
		onAddition,
		onDelete,
		onInput: (query) => setQuery(query),
	};
}

export function useSkillAutocomplete(type, initialTags = []) {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const [tags, setTags] = useState(initialTags);
	//const { data: commonTags } = useCommonTags(type);
	const { data: suggestedTags } = useSuggestedTags(type, debouncedQuery);

	const onAddition = (tag) => {
		setTags([].concat(tags, tag));
	};

	const onDelete = (i) => {
		const newTags = tags.filter((t) => t.id !== i);
		setTags(newTags);
	};

	let suggestions = uniqBy(suggestedTags ? suggestedTags : [], "id");

	return {
		suggestions,
		tags,
		onAddition,
		onDelete,
		onInput: (query) => setQuery(query),
	};
}
