import ErrorMessageList from "components/error/ErrorMessageList";
import Button from "components/ui/Button";
import Form from "components/ui/Form";
import MarkdownEnabled from "components/ui/MarkdownEnabled";
import Message from "components/ui/Message";
import dynamic from "next/dynamic";
import { useCreateEvent } from "queries/events";
import React, { useState, useCallback } from "react";

const DatePicker = dynamic(() => import("react-datepicker"));

export default function EventCreateForm() {
	const [payload, setPayload] = useState({
		title: "",
		description: "",
		details: "",
		starts_at: null,
		ends_at: null,
	});
	const { mutate, isLoading, error, isSuccess } = useCreateEvent();

	const onCreate = async () => {
		mutate({
			...payload,
			starts_at: payload.starts_at.toISOString(),
			ends_at: payload.ends_at.toISOString(),
		});
	};

	const onChangeField = useCallback(
		(key, value) => {
			let newPayload = { ...payload };
			newPayload[key] = value;
			setPayload(newPayload);
		},
		[payload, setPayload]
	);

	if (isSuccess) {
		return (
			<Message success>
				All done. We'll be reviewing it but it should be live now.
			</Message>
		);
	}

	return (
		<Form onSubmit={onCreate}>
			<Form.Group title="Basics">
				<Form.Field span={6} label="Name">
					<input
						onChange={(e) => {
							onChangeField("title", e.target.value);
						}}
						value={payload.title}
					/>
				</Form.Field>

				<Form.Field span={6} label="Summary">
					<input
						onChange={(e) => {
							onChangeField("description", e.target.value);
						}}
						value={payload.description}
					/>
				</Form.Field>

				<Form.Field span={6} label="Website">
					<input
						onChange={(e) => {
							onChangeField("website", e.target.value);
						}}
						value={payload.website}
					/>
				</Form.Field>

				<Form.Field span={6} label="Details">
					<textarea
						onChange={(e) => {
							onChangeField("details", e.target.value);
						}}
						value={payload.details}
					/>
					<MarkdownEnabled />
				</Form.Field>
			</Form.Group>
			<Form.Group title="Date of event">
				<Form.Field span={6} label="Starts at...">
					<DatePicker
						selected={payload.starts_at}
						onChange={(e) => onChangeField("starts_at", e)}
						showTimeSelect
						dateFormat="MMMM d, yyyy h:mm aa"
					/>
				</Form.Field>

				<Form.Field span={6} label="Ends at...">
					<DatePicker
						selected={payload.ends_at}
						onChange={(e) => onChangeField("ends_at", e)}
						showTimeSelect
						dateFormat="MMMM d, yyyy h:mm aa"
					/>
				</Form.Field>
			</Form.Group>
			<ErrorMessageList error={error} />
			<Form.Actions span={6}>
				<Button loading={isLoading} primary type="submit">
					Submit event
				</Button>
			</Form.Actions>
		</Form>
	);
}
