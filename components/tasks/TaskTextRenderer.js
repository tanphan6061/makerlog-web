import React from "react";
import processString from "react-process-string";
import urlRegex from "url-regex";
import ProductTag from "components/products/ProductTag";
import { findProductInTaskSet } from "utils/tasks";
import mentionsRegex from "mentions-regex";
import hashtagRegex from "hashtag-regex";
import URLComponent from "components/renderers/URLComponent";
import MentionComponent from "components/renderers/MentionComponent";

const HashtagComponent = (key, result, task) => {
	const tag = result[0].replace("#", "");
	if (!task.product_set) return <span key={key}>#{tag}</span>;
	const product = findProductInTaskSet(task, tag);
	if (!product) return <span key={key}>#{tag}</span>;
	return <ProductTag product={product} tag={tag} key={key} />;
};

function TaskTextRenderer({ task }) {
	return processString([
		{
			regex: urlRegex(),
			fn: URLComponent,
		},
		{
			regex: hashtagRegex(),
			fn: (key, result) => HashtagComponent(key, result, task),
		},
		{
			regex: mentionsRegex(),
			fn: MentionComponent,
		},
	])(task.content);
}

export default TaskTextRenderer;
