import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import BoardDisplay from "./BoardDisplay";
import BoardSelect from "./BoardSelect";

export default function BoardArea() {
	const useStyles = makeStyles(theme => ({
		root: {
			position: "relative",
			display: "flex",
			borderRight: `1px solid ${theme.palette.divider}`,
			justifyContent: "center",
			alignItems: "center",
			height:"95vh",
			overflow: "auto"
		},
	}));
	const classes = useStyles();
	const [selectedBoard, setSelectedBoard] = useState("hot");
	const [searchBoardText, setSearchBoardText] = useState("");
	return (
		<Grid container component="main" className={classes.root}>
			<BoardSelect setSelectedBoard = {setSelectedBoard} setSearchBoardText={setSearchBoardText}/>
			<BoardDisplay selectedBoard={selectedBoard} searchBoardText={searchBoardText} />
		</Grid>
	);
}
