import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Skeleton from "react-loading-skeleton";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useBotContext } from "./BotContext";

export default function BoardSelect(props) {
	const useStyles = makeStyles(theme => ({
		skeleton: {
			fontSize: "24px",
			width: "80%"
		},
		root: {
			justifyContent: "center",
			alignItems: "center"
		}
	}));

	const classes = useStyles();
	const BotContext = useBotContext();
	const [selectedValue, setSelectedValue] = useState(0);

	const handleChange = (e,v) => {
		setSelectedValue(v);
	};

	let setSelectedBoard = props.setSelectedBoard;
	useEffect(() => {
		let selectedBoard = "hot";
		switch (selectedValue) {
			case 0:
				selectedBoard = "hot";
				break;
			case 1:
				selectedBoard = "favorite";
				break;
			default:
				break;
		}
		setSelectedBoard(selectedBoard);
	}, [selectedValue, setSelectedBoard]);

	return (
		<Grid container component="main" className={classes.root}>
			<Grid item className={classes.skeleton}>
				{!BotContext.botState.login && <Skeleton count={1} />}
			</Grid>
			{BotContext.botState.login && (
				<Tabs
					value={selectedValue}
					indicatorColor="primary"
					textColor="primary"
					onChange={handleChange}
				>
					<Tab label="熱門看板" />
					<Tab label="最愛看板" />
				</Tabs>
			)}
		</Grid>
	);
}
