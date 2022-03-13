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
import { changeStatus, getAllUsers, getUser } from "../services/api/auth";
import { toNameCase } from "../services/utils";
import { SleepStatus } from "../types/auth";
import { BsPencil, BsThreeDotsVertical } from "react-icons/bs";

const Home: NextPage<{ isLoading: boolean }> = () => {
	const { data, isLoading, error } = useQuery("all-users", getAllUsers);

	if (!data || isLoading) {
		return <Loader />;
	}

	return (
		<Box width={["100%", null, "90%", null, "80%"]} mx="auto">
			<Center>
				<Heading size="2xl" mt={8} textAlign="center">
					Hello, Pritesh
				</Heading>
			</Center>
			<Box>
				<SimpleGrid mt="10" gap="6" columns={[1, 2, null, 4]}>
					{data.data.map((user) => (
						<Box
							maxW="md"
							borderWidth="1px"
							borderRadius="lg"
							p="4"
							key={user.name}
							textAlign="center"
						>
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
											onClick={async () => {
												const newUser =
													await changeStatus(
														user.sleepStatus ===
															SleepStatus.asleep
															? SleepStatus.awake
															: SleepStatus.asleep,
													);
												console.log(newUser);
											}}
										>
											Change Status
										</MenuItem>
									</MenuList>
								</Menu>
							</Flex>
							<Box mt={-6}>
								<Avatar size="lg">
									<Tooltip
										label={user.sleepStatus}
										aria-label={user.sleepStatus}
										gutter={2}
									>
										<AvatarBadge
											bg={
												user.sleepStatus ===
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
										{user.roomNumber}
									</Text>
									<Text
										fontWeight="600"
										fontSize="lg"
										color="gray.700"
										mt={-1}
									>
										{toNameCase(user.name)}
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
