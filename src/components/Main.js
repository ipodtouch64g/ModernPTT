import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Login from "./Login";
import Account from "./Account";

import BoardArea from "./BoardArea";
import ArticleArea from "./ArticleArea";
import SearchBar from "./SearchBar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { UserProvider } from "./UserContext";
import { BotProvider } from "./BotContext";
import { ArticleBoardInfoProvider } from "./ArticleBoardInfoContext";
import Hidden from '@material-ui/core/Hidden';

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

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
			fontWeight: "bold",
		}
	}
});

export default function Main() {
	return (
		<UserProvider>
			<BotProvider>
				<ArticleBoardInfoProvider>
				<ThemeProvider theme={theme}>
					<Container
						component="main"
						maxWidth="lg"
						disableGutters="true"
					>
						<CssBaseline />
						<Login />
						<Grid container>
							<Grid item xs={12}>
								<SearchBar />
							</Grid>
							<Hidden xsDown>
							<Grid item  sm={3} direction="column">
								<BoardArea />
							</Grid>
							</Hidden>
							<Grid item xs={12} sm={9} >
								<ArticleArea />
							</Grid>
						</Grid>
					</Container>
				</ThemeProvider>
				</ArticleBoardInfoProvider>
			</BotProvider>
		</UserProvider>
	);
}
