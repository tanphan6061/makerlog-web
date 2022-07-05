import Button from "components/ui/Button";
import Message from "components/ui/Message";
import { useSubscribe } from "queries/stories";
import React, { useState } from "react";

export default function SubscribeCard() {
	const { mutate, isLoading, error, isSuccess } = useSubscribe();
	const [value, setValue] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();
		mutate(value);
	};

	return (
		<div className="flex flex-col items-center py-12">
			<h2 className="font-bold">💌 Subscribe to Makerlog Stories</h2>
			<p className="mt-2 mb-6 text-gray-700">
				Get the freshest founder interviews & maker content, right in
				your inbox.
			</p>
			<div className="w-full max-w-md">
				{isSuccess ? (
					<Message success>Subscribed.</Message>
				) : error ? (
					<Message error>Oops, something went wrong.</Message>
				) : (
					<form onSubmit={onSubmit} className="flex space-x-2">
						<input
							placeholder="Email"
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
						<Button loading={isLoading}>Subscribe</Button>
					</form>
				)}
			</div>
		</div>
	);
}
