import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
	toolbar: {
		backgroundColor: theme.palette.background.paper,
		position: "sticky",
		display: "flex"
	},

	title: {
		fontFamily: "Crimson Text",
		fontSize: "24px",
		paddingLeft: "12px",
		backgroundColor: theme.palette.background.paper,
	}
}));

export default function Bar(props) {
	const classes = useStyles();

	return <div className={classes.title}>ModernPTT</div>;
}
