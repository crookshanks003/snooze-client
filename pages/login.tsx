import { FcGoogle } from "react-icons/fc";
import {
	Box,
	Heading,
	Text,
	Button,
	Stack,
	Center,
	Flex,
	Link,
} from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";

const Login: NextPage = () => {
	return (
		<>
			<Flex
				height="100vh"
				alignItems="center"
				justifyContent="center"
				mt={-8}
			>
				<Stack
					as={Box}
					textAlign={"center"}
					mx="auto"
					w={{ base: "2xl", sm: "xl" }}
				>
					<Heading as="h1" size="4xl" color="green.500" mb="6" mt="0">
						Snooze
					</Heading>
					<Text color={"gray.500"}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation
					</Text>
					<Center>
						<Button
							href="http://localhost:5000/auth/google"
							as={Link}
							w="full"
							maxW="md"
							variant="outline"
							colorScheme="green"
							leftIcon={<FcGoogle />}
							mt="7"
						>
							<Center>Sign in with Google</Center>
						</Button>
					</Center>
				</Stack>
			</Flex>
		</>
	);
};

export default Login;
