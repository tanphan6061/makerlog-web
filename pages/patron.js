import Button from "components/ui/Button";
import Container from "components/ui/Container";
import PatronBadge from "components/users/badges/PatronBadge";
import { NextSeo } from "next-seo";
import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Link, Router } from "routes";
import { useAuth } from "stores/AuthStore";
import { setDarkMode } from "utils/patron";

const PLANS = {
	5: 547895,
	10: 642032,
	20: 642033,
	50: 642034,
	100: 642035,
};

function PurchaseButtons({ purchased = false, onClickPurchase = () => {} }) {
	const { user } = useAuth();

	if (purchased) {
		return (
			<center>
				<strong className="block mb-2 text-sm text-green-800 dark:text-green-500">
					Thanks for purchasing Makerlog Patron.
				</strong>
				<Link route="settings">
					<Button secondary xs>
						Get your perks
					</Button>
				</Link>
			</center>
		);
	}

	if (user && user.patron) {
		return (
			<small>
				<strong>🎉 Hooray! You're a patron.</strong> <br />
				Check{" "}
				<Link route="settings">
					<a>Settings</a>
				</Link>{" "}
				to access your exclusive features.
			</small>
		);
	}

	return (
		<div className="flex flex-col justify-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
			<div className="hidden md:block">
				<Button onClick={() => onClickPurchase(PLANS["5"])}>
					$5/mo
				</Button>
			</div>
			<div className="hidden md:block">
				<Button onClick={() => onClickPurchase(PLANS["10"])}>
					$10/mo
				</Button>
			</div>
			<div>
				<Button secondary onClick={() => onClickPurchase(PLANS["20"])}>
					Support $20/mo
				</Button>
			</div>
			<div className="hidden md:block">
				<Button onClick={() => onClickPurchase(PLANS["50"])}>
					$50/mo
				</Button>
			</div>
			<div className="hidden md:block">
				<Button onClick={() => onClickPurchase(PLANS["100"])}>
					$100/mo
				</Button>
			</div>
			<div className="flex flex-col items-center space-y-2 md:hidden">
				<div className="flex items-center space-x-2">
					<Button onClick={() => onClickPurchase(PLANS["5"])}>
						$5/mo
					</Button>
					<Button onClick={() => onClickPurchase(PLANS["10"])}>
						$10/mo
					</Button>
				</div>
				<div className="flex items-center space-x-2">
					<Button onClick={() => onClickPurchase(PLANS["50"])}>
						$50/mo
					</Button>
					<Button onClick={() => onClickPurchase(PLANS["100"])}>
						$100/mo
					</Button>
				</div>
			</div>
		</div>
	);
}

function PatronPage() {
	const [purchased, setPurchased] = useState();
	const { isLoggedIn, user, patchUser } = useAuth();

	useEffect(() => {
		setDarkMode({}, true);
		return () => {
			setDarkMode({}, user ? user.dark_mode : false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onClickPurchase = useCallback(
		(product) => {
			if (!isLoggedIn) {
				Router.pushRoute("register");
			} else {
				// eslint-disable-next-line no-undef
				Paddle.Checkout.open({
					product: product,
					email: user && user.email ? user.email : null,
					successCallback: () => {
						setPurchased(true);
						// Don't reflect on server, as this is read-only.
						patchUser({ gold: true, purchased: true }, false);
					},
				});
			}
		},
		[isLoggedIn, user, patchUser]
	);

	return (
		<div>
			<div className="py-24 text-center bg-white border-b border-gray-200">
				<Container>
					<PatronBadge force sm />
					<h1>Become a Patron</h1>
					<p className="mb-4 text-gray-700">
						Support the maker movement and get exclusive perks.
					</p>
					<PurchaseButtons
						purchased={purchased}
						onClickPurchase={onClickPurchase}
					/>
				</Container>
			</div>
			<Container className="border-b border-gray-200">
				<div className="mt-4 text-center">
					<div className="py-8">
						<h1>Join the dark side.</h1>
						<p className="text-gray-700">
							Become a patron and experience a carefully-crafted
							dark mode.
						</p>
					</div>
					<img
						className="block md:hidden"
						src="/img/patron/darkness-mobile.png"
						alt=""
					/>
					<img
						className="hidden md:block"
						src="/img/patron/darkness.png"
						alt=""
					/>
				</div>
			</Container>
			<div className="bg-gray-100 dark:bg-dark-100">
				<Container className="py-12">
					<h3 className="mb-4 font-bold">
						There's a lot to love with Makerlog Patron.
					</h3>
					<div className="max-w-lg mx-auto grid gap-4 lg:grid-cols-3 lg:max-w-none">
						<div>
							<div className="flex">
								<p className="flex flex-col">
									<span className="font-medium">
										✨ Disable ads.
									</span>
									<span className="text-gray-700">
										Don't like Indie Ads? Disable them with
										Makerlog Patron.
									</span>
								</p>
							</div>
						</div>

						<div>
							<div className="flex">
								<p className="flex flex-col">
									<span className="font-medium">
										✅ Free ad space.
									</span>
									<span className="text-gray-700">
										Pleding $20/mo or more gets you a free
										large banner Makerlog Ad for a month. On
										us.
									</span>
								</p>
							</div>
						</div>

						<div>
							<div className="flex">
								<p className="flex flex-col">
									<span className="font-medium">
										💬 Exclusive chat.{" "}
										<small className="text-xs text-yellow-300 text-opacity-50">
											SOON!
										</small>
									</span>
									<span className="text-gray-700">
										Patron comes with access to an exclusive
										chat, chock-full of top-notch makers.
									</span>
								</p>
							</div>
						</div>
					</div>
				</Container>
			</div>
			<Container className="py-12">
				<center>
					<h3 className="mb-4 font-bold">
						What are you waiting for?
					</h3>
					<PurchaseButtons onClickPurchase={onClickPurchase} />
				</center>
			</Container>
			<NextSeo
				title="Become a Patron"
				description="Support the maker movement. Get Makerlog Patron, starting at $5/mo."
			/>
		</div>
	);
}

PatronPage.getInitialProps = async () => {
	return {
		layout: {
			contained: false,
		},
	};
};

export default PatronPage;
