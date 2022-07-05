import { useDeleteProduct, useEditProduct } from "queries/products";
import React, { useState } from "react";
import ProductCard from "components/products/ProductCard";
import Button from "components/ui/Button";
import Form from "components/ui/Form";
import { useImageUpload, useTagAutocomplete } from "utils/hooks";
import ProductIconUpload from "../ProductIconUpload";
import { HexColorInput, HexColorPicker } from "react-colorful";
import ReactTags from "react-tag-autocomplete";
import { useProjects } from "queries/projects";
import Spinner from "components/ui/Spinner";
import ProductTeamSelector from "../ProductTeamSelector";
import { useCallback } from "react";
import { getOrCreateProject } from "utils/projects";
import ErrorMessageList from "components/error/ErrorMessageList";
import Message from "components/ui/Message";
import { isDev } from "config";
import { Router } from "routes";
import { useAuth } from "stores/AuthStore";
import { isProductTeam } from "utils/products";
import { StdErrorCollection } from "utils/error";

function ProductEditForm({ product }) {
	const { user } = useAuth();
	const [colorPickerOpen, setColorPickerOpen] = useState(false);
	const [payload, setPayload] = useState({
		name: product.name,
		description: product.description ? product.description : "",
		website: product.website ? product.website : "",
		twitter: product.twitter ? product.twitter : "",
		launched: product.launched,
		tags: product.tags,
		accent: product.accent,
	});
	const {
		getInputProps: getIconInputProps,
		open: openIcon,
		attachmentState: iconState,
	} = useImageUpload();
	const { mutate, isLoading, error, isSuccess } = useEditProduct();
	const {
		mutate: deleteMutation,
		isLoading: isDeleting,
		isSuccess: isDeleted,
	} = useDeleteProduct();
	const {
		suggestions,
		tags,
		onAddition,
		onDelete: onTagDelete,
	} = useTagAutocomplete(
		"products",
		product.tags.map((name, id) => ({ id, name }))
	);
	const { isLoading: isLoadingProjects, data: projectSet } = useProjects();
	const [tag, setTag] = useState(
		product.projects.length > 0 ? product.projects[0].name : ""
	);
	const [taggingError, setTaggingError] = useState(null);

	const onEdit = async () => {
		try {
			setTaggingError(null);
			let finalPayload = { ...payload };
			if (iconState.attachment) finalPayload.icon = iconState.attachment;
			// Set up projects array
			if (tag.length === 0) {
				throw new StdErrorCollection(
					"You must enter a hashtag to associate the product with."
				);
			}
			let projects = await getOrCreateProject(
				tag.replace("#", ""),
				projectSet
			);
			// Set up categories array
			let productTags = tags.map((t) => t.name);
			finalPayload = { ...finalPayload, projects, tags: productTags };
			mutate(
				{ payload: finalPayload, slug: product.slug },
				{
					onSuccess: (product) => {
						if (product)
							Router.pushRoute("product", { slug: product.slug });
					},
				}
			);
		} catch (e) {
			setTaggingError(e);
		}
	};

	const onDelete = async () => {
		deleteMutation(
			{ slug: product.slug },
			{
				onSuccess: () => {
					Router.pushRoute("products");
				},
			}
		);
	};

	const onChangeField = useCallback(
		(key, value) => {
			let newPayload = { ...payload };
			newPayload[key] = value;
			setPayload(newPayload);
		},
		[payload, setPayload]
	);

	const onChangeTeam = useCallback(
		(team) => {
			setPayload({ ...payload, team });
		},
		[payload]
	);

	if (isDeleted) {
		return (
			<Message success>
				Product {isProductTeam(product, user) ? "left" : "deleted"}.
				Taking you to products...
			</Message>
		);
	}

	if (isSuccess) {
		return (
			<Message success>All done. Taking you to the product...</Message>
		);
	}

	return (
		<Form onSubmit={onEdit}>
			<Form.Group title="Product">
				<Form.Field span={6} label="Name">
					<input
						onChange={(e) => {
							onChangeField("name", e.target.value);
						}}
						value={payload.name}
					/>
				</Form.Field>
				<Form.Field span={6} label="Tagline">
					<input
						onChange={(e) => {
							onChangeField("description", e.target.value);
						}}
						value={payload.description}
					/>
					<p className="help">Give it a short description.</p>
				</Form.Field>
				<Form.Field span={3} label="Website (optional)">
					<input
						onChange={(e) => {
							onChangeField("website", e.target.value);
						}}
						value={payload.website}
					/>
				</Form.Field>
				<Form.Field span={3} label="Twitter (optional)">
					<input
						onChange={(e) => {
							onChangeField("twitter", e.target.value);
						}}
						value={payload.twitter}
					/>
				</Form.Field>
				<Form.Field span={6} label="Categories">
					<ReactTags
						placeholderText="Add a product category..."
						allowNew
						tags={tags}
						suggestions={suggestions}
						onDelete={onTagDelete}
						onAddition={onAddition}
					/>
				</Form.Field>
				<div className="col-span-3">
					<Form.Field span={6} label="Icon">
						<ProductIconUpload
							getInputProps={getIconInputProps}
							open={openIcon}
							attachmentState={iconState}
						/>
					</Form.Field>
					<br />
					<Form.Field span={6} label="Accent color">
						{colorPickerOpen && (
							<div>
								<HexColorPicker
									color={payload.accent}
									onChange={(e) => {
										onChangeField("accent", e);
									}}
								/>
								<HexColorInput
									placeholder="Hex code"
									className="mt-2"
									color={payload.accent}
									onChange={(e) => {
										onChangeField("accent", e);
									}}
								/>
							</div>
						)}
						{!colorPickerOpen && (
							<Button sm onClick={() => setColorPickerOpen(true)}>
								Pick a color...
							</Button>
						)}
					</Form.Field>
				</div>
				<Form.Field span={3}>
					<ProductCard
						plain
						product={{
							...payload,
							name:
								payload.name.length > 0
									? payload.name
									: "Product Name",
							description: !payload.description
								? "A product description goes here."
								: payload.description,
							icon: iconState.preview
								? iconState.preview
								: product.icon
								? product.icon
								: null,
						}}
					/>
				</Form.Field>
				<Form.Field span={6} label="Launched yet?">
					<div className="flex items-center">
						<input
							id="launched"
							type="checkbox"
							className="form-checkbox"
							onChange={(e) =>
								onChangeField("launched", e.target.checked)
							}
							checked={payload.launched}
						/>
						<label
							htmlFor="launched"
							className="block ml-2 text-sm text-gray-900 leading-5"
						>
							Launched
						</label>
					</div>
				</Form.Field>
			</Form.Group>
			<Form.Group title="Makers">
				<Form.Field span={6} label="Hashtag">
					{isLoadingProjects ? (
						<Spinner small text="Loading your tags..." />
					) : (
						<input
							value={tag}
							onChange={(e) => setTag(e.target.value)}
							placeholder="#your-product-name"
						/>
					)}
					<p className="help">
						Tag your posts with #hashtags to add them to your
						product.
					</p>
				</Form.Field>
				{product.user === user.id && (
					<ProductTeamSelector
						onChange={onChangeTeam}
						initialTeam={product.team}
					/>
				)}
			</Form.Group>
			<Form.Group title="Danger zone">
				<Form.Field span={6}>
					<Button
						type="button"
						danger
						loading={isDeleting}
						onClick={onDelete}
					>
						{product.user === user.id ? "Delete" : "Leave"} product
					</Button>
					<p className="help">
						This is irreversible. Your tasks will be kept.
					</p>
				</Form.Field>
			</Form.Group>
			{isDev && (
				<pre className="block w-full break-all">
					{JSON.stringify(payload, null, 4)}
				</pre>
			)}
			{isSuccess ? (
				<Message success>
					All done. Taking you to the product page...
				</Message>
			) : null}
			<ErrorMessageList error={taggingError || error} />
			<Form.Actions span={6}>
				<Button loading={isLoading} primary type="submit">
					Save
				</Button>
			</Form.Actions>
		</Form>
	);
}

export default ProductEditForm;
