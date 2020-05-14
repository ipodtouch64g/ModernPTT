import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Skeleton from "react-loading-skeleton";
import { useUserContext } from "./UserContext";
import { useBotContext } from "./BotContext";
import List from "@material-ui/core/List";
import BoardItem from "./BoardItem";
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";

// wierd import...
import { Board } from "ptt-client/dist/sites/ptt/model";

export default function BoardDisplay(props) {
	const useStyles = makeStyles(theme => ({
		root: {
			alignItems: "center",
			justifyContent: "center",
			maxHeight: "80vh",
			height: "80vh",
			overflow: "auto",
			alignContent: "flex-start"
		},
		skeleton: {
			fontSize: "40px",
			width: "80%"
		},
		list: {
			padding: "0px",
			width:"100%"
		}
	}));
	const classes = useStyles();
	const { user } = useUserContext();
	const BotContext = useBotContext();
	const [listItems, setListItems] = useState([]);

	const info = useArticleBoardInfoContext();

	let hotItems = useRef(null);
	let favoriteItems = useRef(null);
	let searchCache = useRef({});
	let selectedBoard = props.selectedBoard;
	let searchBoardText = props.searchBoardText;

	// Optimization : 1. Cache all search response.
	const getBoardCallback = useCallback(async () => {
		// if searchBoardText is not empty -> search board with this text
		// else search based on selectedBoard
		//console.log("searchCache", searchCache);
		let lis;
		let query;
		if (searchBoardText.length > 0) {
			if (searchCache.current[searchBoardText]) {
				lis = searchCache.current[searchBoardText];
			} else {
				query = BotContext.bot
					.select(Board)
					.where("prefix", searchBoardText);
			}
		} else {
			// already cached
			if (selectedBoard === "hot" && hotItems.current) {
				lis = hotItems.current;
				//console.log("hot cache", hotItems);
			} else if (selectedBoard === "favorite" && favoriteItems.current) {
				lis = favoriteItems.current;
			} else {
				query =
					selectedBoard === "hot"
						? BotContext.bot.select(Board).where("entry", "hot")
						: BotContext.bot
								.select(Board)
								.where("entry", "favorite");
			}
		}
		if (!lis) {
			let t1 = performance.now();
			let res = await BotContext.executeCommand({
				type: "select",
				arg: query
			});
			let t2 = performance.now();
			//console.log("bot select board", t2 - t1);
			if (!res) return false;
			//console.log(res);
			// generate list items
			lis = res.map(item => {
				return BoardItem({ item, info, BotContext });
			});
			let t3 = performance.now();
			//console.log("map boardItem", t3 - t2);

			// we cache for speed
			if (searchBoardText.length === 0) {
				if (selectedBoard === "hot") {
					hotItems.current = lis;
				} else if (selectedBoard === "favorite") {
					favoriteItems.current = lis;
				}
			} else {
				searchCache.current[searchBoardText] = lis;
			}
		}
		setListItems(lis);
	}, [BotContext, setListItems, selectedBoard, info, searchBoardText]);

	useEffect(() => {
		async function getBoard() {
			return await getBoardCallback(user);
		}
		// get board list at the beginning
		if (BotContext.botState.login) {
			//console.log(selectedBoard);
			getBoard();
		}
	}, [BotContext.botState.login, selectedBoard, searchBoardText]);

	return (
		<Grid container component="main" className={classes.root}>
			<Grid item className={classes.skeleton}>
				{searchBoardText.length === 0 && listItems.length === 0 && (
					<Skeleton count={6} />
				)}
			</Grid>
			{listItems && <List className={classes.list}> {listItems} </List>}
			{!listItems && ""}
		</Grid>
	);
}
