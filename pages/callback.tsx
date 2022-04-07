import { Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setToken } from "../services/utils";

const Callback: NextPage = () => {
	const router = useRouter();
	const { token } = router.query;

	useEffect(() => {
		setToken(token as string);
		router.replace("/");
	});

	return <Text style={{ margin: "20px", fontSize: "22px" }}>Redirecting...</Text>;
};

export default Callback;
