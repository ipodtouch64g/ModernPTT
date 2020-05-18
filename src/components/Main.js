import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Login from "./Login";
import Account from "./Account";

import BoardArea from "./BoardArea";
import ArticleArea from "./ArticleArea";
import Bar from "./Bar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { UserProvider } from "./UserContext";
import { BotProvider } from "./BotContext";
import { ArticleBoardInfoProvider } from "./ArticleBoardInfoContext";
import MySnackbar from "./MySnackbar";
import Hidden from "@material-ui/core/Hidden";
import { ProgressProvider } from "./ProgressContext";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { Resizable } from "re-resizable";

import { colors } from "@material-ui/core";

const theme = createMuiTheme({
	typography: {
		body1: {
			fontSize: "0.8rem"
		},
		body2: {
			fontSize: "0.65rem"
		},
		h5: {
			fontSize: "1rem",
			fontWeight: "bold"
		}
	},
	palette: {
		type: "dark",
		primary: {
			main: colors.lightGreen[500],
			dark: colors.lightGreen[500]
		},
		secondary: {
			main: colors.yellow[500],
			dark: colors.yellow[500]
		},
		error: {
			main: colors.red[500],
			dark: colors.red[500]
		}
	}
});

const useStyles = makeStyles(theme => ({
	resizable: {
		display: "flex",
		width: "100%",
		height:"95vh"
	},
	mainContainer: {
		height : "100vh",
	},
	bar: {
		height : "5vh"
	}
}));

export default function Main() {
	const classes = useStyles();
	return (
		<UserProvider>
			<ProgressProvider>
				<BotProvider>
					<ArticleBoardInfoProvider>
						<ThemeProvider theme={theme}>
							<Container
								component="main"
								maxWidth="lg"
								disableGutters="true"
								className={classes.mainContainer}
							>
								<CssBaseline />
								<Login />

								<Grid item className={classes.bar}>
									<Bar />
								</Grid>
								<Grid item className={classes.resizable}>
									<Resizable
										defaultSize={{
											width: "25vw",
											height: "95vh"
										}}
										enable={{
											top: false,
											right: true,
											bottom: false,
											left: false,
											topRight: false,
											bottomRight: false,
											bottomLeft: false,
											topLeft: false
										}}
									>
										<BoardArea />
									</Resizable>
									<ArticleArea />
								</Grid>

								<MySnackbar />
							</Container>
						</ThemeProvider>
					</ArticleBoardInfoProvider>
				</BotProvider>
			</ProgressProvider>
		</UserProvider>
	);
}
