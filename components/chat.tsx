import {
	Box,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputRightAddon,
	Text,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../store";
import { toNameCase } from "../services/utils";

export function Chat({ client }: { client?: Socket }) {
	const [chat, setChat] = useState<{ message: string; user: string }[]>([]);
	const [message, setMessage] = useState<string>();
	const { user } = useAppSelector((state) => state.auth);

	const sendMessage = (e: any) => {
		if (message) {
			client!.emit("message", { message, user: toNameCase(user!.name) });
			setChat([...chat, { message, user: toNameCase(user!.name) }]);
		}
	};

	useEffect(() => {
		if (client) {
			client.on("message", (msg: { message: string; user: string }) => {
				setChat([...chat, msg]);
			});
		}
		return () => {
			client?.off("status");
		};
	});

	return (
		<Box
			pos="fixed"
			bottom={0}
			right={[0, null, 8, null, 10]}
			px={[6, 8, 0]}
			mb={6}
			width={["100%", null, "45%", null, "25%"]}
		>
			<Box
				overflowY="auto"
				maxH="20vh"
				css={{ scrollbarWidth: "thin" }}
				px="1"
			>
				{chat.map((msg) => (
					<Text
						key={msg.message}
						as={Flex}
						justifyContent={
							msg.user === toNameCase(user!.name)
								? "end"
								: "start"
						}
					>
						{msg.message}
					</Text>
				))}
			</Box>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					sendMessage(e);
				}}
			>
				<InputGroup mt="4">
					<Input
						colorScheme="gray.500"
						type="tel"
						placeholder="message"
						onChange={(e) => setMessage(e.target.value)}
					/>
					<InputRightAddon
						as={IconButton}
						icon={<IoMdSend />}
						onClick={sendMessage}
					/>
				</InputGroup>
			</form>
		</Box>
	);
}
