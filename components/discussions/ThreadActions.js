import React from "react";
import Button from "components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "components/ui/Dropdown";
import { useAuth } from "stores/AuthStore";
import { getTwitterShareUrl } from "utils/discussions";

function ThreadActions({ thread, onEdit, onDelete }) {
	const { isLoggedIn, user } = useAuth();

	return (
		<div className="flex flex-row items-center mt-4">
			<div className="mr-2">
				<Button
					sm
					anchorElem
					href={getTwitterShareUrl(thread)}
					target="_blank"
				>
					<Button.Icon>
						<FontAwesomeIcon icon={["fab", "twitter"]} />
					</Button.Icon>
					Tweet
				</Button>
			</div>
			{isLoggedIn && user.id === thread.owner.id && (
				<div className="mr-2">
					<Dropdown
						origin="right"
						className="left-0"
						items={
							<>
								<Dropdown.Item onClick={onEdit}>
									<Dropdown.Item.Icon>
										<FontAwesomeIcon icon="edit" />
									</Dropdown.Item.Icon>{" "}
									Edit
								</Dropdown.Item>
								<Dropdown.Item onClick={onDelete}>
									<Dropdown.Item.Icon>
										<FontAwesomeIcon icon="trash" />
									</Dropdown.Item.Icon>{" "}
									Delete
								</Dropdown.Item>
							</>
						}
					>
						<Button sm>
							<Button.Icon>
								<FontAwesomeIcon icon="ellipsis-v" />
							</Button.Icon>
							More
							<Button.Icon right>
								<FontAwesomeIcon icon="caret-down" />
							</Button.Icon>
						</Button>
					</Dropdown>
				</div>
			)}
		</div>
	);
}

export default ThreadActions;
