import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PraiseButton from "components/praise/PraiseButton";
import Button from "components/ui/Button";
import Dropdown from "components/ui/Dropdown";
import { isServer } from "config";
import { useEffect, useState } from "react";
import { useAuth } from "stores/AuthStore";
import { getTwitterShareUrl } from "utils/milestones";
import { buildAbsoluteUrl } from "utils/random";
import MilestoneComments from "./MilestoneComments";
import copy from "clipboard-copy";
import { useDeleteMilestone, useUpdateMilestone } from "queries/milestones";
import { getLogger } from "utils/logging";
import Modal from "components/ui/Modal";
import Form from "components/ui/Form";
import ErrorMessageList from "components/error/ErrorMessageList";
import { usePrevious } from "utils/hooks";
import ProductSelector from "components/products/ProductSelector";
import TextareaAutosize from "react-autosize-textarea";

const log = getLogger("MilestoneActions");

function MilestonePermalinkAction({ milestone }) {
	const [copied, setCopied] = useState(false);

	return (
		<Dropdown.Item
			onClick={() => {
				if (isServer) return;
				copy(buildAbsoluteUrl(`/milestones/${milestone.slug}`));
				setCopied(true);
				setInterval(() => setCopied(false), 1000);
			}}
		>
			<Dropdown.Item.Icon>
				<FontAwesomeIcon icon="link" />
			</Dropdown.Item.Icon>
			{copied ? "Copied!" : "Permalink"}
		</Dropdown.Item>
	);
}

function MilestoneEditModal({ milestone, open, onClose }) {
	const {
		mutate: updateMutation,
		isLoading,
		error,
		isSuccess,
	} = useUpdateMilestone(milestone);
	const [title, setTitle] = useState(milestone.title);
	const [body, setBody] = useState(milestone.body);
	const [product, setProduct] = useState(
		milestone.product ? milestone.product.slug : null
	);
	const previousIsSuccess = usePrevious(isSuccess);

	useEffect(() => {
		if (!previousIsSuccess && isSuccess) onClose();
	}, [previousIsSuccess, isSuccess, onClose]);

	const onSubmit = async () => {
		updateMutation({
			slug: milestone.slug,
			title,
			body,
			product,
		});
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Modal.Header title="Edit milestone" />
			<Form onSubmit={onSubmit}>
				<Form.Controls>
					<Form.Field span={6} label="Title">
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Achieved something awesome"
						></input>
					</Form.Field>
					<Form.Field span={6} label="Body">
						<TextareaAutosize
							value={body}
							onChange={(e) => setBody(e.target.value)}
							placeholder="Write away..."
						/>
					</Form.Field>
					<Form.Field span={6} label="Product">
						<ProductSelector
							value={product}
							onChange={(slug) => setProduct(slug)}
						/>
					</Form.Field>
				</Form.Controls>

				{error && (
					<div className="mt-4">
						<ErrorMessageList error={error} />
					</div>
				)}

				<Form.Actions span={4}>
					<div className="ml-2">
						<Button onClick={onClose}>Cancel</Button>
					</div>
					<div className="ml-2">
						<Button primary loading={isLoading} type="submit">
							Submit
						</Button>
					</div>
				</Form.Actions>
			</Form>
		</Modal>
	);
}

function MilestoneDeleteAction({ milestone, onDelete }) {
	const { isLoggedIn, user } = useAuth();

	if (!isLoggedIn || user.id !== milestone.user.id) return null;

	return (
		<Dropdown.Item onClick={onDelete}>
			<Dropdown.Item.Icon>
				<FontAwesomeIcon icon="trash" />
			</Dropdown.Item.Icon>
			Delete
		</Dropdown.Item>
	);
}

function MilestoneMoreDropdown({ milestone, onDelete, onUpdate }) {
	const { isLoggedIn, user } = useAuth();
	const [editing, setEditing] = useState(false);

	return (
		<>
			{isLoggedIn && user.id === milestone.user.id && (
				<MilestoneEditModal
					milestone={milestone}
					open={editing}
					onUpdate={onUpdate}
					onClose={() => setEditing(!editing)}
				/>
			)}
			<Dropdown
				items={
					<>
						<MilestonePermalinkAction milestone={milestone} />

						<Dropdown.Item
							href={getTwitterShareUrl(milestone)}
							target="_blank"
						>
							<Dropdown.Item.Icon>
								<FontAwesomeIcon icon={["fab", "twitter"]} />
							</Dropdown.Item.Icon>
							Tweet
						</Dropdown.Item>
						{isLoggedIn && user.id === milestone.user.id && (
							<div className="mt-2 mb-2 border-b border-gray-200"></div>
						)}
						{isLoggedIn && user.id === milestone.user.id && (
							<Dropdown.Item onClick={() => setEditing(true)}>
								<Dropdown.Item.Icon>
									<FontAwesomeIcon icon="edit" />
								</Dropdown.Item.Icon>
								Edit
							</Dropdown.Item>
						)}
						<MilestoneDeleteAction
							milestone={milestone}
							onDelete={onDelete}
						/>
					</>
				}
			>
				<Button xs>
					<Button.Icon>
						<FontAwesomeIcon icon="ellipsis-v" />
					</Button.Icon>
					More
					<Button.Icon right>
						<FontAwesomeIcon icon="caret-down" />
					</Button.Icon>
				</Button>
			</Dropdown>
		</>
	);
}

function MilestoneActions({
	milestone,
	onDelete = () => {},
	onUpdate = () => {},
	stream = false,
}) {
	// We allow this to be false, favoring a boolean op below.
	// This allows for autofocus on click.
	const { user } = useAuth();
	const { mutate: updateMutation } = useUpdateMilestone(milestone);
	const { mutate: deleteMutation } = useDeleteMilestone(milestone);
	const [commentsOpen, setCommentsOpen] = useState(false);
	if (!milestone) return;

	const updateTask = async (delta) => {
		updateMutation(delta, {
			onSuccess: () => {
				log(
					`Milestone #${milestone.slug} has been updated. (${delta})`
				);
				onUpdate();
			},
		});
	};

	const deleteTask = async () => {
		deleteMutation(
			{ slug: milestone.slug },
			{
				onSuccess: () => {
					log(`Milestone #${milestone.slug} has been deleted.`);
					onDelete();
				},
			}
		);
	};

	if (stream) {
		return (
			<div>
				<span className="inline-flex">
					<span className="mr-2">
						<PraiseButton
							disabled={user && milestone.user.id === user.id}
							initialCount={milestone.praise}
							indexUrl={`/milestones/${milestone.slug}`}
						/>
					</span>
					<span className="mr-2">
						<Button
							xs
							onClick={() => {
								setCommentsOpen(true);
							}}
						>
							<Button.Icon>
								<FontAwesomeIcon icon="comment" />
							</Button.Icon>
							Comment
						</Button>
					</span>
					<span className="mr-2">
						<MilestoneMoreDropdown
							milestone={milestone}
							onUpdate={updateTask}
							onDelete={deleteTask}
						/>
					</span>
				</span>
				{(commentsOpen || milestone.comment_count > 0) && (
					<div className="mt-2">
						<MilestoneComments
							milestone={milestone}
							focused={commentsOpen}
						/>
					</div>
				)}
			</div>
		);
	} else {
		return null;
	}
}

export default MilestoneActions;
