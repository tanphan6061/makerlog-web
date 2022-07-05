import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorMessageList from "components/error/ErrorMessageList";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import Form from "components/ui/Form";
import Spinner from "components/ui/Spinner";
import { useCreateReminder } from "queries/reminders";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores/AuthStore";
import Confetti from "react-dom-confetti";
import useLocalStorage from "react-use/lib/useLocalStorage";
import { trackEvent } from "vendor/segment";

function SubmitStep({ error, isSuccess, setOpen = () => {} }) {
	if (error) {
		return <ErrorMessageList error={error} />;
	}

	return (
		<div className="flex flex-col items-center py-6">
			{!isSuccess ? (
				<span className="mx-auto">
					<Spinner small text="Setting reminder..." />
				</span>
			) : (
				<span className="flex flex-col mx-auto text-center text-green-500">
					<span>
						<FontAwesomeIcon icon="check-circle" />{" "}
						<span className="font-semibold">All set.</span>
					</span>
					<Button
						secondary
						className="mt-2"
						onClick={() => setOpen(false)}
					>
						Close
					</Button>
				</span>
			)}
			<Confetti active={isSuccess} />
		</div>
	);
}
function TwitterStep({ next }) {
	const { user, patching, errorMessages, patchUser } = useAuth();
	const [handle, setHandle] = useState(
		user.twitter_handle ? user.twitter_handle : ""
	);

	let timezone = user.timzone ? user.timezone : null;

	if (Intl) {
		timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	return (
		<>
			<h3 className="font-bold text-gray-900">Set up reminders</h3>
			<p className="mb-4 text-gray-700">
				We need your Twitter username to know where to send them!
			</p>
			{errorMessages && <ErrorMessageList error={errorMessages} />}
			<Form
				onSubmit={() => {
					patchUser(
						{ twitter_handle: handle, timezone },
						true,
						() => {
							next(2);
						}
					);
				}}
			>
				<div className="flex space-x-2">
					<input
						value={handle}
						onChange={(e) => setHandle(e.target.value)}
						className="max-w-xs"
						placeholder="e.g. getmakerlog"
					/>
					<Button
						loading={patching}
						type="submit"
						disabled={handle.length === 0}
						secondary
						style={{ height: 38 }}
					>
						Next
					</Button>
				</div>
			</Form>
		</>
	);
}

function TimeStep({ payload, next, setPayload = () => {} }) {
	return (
		<>
			<h3 className="font-bold text-gray-900">Set up reminders</h3>
			<p className="mb-4 text-gray-700">
				Finally, what time do you wish to be reminded?
			</p>
			<div className="flex space-x-2">
				<input
					value={payload.time}
					onChange={(e) => setPayload({ time: e.target.value })}
					type="time"
					className="max-w-xs"
				/>
				<Button
					onClick={next}
					disabled={payload.time.length === 0}
					type="submit"
					secondary
					style={{ height: 38 }}
				>
					Finish
				</Button>
			</div>
		</>
	);
}

/*function FrequencyStep({ next }) {
	return (
		<>
			<h3 className="font-bold text-gray-900">
				Where do you want to be reminded?
			</h3>
			<p className="mb-4 text-gray-700">
				I can send you notifications via Twitter, Slack, or Telegram.
			</p>
			<div className="flex space-x-2">
				<div>
					<Button secondary onClick={() => next("twitter")}>
						<FontAwesomeIcon icon={["fab", "twitter"]} />
						&nbsp; Twitter
					</Button>
				</div>
				<div>
					<Button>
						<FontAwesomeIcon icon={["fab", "telegram"]} />
						&nbsp; Telegram
					</Button>
				</div>
				<div>
					<Button>
						<FontAwesomeIcon icon={["fab", "slack"]} />
						&nbsp; Slack
					</Button>
				</div>
			</div>
		</>
	);
}*/

function OnboardingStep({ next, setOpen = () => {}, force = false }) {
	return (
		<>
			<h3 className="font-bold text-gray-900">Set up reminders</h3>
			<p className="mb-4 text-gray-700">
				Commit to creating daily. We'll send you a tweet to make sure
				you don't miss a day.
			</p>
			<div className="flex">
				<div className="mr-2">
					<Button primary onClick={next}>
						<FontAwesomeIcon icon={["fab", "twitter"]} />
						&nbsp;Get started
					</Button>
				</div>
				{!force && (
					<div>
						<Button
							onClick={() => {
								setOpen(false);
							}}
						>
							Later
						</Button>
					</div>
				)}
			</div>
		</>
	);
}

export default function RemindersCard({ onCreated = null, force = false }) {
	const [open, setOpen] = useLocalStorage(
		"reminders__reminderscard__open",
		true
	);
	const { mutate, error, isLoading, reset, isSuccess } = useCreateReminder();
	const [payload, setPayload] = useState({
		type: "twitter",
		frequency: "daily",
		time: "18:00",
	});
	const [step, setStep] = useState(0);

	const onFinish = async () => {
		mutate(payload, {
			onSuccess: () => {
				if (onCreated) onCreated();
			},
		});
	};

	useEffect(() => {
		trackEvent("Reminders Card Opened");
	}, []);

	if (!open && !force) return null;

	return (
		<Card>
			<Card.Content>
				{step === 0 && (
					<OnboardingStep
						force={force}
						next={() => setStep(1)}
						setOpen={setOpen}
					/>
				)}
				{step === 1 && (
					<TwitterStep
						next={(n) => {
							setStep(n);
						}}
					/>
				)}
				{step === 2 && (
					<TimeStep
						payload={payload}
						next={() => {
							onFinish();
							setStep(3);
							trackEvent("Reminders Card Succeeded");
						}}
						setPayload={(delta) => {
							setPayload({ ...payload, ...delta });
						}}
					/>
				)}
				{step === 3 && (
					<SubmitStep
						error={error}
						loading={isLoading}
						reset={reset}
						isSuccess={isSuccess}
						setOpen={setOpen}
					/>
				)}
			</Card.Content>
		</Card>
	);
}
