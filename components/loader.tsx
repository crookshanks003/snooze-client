import React from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";

export function Loader() {
	return (
		<Box>
			<Flex height="90vh" align="center" justify="center">
				<Spinner
				speed="0.5s"
					size="xl"
					color="green.500"
					thickness="4px"
					emptyColor="gray.200"
				/>
			</Flex>
		</Box>
	);
}
