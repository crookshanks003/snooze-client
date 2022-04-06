import { Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppDispatch } from "../store";
import { fetchUser } from "../store/auth";

const Callback: NextPage = () => {
	const router = useRouter();
	const { token } = router.query;
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchUser());
		router.replace("/");
	});

	return <Text style={{ margin: "20px", fontSize: "22px" }}>Redirecting...</Text>;
};

export default Callback;
