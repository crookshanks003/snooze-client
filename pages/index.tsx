import {
	Avatar,
	AvatarBadge,
	Box,
	Center,
	Flex,
	Heading,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SimpleGrid,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { Loader } from "../components/loader";
import { changeStatus, getAllUsers } from "../services/api/auth";
import { toNameCase } from "../services/utils";
import { SleepStatus } from "../types/auth";
import { BsPencil, BsThreeDotsVertical } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../store";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { fetchUser } from "../store/auth";
import { io } from "socket.io-client";

const Home: NextPage = () => {
	const { isLoggedIn, user, loading } = useAppSelector((state) => state.auth);
	const { data, isLoading, error, refetch } = useQuery(
		"all-users",
		getAllUsers,
		{ enabled: isLoggedIn },
	);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const onClickChangeStatus: React.MouseEventHandler<
		HTMLButtonElement
	> = async (e) => {
		await changeStatus(
			user!.sleepStatus === SleepStatus.asleep
				? SleepStatus.awake
				: SleepStatus.asleep,
		);
	};

	useEffect(() => {
		if (!isLoggedIn) {
			dispatch(fetchUser());
		}
	}, []);

	useEffect(() => {
		if (!isLoggedIn) {
			router.push("/login");
		}
	});

	useEffect(() => {
		if (isLoggedIn) {
			const socket = io("localhost:5000", {
				extraHeaders: { googleid: user!.googleId },
			});
			socket.on("connect", () => {
				socket.on("status", (status: any) => {
					refetch();
				});
			});
		}
	}, [isLoggedIn]);

	if (!data || isLoading || loading || !isLoggedIn) {
		return <Loader />;
	}

	return (
		<Box
			width={["100%", null, "90%", null, "80%"]}
			mx="auto"
			px={[6, 8, 0]}
		>
			<Center>
				<Heading size="2xl" mt={8} textAlign="center">
					Hello, {toNameCase(user!.name)}
				</Heading>
			</Center>
			<Box>
				<SimpleGrid mt="10" gap="6" columns={[1, 2, null, 4]}>
					{data.data.map((mates) => (
						<Box
							maxW="md"
							borderWidth="1px"
							borderRadius="lg"
							p="4"
							key={mates.name}
							textAlign="center"
						>
							{user?.name === mates.name && (
								<Flex w="full" justifyContent="end">
									<Menu placement="bottom-end">
										<MenuButton
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
							<Box mt={user?.name === mates.name ? -6 : 2}>
								<Avatar size="lg">
									<Tooltip
										label={mates.sleepStatus}
										aria-label={mates.sleepStatus}
										gutter={2}
									>
										<AvatarBadge
											bg={
												mates.sleepStatus ===
												SleepStatus.awake
													? "green.500"
													: "gray.400"
											}
											boxSize="1em"
										/>
									</Tooltip>
								</Avatar>
								<Box color="gray.500" mt="2">
									<Text
										as="small"
										fontWeight="500"
										color="gray.500"
									>
										{mates.roomNumber}
									</Text>
									<Text
										fontWeight="600"
										fontSize="lg"
										color="gray.700"
										mt={-1}
									>
										{toNameCase(mates.name)}
									</Text>
								</Box>
							</Box>
						</Box>
					))}
				</SimpleGrid>
			</Box>
		</Box>
	);
};

export default Home;
