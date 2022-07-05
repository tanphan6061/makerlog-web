import Container from "components/ui/Container";
import { NextSeo } from "next-seo";
import React from "react";
import AdPurchaseForm from "components/ads/AdPurchaseForm";

function BookAdPage() {
	return (
		<div>
			<div className="py-12 bg-white border-b border-gray-200">
				<Container>
					<h1>Book an advertisement</h1>
					<p className="mb-2 text-gray-700">
						Bring your brand to a targeted audience of over 7,000+
						dedicated makers, developers, and indie hackers.
					</p>
					<div className="mt-8">
						<p className="heading">
							Trusted by great brands (+ many more)
						</p>
						<div className="flex flex-col space-x-0 space-y-4 sm:space-x-4 sm:space-y-0 sm:flex-row">
							<div>
								<img
									className="h-8"
									src="/img/ads-pages/nomadlist.png"
								/>
							</div>
							<div>
								<img
									className="h-7"
									src="/img/ads-pages/remake.svg"
								/>
							</div>
							<div>
								<img
									className="h-7"
									src="/img/ads-pages/stencil.png"
								/>
							</div>
							<div>
								<img
									className="h-7"
									src="/img/ads-pages/headlime.png"
								/>
							</div>
						</div>
					</div>
				</Container>
			</div>
			<AdPurchaseForm />
			<NextSeo title="Book an ad" />
		</div>
	);
}

BookAdPage.getInitialProps = async () => {
	return {
		layout: {
			contained: false,
		},
	};
};

export default BookAdPage;
