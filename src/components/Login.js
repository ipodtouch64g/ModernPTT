import React, { useState, useEffect, useCallback } from "react";
// import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import { useUserContext } from "./UserContext";
import { useBotContext } from "./BotContext";
import { useProgressContext } from "./ProgressContext";
import { CircularProgress } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { useForm } from "react-hook-form";
import Cookies from "universal-cookie";

const useStyles = makeStyles(theme => ({
	root: {
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column"
	},
	paperform: {
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
	paperreconnect: {
		padding: "12px",
		minWidth: "20vw",
		height: "15vh",
		display: "flex",
		flexDirection: "column"
	},
	reconnectText: {},
	reconnectButton: {
		alignSelf: "flex-end"
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
	},
	installExtension: {
		width: "400px"
	}
}));

export default function Login() {
	const classes = useStyles();

	const { user, setUser } = useUserContext();
	const BotContext = useBotContext();
	const { setIsSnackbarOpen, setSnackbarContent } = useProgressContext();
	const { register, handleSubmit } = useForm();

	const onSubmit = async (data, e) => {
		e.preventDefault();
		let myUser = { username: data.username, password: data.password };
		let loginRes = await loginCallback(myUser);
		if (loginRes) {
			// save it in cookie
			const cookies = new Cookies();
			cookies.set("user", myUser);
			setUser(myUser);
		}
	};

	const loginCallback = useCallback(
		async myUser => {
			//console.log(myUser);
			setOpenForm(false);
			setOpenLoadingCircle(true);
			let res = await BotContext.executeCommand({
				type: "login",
				arg: myUser
			});
			if (res) {
				//console.log("login success");
				setOpenBackDrop(false);
				setOpenLoadingCircle(false);
				return true;
			} else {
				//console.log("login fail");
				setSnackbarContent({
					severity: "error",
					text: "帳密輸入錯誤"
				});
				setIsSnackbarOpen(true);
				setOpenForm(true);
				setOpenLoadingCircle(false);
				return false;
			}
		},
		[BotContext]
	);
	const handleReconnect = () => {
		window.location.reload();
	};
	const [openBackDrop, setOpenBackDrop] = useState(!user);
	const [openLoadingCircle, setOpenLoadingCircle] = useState(false);
	const [openForm, setOpenForm] = useState(true);
	const [openReconnect, setOpenReconnect] = useState(false);

	useEffect(() => {
		async function tryLogin() {
			await loginCallback(user);
		}
		console.log("botState:", BotContext.botState);
		if (user) {
			if (BotContext.botState === undefined) return;
			if (
				BotContext.botState.connect &&
				!BotContext.botState.login
			) {
				setOpenReconnect(false);
				tryLogin();
			} else if (
				BotContext.botState.login &&
				!BotContext.botState.connect
			) {
				// disconnected
				setOpenBackDrop(true);
				setOpenReconnect(true);
			}
		}
	}, [user, BotContext.botState,loginCallback]);

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
					{openReconnect && (
						<Paper className={classes.paperreconnect}>
							<Typography
								variant="body1"
								className={classes.reconnectText}
							>
								您斷線了
							</Typography>
							<Button
								variant="contained"
								color="secondary"
								className={classes.reconnectButton}
								onClick={handleReconnect}
							>
								重新連線
							</Button>
						</Paper>
					)}

					{BotContext.botState.wsState === -1 && (
						<Card className={classes.installExtension}>
							<CardContent>
								<Typography variant="h5" component="h2" gutterBottom>
									尚未安裝插件
								</Typography>
								<Typography variant="body1" component="p">
									因為技術問題，目前只能先請您安裝
									<Link href="https://github.com/ipodtouch64g/pass-thorugh-ptt-wall-wss">
										穿牆插件
									</Link>
									<span role="img" aria-label="Person Bowing">
										🙇
									</span>{" "}
								</Typography>
								<Typography variant="body2" component="p">
									(PTT的WebSocket只容許特定Origin，瀏覽器不支援custom
									header
									<span
										role="img"
										aria-label="Loudly Crying Face"
									>
										😭
									</span>{" "}
									)
								</Typography>
							</CardContent>
						</Card>
					)}

					{BotContext.botState.wsState === 1 && openForm && (
						<Paper className={classes.paperform}>
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
		</Grid>
	);
}
