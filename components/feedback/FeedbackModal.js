import React, { useEffect } from "react";
import Modal from "components/ui/Modal";
import Form from "components/ui/Form";
import ErrorMessageList from "components/error/ErrorMessageList";
import { useSendFeedback } from "queries/feedback";
import Button from "components/ui/Button";
import { useState } from "react";
import { useAuth } from "stores/AuthStore";
import Message from "components/ui/Message";

export default function FeedbackModal({ open, onClose }) {
	const [body, setBody] = useState("");
	const { mutate, isLoading, error, isSuccess, reset } = useSendFeedback();
	const { user } = useAuth();

	useEffect(() => {
		reset();
		setBody("");
	}, [open, reset]);

	const onSubmit = async () => {
		await mutate({ body, email: user && user.email ? user.email : null });
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Modal.Header title="Send feedback 📬" />
			<p className="mb-4 text-sm text-gray-700">
				We appreciate your feedback! Support requests, honest thoughts,
				all welcome.
			</p>
			{isSuccess ? (
				<div>
					<Message success>Thank you! 💌</Message>
					<div className="flex mt-4">
						<div className="flex-grow"></div>
						<div className="flex-initial">
							<Button onClick={onClose}>Close</Button>
						</div>
					</div>
				</div>
			) : (
				<Form onSubmit={onSubmit}>
					{error && <ErrorMessageList error={error} />}
					<Form.Controls>
						<Form.Field span={12}>
							<textarea
								value={body}
								onChange={(e) => setBody(e.target.value)}
								placeholder="Say something..."
								rows={8}
							/>
						</Form.Field>
					</Form.Controls>
					<Form.Actions>
						<Button
							onClick={onSubmit}
							primary
							loading={isLoading}
							disabled={body.length === 0}
						>
							Send
						</Button>
					</Form.Actions>
				</Form>
			)}
		</Modal>
	);
}
