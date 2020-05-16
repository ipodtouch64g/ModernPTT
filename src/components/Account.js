import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SettingsIcon from "@material-ui/icons/Settings";
import { useUserContext } from "./UserContext";
import { useBotContext } from "./BotContext";

export default function Account() {
	const useStyles = makeStyles(theme => ({
		root: {
			position: "sticky",
			height: "10vh",
			display: "flex",
			border: `1px solid ${theme.palette.divider}`,
			justifyContent: "center",
			alignItems: "center"
		},
		skeleton: {
			width: "80%"
		}
	}));
	const classes = useStyles();
	const { user, setUser } = useUserContext();
	const { bot, botState } = useBotContext();
	return (
		<Grid container component="main" className={classes.root}>
			

			{botState.login && (
				<Grid item>
					<Grid item xs={9}>{user ? user.username : ""}</Grid>
					<Grid item xs={3}>
						<SettingsIcon />
					</Grid>
				</Grid>
			)}
		</Grid>
	);
}
