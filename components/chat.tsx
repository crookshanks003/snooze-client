import {
	Avatar,
	Box,
	Flex,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputRightAddon,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../store";
import { toNameCase } from "../services/utils";
import { addConnectedUser, removeConnectedUser, setConnectedUsers } from "../store/chat";
import { User } from "../types/auth";

export function Chat({ client }: { client?: Socket }) {
	const [chat, setChat] = useState<{ message: string; user: string }[]>([]);
	const [message, setMessage] = useState<string>("");
	const { user } = useAppSelector((state) => state.auth);
	const { connectedUsers } = useAppSelector((state) => state.chat);
	const dispatch = useAppDispatch();

	const sendMessage = (_e: any) => {
		if (message) {
			client!.emit("message", { message, user: toNameCase(user!.name) });
			setChat([...chat, { message, user: toNameCase(user!.name) }]);
			setMessage("");
		}
	};

	useEffect(() => {
		if (client) {
			client.on("message", (msg: { message: string; user: string }) => {
				setChat([...chat, msg]);
			});
			client.on("newuser", (msg: { id: string; user: User }) => {
				dispatch(addConnectedUser(msg));
			});
			client.on("logout", (id: string) => {
				dispatch(removeConnectedUser(id));
			});
			client.on("connectedusers", (msg: { id: string; user: User }[]) => {
				console.log(msg);
				dispatch(setConnectedUsers(msg));
			});
		}
		return () => {
			client?.off("status");
			client?.off("newuser");
			client?.off("logout");
			client?.off("connectedusers");
		};
	});

	return (
		<Box
			pos="fixed"
			bottom={0}
			right={[0, null, 8, null, 10]}
			px={[6, 8, 0]}
			mb={6}
			width={["100%", null, "45%", "35%", "25%"]}
		>
			<Box overflowY="auto" maxH="20vh" css={{ scrollbarWidth: "thin" }} px="1">
				{chat.map((msg, idx) => (
					<Text
						key={idx}
						as={Flex}
						justifyContent={msg.user === toNameCase(user!.name) ? "end" : "start"}
					>
						<strong>{msg.user}</strong>: {msg.message}
					</Text>
				))}
			</Box>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					sendMessage(e);
				}}
			>
				<HStack spacing="4px" mt={2}>
					{connectedUsers.map((client) => (
						<Tooltip
							label={toNameCase(client.user.name.split(" ")[0])}
							aria-label={client.user.name}
							gutter={2}
							key={client.id}
						>
							<Avatar
								size="xs"
								name={client.user.name.split(" ")[0]}
								src={client.user.image}
							/>
						</Tooltip>
					))}
				</HStack>
				<InputGroup mt="4">
					<Input
						colorScheme="gray.500"
						placeholder="message"
						onChange={(e) => setMessage(e.target.value)}
						value={message}
					/>
					<InputRightAddon as={IconButton} icon={<IoMdSend />} onClick={sendMessage} />
				</InputGroup>
			</form>
		</Box>
	);
}
