import React, { useState, useEffect, useCallback } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useUserContext } from "./UserContext";
import { useBotContext } from "./BotContext";


const useStyles = makeStyles(theme => ({
	root: {
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column"
	},
	paper: {
		width: "400px",
		margin: theme.spacing(8, 4),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center"
	},
	paperlogging: {
		minWidth: "12vw",
		height: "9vh",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		marginTop: "25vh",
		zIndex: theme.zIndex.drawer + 2
	},
	form: {
		width: "80%",
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	signin: {
		marginTop: theme.spacing(2)
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff"
	},
	circle: {
		marginRight: "9px"
	}
}));

export default function ProgressUI() {
	const classes = useStyles();

	

	const loginCallback = useCallback(
		async myUser => {
			console.log(myUser);
			setOpenForm(false);
			setOpenLoadingCircle(true);
			let res = await BotContext.executeCommand({
				type: "login",
				arg: myUser
			});
			if (res) {
				console.log("login success");
				setOpenBackDrop(false);
				setOpenLoadingCircle(false);
				return true;
			} else {
				console.log("login fail");
				setOpenErrorBar(true);
				setOpenForm(true);
				setOpenLoadingCircle(false);
				return false;
			}
		},
		[BotContext]
	);

	const [openBackDrop, setOpenBackDrop] = useState(!user);
	const [openErrorBar, setOpenErrorBar] = useState(false);
	const [openLoadingCircle, setOpenLoadingCircle] = useState(false);
	const [openForm, setOpenForm] = useState(true);

	useEffect(() => {
		async function tryLogin() {
			await loginCallback(user);
		}
		console.log("botState:", BotContext.botState);
		console.log("prev botState:", BotContext.prevBotState);
		if (user) {
				if(BotContext.prevBotState === undefined) return;
				if (BotContext.botState.connect && !BotContext.prevBotState.connect) {
					tryLogin();
				} else if (
					BotContext.prevBotState.connect &&
					!BotContext.botState.connect
				) {
					// disconnected
					setOpenLoadingCircle(true);
				}
			
		}
	}, [user, BotContext.botState, BotContext.prevBotState, loginCallback]);

	function Alert(props) {
		return <MuiAlert elevation={6} variant="filled" {...props} />;
	}

	const handleErrorBarClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenErrorBar(false);
	};

	return (
		<Grid container component="main" className={classes.root}>
			{openLoadingCircle && (
				<Paper className={classes.paperlogging}>
					<CircularProgress
						className={classes.circle}
						color="secondary"
					/>
					<Typography variant="body1">
						{!BotContext.connect
							? "連線中"
							: !BotContext.login
							? "登入中"
							: ""}
					</Typography>
				</Paper>
			)}
			<Backdrop className={classes.backdrop} open={openBackDrop}>
				<Grid container component="main" className={classes.root}>
					<CssBaseline />
					{openForm && (
						<Paper className={classes.paper}>
							{/* <Avatar variant="square" className={classes.large} src="logo.png"/> */}
							<Typography
								component="h4"
								variant="h5"
								className={classes.signin}
							>
								登入PTT
							</Typography>
							<form
								className={classes.form}
								onSubmit={handleSubmit(onSubmit)}
							>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="username"
									label="帳號"
									name="username"
									autoComplete="username"
									autoFocus
									inputRef={register}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="password"
									label="密碼"
									type="password"
									id="password"
									autoComplete="current-password"
									inputRef={register}
								/>
								<FormControlLabel
									control={
										<Checkbox
											value="remember"
											color="primary"
										/>
									}
									label="記住我"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									登入
								</Button>
							</form>
						</Paper>
					)}
				</Grid>
			</Backdrop>
			<Snackbar
				open={openErrorBar}
				autoHideDuration={6000}
				onClose={handleErrorBarClose}
			>
				<Alert severity="error">帳密輸入錯誤歐!</Alert>
			</Snackbar>
		</Grid>
	);
}
