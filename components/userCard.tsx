import {
	Avatar,
	AvatarBadge,
	Box,
	Button,
	Checkbox,
	Flex,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { BsPencil, BsThreeDotsVertical } from "react-icons/bs";
import { ImSpoonKnife } from "react-icons/im";
import {
	changeMealTime,
	changeRoomNumber,
	changeStatus,
} from "../services/api/auth";
import { toNameCase } from "../services/utils";
import { MealTime, SleepStatus, User } from "../types/auth";
import { useAppSelector } from "../store";
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";

export function UserCard({ wingie, refetch}: { wingie: User, refetch: any}) {
	const { user } = useAppSelector((state) => state.auth);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [meal, setMeal] = useState<MealTime[]>([]);
	const [roomState, setRoomState] = useState(false);
	const [roomNumber, setRoomNumber] = useState(wingie.roomNumber);
	const roomRef = useRef<HTMLInputElement>(null);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const onRoomClick: React.MouseEventHandler<HTMLElement> = () => {
		setRoomState(!roomState);
	};

	const onMealSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		if (e.target.checked) {
			setMeal([...meal, e.target.value as MealTime]);
		} else {
			const newMeal = meal.filter((meal) => meal !== e.target.value);
			setMeal(newMeal);
		}
	};

	const onClickChangeStatus: React.MouseEventHandler<
		HTMLButtonElement
	> = async (_e) => {
		setButtonLoading(true);
		try {
			await changeStatus(
				wingie!.sleepStatus === SleepStatus.asleep
					? SleepStatus.awake
					: SleepStatus.asleep,
			);
			toast({
				title: "Status changed successfully!",
				status: "success",
				isClosable: true,
			});
		} catch {
			toast({
				title: "Failed to change status",
				status: "error",
				isClosable: true,
			});
			setButtonLoading(false);
		}
		setButtonLoading(false);
	};

	const onChangeMealTime = async () => {
		setButtonLoading(true);
		try {
			await changeMealTime(meal);
			toast({
				title: "Status changed successfully!",
				status: "success",
				isClosable: true,
			});
		} catch {
			toast({
				title: "Failed to change status",
				status: "error",
				isClosable: true,
			});
			setButtonLoading(false);
		}
		setButtonLoading(false);
	};

	useEffect(() => {
		setMeal(wingie.mealTime);
	}, []);

	return (
		<>
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
								<MenuItem
									icon={<ImSpoonKnife />}
									onClick={onOpen}
								>
									Change Meal
								</MenuItem>
							</MenuList>
						</Menu>
					</Flex>
				)}
				<Box mt={user?.name === wingie.name ? -6 : 2}>
					<Avatar size="lg" src={wingie.image} name={wingie.name}>
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
						{ wingie.googleId === user?.googleId && roomState ? (
							<form
								onSubmit={async (e) => {
									e.preventDefault();
									setButtonLoading(true);
									await changeRoomNumber(roomNumber);
									setButtonLoading(false);
									refetch()
									roomRef.current?.blur();
								}}
							>
								<Input
									colorScheme="gray.500"
									type="number"
									value={roomNumber}
									onChange={(e) => {
										setRoomNumber(parseInt(e.target.value));
									}}
									onBlur={() => setRoomState(!roomState)}
									width={10}
									size="xs"
									ref={roomRef}
									maxLength={3}
									autoFocus
								/>
							</form>
						) : (
							<Text
								as="small"
								fontWeight="500"
								color="gray.500"
								onClick={onRoomClick}
							>
								{wingie.roomNumber}
							</Text>
						)}
						<Text
							fontWeight="600"
							fontSize="lg"
							color="gray.700"
							mt={-1}
						>
							{toNameCase(wingie.name)}
						</Text>
						<Text mt={2} fontSize="sm">
							{wingie.mealTime.join(", ")}
						</Text>
					</Box>
				</Box>
			</Box>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Meal Times</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={2}>
							<Checkbox
								value="breakfast"
								onChange={onMealSelect}
								defaultIsChecked={meal.includes(
									MealTime.BREAKFAST,
								)}
							>
								Breakfast
							</Checkbox>
							<Checkbox
								value="lunch"
								onChange={onMealSelect}
								defaultIsChecked={meal.includes(MealTime.LUNCH)}
							>
								Lunch
							</Checkbox>
							<Checkbox
								value="snacks"
								onChange={onMealSelect}
								defaultIsChecked={meal.includes(
									MealTime.SNACKS,
								)}
							>
								Snacks
							</Checkbox>
							<Checkbox
								value="dinner"
								onChange={onMealSelect}
								defaultIsChecked={meal.includes(
									MealTime.DINNER,
								)}
							>
								Dinner
							</Checkbox>
						</Stack>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="green"
							onClick={onChangeMealTime}
							isLoading={buttonLoading}
						>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
