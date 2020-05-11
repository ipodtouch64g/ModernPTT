import { useState } from "react";
import constate from "constate";

const useProgress = () => {
	const [isSnackbarOpen,setIsSnackbarOpen] = useState(false);
	const [snackbarContent,setSnackbarContent] = useState({
		severity:"",
		text:"",
	});
	

	const info = {
		isSnackbarOpen:isSnackbarOpen,
		setIsSnackbarOpen:setIsSnackbarOpen,
		snackbarContent:snackbarContent,
		setSnackbarContent:setSnackbarContent,
	};
	return info;
};

export const [ProgressProvider, useProgressContext] = constate(
	useProgress
);
