import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { BsPencil, BsThreeDotsVertical } from "react-icons/bs";
import { changeStatus } from "../services/api/auth";
import { toNameCase } from "../services/utils";
import { SleepStatus, User } from "../types/auth";
import { useAppSelector } from "../store";
import { useState } from "react";

export function UserCard({wingie}: {wingie: User}) {
	const { user } = useAppSelector((state) => state.auth);
	const [buttonLoading, setButtonLoading] = useState(false);

	const onClickChangeStatus: React.MouseEventHandler<
		HTMLButtonElement
	> = async (_e) => {
		setButtonLoading(true);
		await changeStatus(
			wingie!.sleepStatus === SleepStatus.asleep
				? SleepStatus.awake
				: SleepStatus.asleep,
		);
		setButtonLoading(false);
	};

	return (
		<Box
			maxW="md"
			borderWidth="1px"
			borderRadius="lg"
			p="4"
			key={wingie.name}
			textAlign="center"
		>
			{user?.name === wingie.name && (
				<Flex w="full" justifyContent="end">
					<Menu placement="bottom-end">
						<MenuButton
							isLoading={buttonLoading}
							as={IconButton}
							aria-label="Options"
							icon={<BsThreeDotsVertical />}
							variant="outline"
							size="sm"
							color="gray.600"
						/>
						<MenuList>
							<MenuItem
								icon={<BsPencil />}
								onClick={onClickChangeStatus}
							>
								Change Status
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			)}
			<Box mt={user?.name === wingie.name ? -6 : 2}>
				<Avatar size="lg">
					<Tooltip
						label={wingie.sleepStatus}
						aria-label={wingie.sleepStatus}
						gutter={2}
					>
						<AvatarBadge
							bg={
								wingie.sleepStatus === SleepStatus.awake
									? "green.500"
									: "gray.400"
							}
							boxSize="1em"
						/>
					</Tooltip>
				</Avatar>
				<Box color="gray.500" mt="2">
					<Text as="small" fontWeight="500" color="gray.500">
						{wingie.roomNumber}
					</Text>
					<Text
						fontWeight="600"
						fontSize="lg"
						color="gray.700"
						mt={-1}
					>
						{toNameCase(wingie.name)}
					</Text>
				</Box>
			</Box>
		</Box>
	);
}
