import ErrorMessageList from "components/error/ErrorMessageList";
import SidebarItem from "components/sidebars/SidebarItem";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import Container from "components/ui/Container";
import Form, { FormActions } from "components/ui/Form";
import ContentLayout from "layouts/ContentLayout";
import { useCreateBooking } from "queries/ads";
import React, { useState } from "react";
import { useAuth } from "stores/AuthStore";
import { getPlansForType, makeBookingMock } from "utils/ads";
import { useImageUpload } from "utils/hooks";
import Ad from "./Ad";
import AdImageUpload from "./AdImageUpload";

const exampleBooking = makeBookingMock(
	"ICON",
	"This is an example ad.",
	"/img/logo-icon.png",
	"https://getmakerlog.com"
);

function TierSelect({ type = "ICON", product = null, onSelect = () => {} }) {
	const plans = getPlansForType(type);
	if (!plans) return null;
	return (
		<div className="flex flex-col w-full space-y-4 sm:space-x-4 sm:space-y-0 sm:flex-row">
			{plans.map((p) => (
				<div
					key={p.id}
					className={`cursor-pointer border rounded-md p-4 text-gray-900 text-center flex-1 ${
						p.id === product
							? "border-2 border-green-500 bg-gray-50"
							: ""
					}`}
					onClick={() => onSelect(p.id)}
				>
					<a className="text-gray-900">{p.offering}</a>
				</div>
			))}
		</div>
	);
}

function AdKindSelect({ type = "ICON", onSelect = () => {} }) {
	return (
		<div className="flex flex-col w-full space-y-4 sm:space-x-4 sm:space-y-0 sm:flex-row">
			<div
				className={`cursor-pointer border rounded-md p-4 text-gray-900 text-center flex-1 ${
					type === "ICON"
						? "border-2 border-green-500 bg-gray-50"
						: ""
				}`}
				onClick={() => onSelect("ICON")}
			>
				<a className="text-gray-900">
					<strong>Square ad</strong> <br />
					<span className="text-gray-700">
						A 64x64 icon alongside text.
					</span>
				</a>
			</div>
			<div
				className={`cursor-pointer border rounded-md p-4 text-gray-900 text-center flex-1 ${
					type === "BANNER"
						? "border-2 border-green-500 bg-gray-50"
						: ""
				}`}
				onClick={() => onSelect("BANNER")}
			>
				<a className="text-gray-900">
					<strong>Banner ad</strong> <br />
					<span className="text-gray-700">
						A large 16:9 banner alongside text.
					</span>
				</a>
			</div>
		</div>
	);
}

function AdPurchaseForm() {
	// Multiple stages are involved, so we separate it from react-query state.
	const [purchased, setPurchased] = useState(false);
	const [purchasing, setPurchasing] = useState(false);
	const [product, setProduct] = useState(null);
	const [type, setType] = useState("ICON");
	const [text, setText] = useState("");
	const [url, setUrl] = useState("");
	const { getInputProps, open, attachmentState } = useImageUpload();
	const { mutateAsync, error, isLoading, reset } = useCreateBooking();
	const { user } = useAuth();

	const onClose = () => {
		setPurchasing(false);
		setPurchased(false);
	};

	const onPurchase = () => {
		setPurchasing(false);
		setPurchased(true);
		reset();
	};

	const onClickPurchase = async () => {
		if (!product) return;
		try {
			setPurchasing(true);
			const booking = await mutateAsync({
				text,
				image: attachmentState.attachment,
				url,
			});
			// eslint-disable-next-line no-undef
			Paddle.Checkout.open({
				product: product,
				email: user && user.email ? user.email : null,
				successCallback: onPurchase,
				closeCallback: onClose,
				// This is not an error...
				passthrough: JSON.stringify({
					booking_id: booking.id,
				}),
			});
		} catch (e) {
			setPurchasing(false);
		}
	};

	const canSubmit = () => {
		return (
			text.length > 0 &&
			attachmentState.attachment !== null &&
			url.length > 0 &&
			product !== null &&
			type !== "" &&
			text.length <= 144
		);
	};

	if (purchased) {
		return (
			<Container>
				<div className="mt-4">
					<h2>Your ad purchase has been completed.</h2>
					<p>
						Thanks for supporting the maker community. Please check
						your emails for a receipt. It will begin circulating
						shortly.
					</p>
				</div>
			</Container>
		);
	}

	return (
		<ContentLayout
			rightSidebar={
				<>
					<SidebarItem title="Your ad preview">
						<Card>
							<Card.Content>
								<Ad
									test={true}
									booking={makeBookingMock(
										type,
										text.length > 0
											? text
											: exampleBooking.text,
										attachmentState.preview
											? attachmentState.preview
											: type === "ICON"
											? exampleBooking.image
											: "/img/og/default.png",
										url ? url : exampleBooking.url
									)}
								/>
							</Card.Content>
						</Card>
					</SidebarItem>
					<SidebarItem title="What you can expect">
						<Card>
							<Card.Content>
								<ul className="text-sm text-gray-700 list-disc list-inside">
									<li>
										<strong>
											You will get around 1,000 - 3,000
											impressions per month.
										</strong>
									</li>
									<li>
										You will get less clicks than
										traditional advertising, but they will
										be higher-converting.
									</li>
									<li>
										Ad performance stats or changes to the
										booking are available on request.
									</li>
								</ul>
							</Card.Content>
						</Card>
						<small className="text-xs text-gray-700">
							Thanks for supporting an indie business! ❤️
						</small>
					</SidebarItem>
				</>
			}
		>
			<Card>
				<Card.Content>
					<Form
						onSubmit={() => {
							onClickPurchase();
						}}
					>
						<Form.Group
							title="Step 1: Pick a format"
							subtitle="We offer multiple advertisement formats to fit your brand and marketing goals."
						>
							<Form.Field span={12} label="Format">
								<AdKindSelect
									type={type}
									onSelect={(type) => {
										setType(type);
										setProduct(null);
									}}
								/>
							</Form.Field>
						</Form.Group>
						<Form.Group
							title="Step 2: Build your ad"
							subtitle="Type in text, add an image, and see the magic on the preview."
						>
							<Form.Field span={6} label="Ad text">
								<input
									value={text}
									onChange={(e) => {
										if (e.target.value.length > 144) return;
										setText(e.target.value);
									}}
								/>
								<p className="help">
									{text.length}/144 characters remaining
								</p>
							</Form.Field>
							<Form.Field span={6} label="Ad image">
								<AdImageUpload
									attachmentState={attachmentState}
									open={open}
									getInputProps={getInputProps}
								/>
							</Form.Field>
							<Form.Field span={6} label="Ad URL">
								<input
									placeholder="https://getmakerlog.com"
									value={url}
									onChange={(e) => {
										setUrl(e.target.value);
									}}
								/>
								<p className="help">
									Where should this ad go when clicked?
								</p>
							</Form.Field>
						</Form.Group>

						<Form.Group
							title="Step 3: Pick a timespan"
							subtitle="We offer flexible timespans to fit any budget."
						>
							<Form.Field label="Select a timespan..." span={12}>
								<TierSelect
									type={type}
									product={product}
									onSelect={(product) => setProduct(product)}
								/>
							</Form.Field>
						</Form.Group>
						<ErrorMessageList error={error} />
						<FormActions>
							<Button
								onClick={() => onClickPurchase()}
								primary
								loading={isLoading || purchasing}
								disabled={!canSubmit()}
							>
								Purchase ad
							</Button>
						</FormActions>
					</Form>
				</Card.Content>
			</Card>
		</ContentLayout>
	);
}

export default AdPurchaseForm;
