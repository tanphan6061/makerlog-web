import ErrorMessageList from "components/error/ErrorMessageList";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import Form from "components/ui/Form";
import PageHeader from "components/ui/PageHeader";
import AvatarUpload from "components/users/AvatarUpload";
import ProfileHeader from "components/users/ProfileHeader";
import NarrowLayout from "layouts/NarrowLayout";
import React, { useState } from "react";
import { useAuth } from "stores/AuthStore";
import { requireAuth } from "utils/auth";
import { useImageUpload } from "utils/hooks";
import Message from "components/ui/Message";
import HeaderUpload from "components/users/HeaderUpload";
import { NextSeo } from "next-seo";
import { useSubData } from "queries/patron";
import Spinner from "components/ui/Spinner";
import { Link } from "routes";
import { useEffect } from "react";
import ChangeUsernameField from "components/auth/ChangeUsernameField";
import SkillSelector from "components/users/skills/SkillSelector";

function SettingsPage() {
	const { patching, patchUser, user, errorMessages } = useAuth();
	const [success, setSuccess] = useState(false);
	const {
		getInputProps: getAvatarInputProps,
		open: openAvatar,
		attachmentState: avatarState,
	} = useImageUpload();
	const {
		getInputProps: getHeaderInputProps,
		open: openHeader,
		attachmentState: headerState,
	} = useImageUpload();
	const [payload, setPayload] = useState({
		first_name: user.first_name ? user.first_name : "",
		last_name: user.last_name ? user.last_name : "",
		// email: user.email ? user.email : "",
		description: user.description ? user.description : "",
		website: user.website ? user.website : "",
		twitter_handle: user.twitter_handle ? user.twitter_handle : "",
		telegram_handle: user.telegram_handle ? user.telegram_handle : "",
		github_handle: user.github_handle ? user.github_handle : "",
		bmc_handle: user.bmc_handle ? user.bmc_handle : "",
		email_notifications:
			user.email_notifications !== null
				? user.email_notifications
				: false,
		digest: user.digest !== null ? user.digest : false,
		hardcore_mode: user.hardcore_mode !== null ? user.hardcore_mode : false,
		dark_mode: user.dark_mode !== null ? user.dark_mode : false,
		ads_enabled: user.ads_enabled !== null ? user.ads_enabled : true,
		timezone: user.timezone !== "" ? user.timezone : "",
	});
	const {
		isLoading: isLoadingSubData,
		data: subData,
		error: subDataError,
	} = useSubData();
	const [tzData, setTzData] = useState(null);

	async function onSubmit() {
		let finalPayload = { ...payload };
		if (avatarState.attachment)
			finalPayload.avatar = avatarState.attachment;
		if (headerState.attachment)
			finalPayload.header = headerState.attachment;
		await patchUser(finalPayload);
		setSuccess(true);
		setTimeout(() => setSuccess(false), 2000);
	}

	function onChangeField(key, value) {
		let newPayload = { ...payload };
		newPayload[key] = value;
		setPayload(newPayload);
	}

	function onUpdateSub() {
		// eslint-disable-next-line no-undef
		Paddle.Checkout.open({
			override: subData.update_url,
		});
	}

	function onCancelSub() {
		// eslint-disable-next-line no-undef
		Paddle.Checkout.open({
			override: subData.cancel_url,
		});
	}

	useEffect(() => {
		const getTzData = async () => {
			const { default: timezoneData } = await import(
				"compact-timezone-list"
			);
			setTzData(timezoneData);
		};
		getTzData();
	}, []);

	return (
		<NarrowLayout rightSidebar={null}>
			<PageHeader>
				<h2 className="mb-2 font-bold">Settings</h2>
			</PageHeader>
			<Card>
				<Card.Content>
					<Form onSubmit={onSubmit}>
						<Form.Group title="You">
							<Form.Field span={3} label="First name">
								<input
									onChange={(e) => {
										onChangeField(
											"first_name",
											e.target.value
										);
									}}
									value={payload.first_name}
								/>
							</Form.Field>
							<Form.Field span={3} label="Last name">
								<input
									onChange={(e) => {
										onChangeField(
											"last_name",
											e.target.value
										);
									}}
									value={payload.last_name}
								/>
							</Form.Field>
							<Form.Field span={3} label="Profile picture">
								<AvatarUpload
									user={user}
									getInputProps={getAvatarInputProps}
									open={openAvatar}
									attachmentState={avatarState}
								/>
							</Form.Field>
							<Form.Field label="Username" span={6}>
								<ChangeUsernameField />
							</Form.Field>
						</Form.Group>

						<Form.Group title="Profile">
							<Form.Field span={6} label="Tagline">
								<input
									onChange={(e) =>
										onChangeField(
											"description",
											e.target.value
										)
									}
									value={payload.description}
								/>
							</Form.Field>
							<Form.Field span={6} label="Website">
								<input
									onChange={(e) =>
										onChangeField("website", e.target.value)
									}
									value={payload.website}
								/>
							</Form.Field>
							<Form.Field span={6} label="Twitter handle">
								<input
									onChange={(e) =>
										onChangeField(
											"twitter_handle",
											e.target.value
										)
									}
									value={payload.twitter_handle}
								/>
							</Form.Field>
							<Form.Field span={6} label="Telegram handle">
								<input
									onChange={(e) =>
										onChangeField(
											"telegram_handle",
											e.target.value
										)
									}
									value={payload.telegram_handle}
								/>
							</Form.Field>
							<Form.Field span={6} label="GitHub handle">
								<input
									onChange={(e) =>
										onChangeField(
											"github_handle",
											e.target.value
										)
									}
									value={payload.github_handle}
								/>
							</Form.Field>
							<Form.Field span={6} label="Buy Me A Coffee handle">
								<input
									onChange={(e) =>
										onChangeField(
											"bmc_handle",
											e.target.value
										)
									}
									value={payload.bmc_handle}
								/>
							</Form.Field>
							<Form.Field span={6} label="Header image">
								<HeaderUpload
									getInputProps={getHeaderInputProps}
									open={openHeader}
									attachmentState={headerState}
								/>
							</Form.Field>
							<Form.Field span={6} label="Preview">
								<ProfileHeader halfWidth user={user} />
							</Form.Field>
						</Form.Group>

						<Form.Group title="Skills">
							<Form.Field span={6}>
								<SkillSelector />
							</Form.Field>
						</Form.Group>

						<Form.Group title="Notifications">
							<Form.Field span={6}>
								<div className="flex items-center">
									<input
										id="email_notifications"
										type="checkbox"
										className="form-checkbox"
										onChange={(e) =>
											onChangeField(
												"email_notifications",
												e.target.checked
											)
										}
										checked={payload.email_notifications}
									/>
									<label
										htmlFor="email_notifications"
										className="block ml-2 text-sm text-gray-900 leading-5"
									>
										Email notifications
									</label>
								</div>

								<p className="help">
									Get notifications when important things
									happen on-site, like comments or replies.
								</p>
							</Form.Field>
							<Form.Field span={6}>
								<div className="flex items-center">
									<input
										id="digest"
										type="checkbox"
										className="form-checkbox"
										onChange={(e) =>
											onChangeField(
												"digest",
												e.target.checked
											)
										}
										checked={payload.digest}
									/>
									<label
										htmlFor="digest"
										className="block ml-2 text-sm text-gray-900 leading-5"
									>
										Makerlog Weekly-ish
									</label>
								</div>

								<p className="help">
									The best founders and news in your inbox,
									weekly-ish.
								</p>
							</Form.Field>
						</Form.Group>

						<Form.Group title="Streaks">
							<Form.Field>
								<div className="flex items-center">
									<input
										id="hardcore_mode"
										type="checkbox"
										className="form-checkbox"
										onChange={(e) =>
											onChangeField(
												"hardcore_mode",
												!e.target.checked
											)
										}
										checked={!payload.hardcore_mode}
									/>
									<label
										htmlFor="hardcore_mode"
										className="block ml-2 text-sm text-gray-900 leading-5"
									>
										Rest days
									</label>
								</div>
								<p className="help">
									Accumulate rest days for your streak. (Might
									break your streak)
								</p>
							</Form.Field>

							<Form.Field span={6} label="Timezone">
								{tzData === null ? (
									<Spinner
										small
										text="Loading timezones..."
									/>
								) : (
									<select
										value={payload.timezone}
										className="w-full form-select"
										onChange={(e) => {
											onChangeField(
												"timezone",
												e.target.value
											);
										}}
									>
										<option value={""}>
											None (server time)
										</option>
										{tzData &&
											tzData.map((tz) => (
												<option
													value={tz.tzCode}
													key={tz.tzCode}
												>
													{tz.label}
												</option>
											))}
									</select>
								)}
								<p className="help">
									Setting your timezone helps us determine how
									to count your streak.
								</p>
							</Form.Field>
						</Form.Group>

						{user.gold || user.patron ? (
							<Form.Group title="Patron">
								<Form.Field>
									<div className="flex items-center">
										<input
											id="dark_mode"
											type="checkbox"
											className="form-checkbox"
											onChange={(e) =>
												onChangeField(
													"dark_mode",
													e.target.checked
												)
											}
											checked={payload.dark_mode}
										/>
										<label
											htmlFor="dark_mode"
											className="block ml-2 text-sm text-gray-900 leading-5"
										>
											Dark mode
										</label>
									</div>
									<p className="help">
										Join the dark side. We have cookies.
									</p>
								</Form.Field>
								<Form.Field>
									<div className="flex items-center">
										<input
											id="ads_enabled"
											type="checkbox"
											className="form-checkbox"
											onChange={(e) =>
												onChangeField(
													"ads_enabled",
													e.target.checked
												)
											}
											checked={payload.ads_enabled}
										/>
										<label
											htmlFor="ads_enabled"
											className="block ml-2 text-sm text-gray-900 leading-5"
										>
											Indie ads
										</label>
									</div>
									<p className="help">
										Enable high-quality ads by makers, for
										makers.
									</p>
								</Form.Field>
								<Form.Field
									span={6}
									label="Subscription settings"
								>
									<div className="flex flex-col">
										{isLoadingSubData && (
											<Spinner
												small
												text="Loading subscription data..."
											/>
										)}
										{subData && (
											<div className="flex space-x-2">
												<Button
													xs
													onClick={onUpdateSub}
												>
													Update payment details
												</Button>
												<Button
													xs
													danger
													onClick={onCancelSub}
												>
													Cancel subscription
												</Button>
											</div>
										)}
										{subDataError && (
											<ErrorMessageList
												error={subDataError}
											/>
										)}
									</div>

									<p className="help">
										Modify, pause, or cancel your
										subscription.
									</p>
								</Form.Field>
							</Form.Group>
						) : (
							<Form.Group title="Patron">
								<Form.Field span={6}>
									<Message info title="✨ Get Patron">
										Support the Makerlog community and get a
										kickass dark mode.
										<div className="mt-4">
											<Link route="patron">
												<Button xs>
													Become a patron
												</Button>
											</Link>
										</div>
									</Message>
								</Form.Field>
								<Form.Field>
									<div className="flex items-center">
										<input
											id="dark_mode"
											type="checkbox"
											className="form-checkbox"
											checked={false}
											disabled
										/>
										<label
											htmlFor="dark_mode"
											className="block ml-2 text-sm text-gray-900 leading-5"
										>
											Dark mode
										</label>
									</div>
									<p className="help">
										<Link route="patron">
											<a>Get Makerlog Patron</a>
										</Link>{" "}
										to enable dark mode.
									</p>
								</Form.Field>

								<Form.Field>
									<div className="flex items-center">
										<input
											id="ads_enabled"
											type="checkbox"
											className="form-checkbox"
											checked={false}
											disabled
										/>
										<label
											htmlFor="ads_enabled"
											className="block ml-2 text-sm text-gray-900 leading-5"
										>
											Indie ads
										</label>
									</div>
									<p className="help">
										<Link route="patron">
											<a>Get Makerlog Patron</a>
										</Link>{" "}
										to disable ads.
									</p>
								</Form.Field>
							</Form.Group>
						)}

						<Form.Group title="Account">
							<Form.Field label="Change password">
								<div className="flex items-center">
									<Link route="auth-change-password">
										<Button xs>Change your password</Button>
									</Link>
								</div>
								<p className="help">
									This also allows you to set a password if
									you logged in via socials.
								</p>
							</Form.Field>
							<Form.Field label="Delete account">
								<div className="flex items-center">
									<Link route="auth-delete-account">
										<Button xs danger>
											Delete your account
										</Button>
									</Link>
								</div>
								<p className="help">
									This is irreversible. Your data will be gone
									forever!
								</p>
							</Form.Field>
						</Form.Group>

						{errorMessages && (
							<ErrorMessageList error={errorMessages} />
						)}
						{success && <Message success>Saved.</Message>}

						<Form.Actions span={6}>
							<Button loading={patching} primary type="submit">
								Save
							</Button>
						</Form.Actions>
					</Form>
				</Card.Content>
			</Card>
			<NextSeo title="Settings" />
		</NarrowLayout>
	);
}

export default requireAuth(SettingsPage);
