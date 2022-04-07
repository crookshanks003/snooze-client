import { Box, Center, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { Loader } from "../components/loader";
import { getAllUsers, getUser } from "../services/api/auth";
import { checkLoggedIn, toNameCase } from "../services/utils";
import { useAppDispatch, useAppSelector } from "../store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetchUser, setLoggedIn, setUser } from "../store/auth";
import { io, Socket } from "socket.io-client";
import { UserCard } from "../components/userCard";
import { Chat } from "../components/chat";

const Home: NextPage = () => {
	const { isLoggedIn, user, loading } = useAppSelector((state) => state.auth);
	const { data, isLoading, error, refetch } = useQuery("all-users", getAllUsers, {
		enabled: isLoggedIn,
	});
	const queryUser = useQuery("user", getUser);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [client, setClient] = useState<Socket>();

	useEffect(() => {
		if (!checkLoggedIn()) {
			router.push("/login");
		} else {
			if (queryUser.data) {
				dispatch(setUser(queryUser.data.data));
				dispatch(setLoggedIn(true));
			}
		}
	}, [queryUser]);

	useEffect(() => {
		let socket: Socket;
		if (isLoggedIn) {
			socket = io(process.env.NEXT_PUBLIC_API_URL!, {
				extraHeaders: { googleid: user!.googleId },
			});
			socket.on("connect", () => {
				console.log("connected");
			});
			setClient(socket);
		}
		return () => {
			if (socket) socket.close();
		};
	}, []);

	useEffect(() => {
		if (client) {
			client.on("status", (_status: any) => {
				refetch();
			});
		}
		return () => {
			client?.off("status");
		};
	});

	if (!data || isLoading || loading || !isLoggedIn || queryUser.isLoading) {
		return <Loader />;
	}

	return (
		<Box width={["100%", null, "90%", null, "80%"]} mx="auto" px={[6, 8, 0]}>
			<Center>
				<Heading size="2xl" mt={8} textAlign="center">
					Hello, {toNameCase(user!.name)}
				</Heading>
			</Center>
			<Box>
				<SimpleGrid mt="10" gap="6" columns={[1, 2, null, 4]}>
					{data.data.map((wingie) => (
						<UserCard wingie={wingie} key={wingie.googleId} />
					))}
				</SimpleGrid>
			</Box>
			<Chat client={client} />
		</Box>
	);
};

export default Home;
