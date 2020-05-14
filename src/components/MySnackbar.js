import React, { useState, useEffect, useCallback } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Snackbar from "@material-ui/core/Snackbar";
import { useProgressContext } from "./ProgressContext";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles(theme => ({}));

export default function MySnackbar() {
	const classes = useStyles();
	const {
		isSnackbarOpen,
		setIsSnackbarOpen,
		snackbarContent
	} = useProgressContext();
	function Alert(props) {
		return <MuiAlert elevation={6} variant="filled" {...props} />;
	}

	const handleErrorBarClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setIsSnackbarOpen(false);
	};
	return (
		<Snackbar
			open={isSnackbarOpen}
			autoHideDuration={1000}
			onClose={handleErrorBarClose}
		>
			<Alert severity={snackbarContent.severity}>
				{snackbarContent.text}
			</Alert>
		</Snackbar>
	);
}
