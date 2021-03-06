import { Box, Center, Heading, SimpleGrid } from "@chakra-ui/react";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { Loader } from "../components/loader";
import { getAllUsers, getUser } from "../services/api/auth";
import { checkLoggedIn, toNameCase } from "../services/utils";
import { useAppDispatch, useAppSelector } from "../store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { setLoggedIn, setUser } from "../store/auth";
import { io, Socket } from "socket.io-client";
import { UserCard } from "../components/userCard";
import { Chat } from "../components/chat";
import { setConnectedUsers } from "../store/chat";
import { User } from "../types/auth";

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
		if (!checkLoggedIn() || !isLoggedIn) {
			router.push("/login");
		} else {
			if (queryUser.data) {
				dispatch(setUser(queryUser.data.data));
				dispatch(setLoggedIn(true));
			}
		}
	}, [queryUser, isLoggedIn]);

	useEffect(() => {
		let socket: Socket;
		if (isLoggedIn && user) {
			socket = io(process.env.NEXT_PUBLIC_API_URL!, {
				extraHeaders: { googleid: user!.googleId },
			});
			socket.on("connect", () => {
				socket.on("connectedusers", (msg: { id: string; user: User }[]) => {
					dispatch(setConnectedUsers(msg));
				});
			});
			setClient(socket);
		}
		return () => {
			if (socket) socket.close();
		};
	}, [isLoggedIn, user]);

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

	if (isLoading || loading || queryUser.isLoading) {
		return <Loader />;
	}

	return (
		<Box width={["100%", null, "90%", null, "80%"]} mx="auto" px={[6, 8, 0]}>
			<Center>
				<Heading size="2xl" mt={8} textAlign="center">
					Hello, {toNameCase(user?.name)}
				</Heading>
			</Center>
			<Box maxH="60vh" overflowY="auto">
				<SimpleGrid mt="10" gap="6" columns={[1, 2, null, 4]}>
					{data?.data.map((wingie) => (
						<UserCard wingie={wingie} key={wingie.googleId} refetch={refetch} />
					))}
				</SimpleGrid>
			</Box>
			<Chat client={client} />
		</Box>
	);
};

export default Home;
