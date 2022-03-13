import { Box, Center, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useQuery } from "react-query";
import { Loader } from "../components/loader";
import { getUser } from "../services/api/auth";

const Home: NextPage<{ isLoading: boolean }> = () => {
	const { data, isLoading, error } = useQuery("profile", getUser);

	if (!data || isLoading) {
		return <Loader />;
	}

	return (
		<Box w="80%" mx="auto">
			<Center>
				<Heading size="2xl" mt={8} textAlign="center">
					Hello, {data.data.name.split(" ")[0]}
				</Heading>
			</Center>
		</Box>
	);
};

export default Home;
