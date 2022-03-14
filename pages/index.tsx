import {
	Box,
	Center,
	Heading,
	SimpleGrid,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { Loader } from "../components/loader";
import { getAllUsers } from "../services/api/auth";
import { toNameCase } from "../services/utils";
import { useAppDispatch, useAppSelector } from "../store";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { fetchUser } from "../store/auth";
import { io } from "socket.io-client";
import { UserCard } from "../components/userCard";

const Home: NextPage = () => {
	const { isLoggedIn, user, loading } = useAppSelector((state) => state.auth);
	const { data, isLoading, error, refetch } = useQuery(
		"all-users",
		getAllUsers,
		{ enabled: isLoggedIn },
	);
	const router = useRouter();
	const dispatch = useAppDispatch();

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
				socket.on("status", (_status: any) => {
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
					{data.data.map((wingie) => (
						<UserCard wingie={wingie} key={wingie.googleId}/>
					))}
				</SimpleGrid>
			</Box>
		</Box>
	);
};

export default Home;
