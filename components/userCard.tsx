import {
	Avatar,
	AvatarBadge,
	Box,
	Button,
	Checkbox,
	Flex,
	IconButton,
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
import { changeMealTime, changeStatus } from "../services/api/auth";
import { toNameCase } from "../services/utils";
import { MealTime, SleepStatus, User } from "../types/auth";
import { useAppSelector } from "../store";
import React, { useEffect, useState } from "react";

export function UserCard({ wingie }: { wingie: User }) {
	const { user } = useAppSelector((state) => state.auth);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [meal, setMeal] = useState<MealTime[]>([]);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

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
						<Text mt={2} fontSize="sm">{wingie.mealTime.join(", ")}</Text>
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
								isChecked={meal.includes(MealTime.BREAKFAST)}
							>
								Breakfast
							</Checkbox>
							<Checkbox
								value="lunch"
								onChange={onMealSelect}
								isChecked={meal.includes(MealTime.LUNCH)}
							>
								Lunch
							</Checkbox>
							<Checkbox
								value="snacks"
								onChange={onMealSelect}
								isChecked={meal.includes(MealTime.SNACKS)}
							>
								Snacks
							</Checkbox>
							<Checkbox
								value="dinner"
								onChange={onMealSelect}
								isChecked={meal.includes(MealTime.DINNER)}
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
