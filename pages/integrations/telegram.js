import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorMessageList from "components/error/ErrorMessageList";
import OutboundLink from "components/seo/OutboundLink";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import Message from "components/ui/Message";
import PageHeader from "components/ui/PageHeader";
import Spinner from "components/ui/Spinner";
import NarrowLayout from "layouts/NarrowLayout";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useLinkTelegram } from "queries/integrations";
import React, { useEffect } from "react";

function TelegramLinker({ queryState: { isLoading, error, isSuccess } }) {
	if (isLoading) return <Spinner text="Linking with Telegram..." />;
	if (error) return <ErrorMessageList error={error} />;
	if (isSuccess) return <Message success>All done.</Message>;

	return (
		<div>
			<div className="mb-2">
				<OutboundLink to={"http://telegram.me/MakerlogBot"}>
					<Button secondary>
						<Button.Icon>
							<FontAwesomeIcon icon={["fab", "telegram"]} />
						</Button.Icon>
						Add to Telegram
					</Button>
				</OutboundLink>
			</div>
			<div>
				<p className="help">
					You can also{" "}
					<OutboundLink to={"https://t.me/makerlog"}>
						join the Makerlog chat
					</OutboundLink>{" "}
					to interact with other makers.
				</p>
			</div>
		</div>
	);
}

export default function TelegramIntegrationPage() {
	const router = useRouter();
	const { mutate, ...queryState } = useLinkTelegram();
	const { key } = router.query;

	useEffect(() => {
		if (
			key &&
			!queryState.isSuccess &&
			!queryState.error &&
			!queryState.isLoading
		) {
			mutate({ key });
		}
	}, [key, mutate, queryState]);

	return (
		<NarrowLayout>
			<PageHeader>
				<div>
					<h2 className="font-bold">Telegram</h2>
					<p className="text-gray-700">
						Pair with Telegram and log from anywhere.
					</p>
				</div>
			</PageHeader>
			<Card>
				<Card.Content>
					<TelegramLinker queryState={queryState} />
				</Card.Content>
			</Card>

			<NextSeo title="Telegram" />
		</NarrowLayout>
	);
}
