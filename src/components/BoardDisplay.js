import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Skeleton from "@material-ui/lab/Skeleton";
import { useBotContext } from "./BotContext";
import List from "@material-ui/core/List";
import BoardItem from "./BoardItem";
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
// wierd import...
import { Board } from "ptt-client/dist/sites/ptt/model";

export default function BoardDisplay(props) {
	const useStyles = makeStyles(theme => ({
		root: {
			height: 'calc(100% - 48px)',
			overflow: "auto",
			marginTop:'48px',
			alignItems:'center',
			justifyContent:'center',
		},
		skeleton: {
			fontSize: "40px",
			width: "80%"
		},
		list: {
			padding: "0px",
			width: "100%"
		}
	}));
	const classes = useStyles();
	const BotContext = useBotContext();
	const [listItems, setListItems] = useState([]);
	const [boardCache, setBoardCache] = useState(null);

	const info = useArticleBoardInfoContext();

	let searchCache = useRef({});
	let selectedBoard = props.selectedBoard;
	let searchBoardText = props.searchBoardText;
	let setSelectedBoard = props.setSelectedBoard;

	useEffect(() => {
		async function getBoardInit() {
			let boards = ["hot", "favorite"];
			let newBC = {};
			try {
				for (let b of boards) {
					let query = BotContext.bot.select(Board).where("entry", b);
					let res = await BotContext.executeCommand({
						type: "select",
						arg: query
					});
					let lis = res.map((item, index) => {
						return (
							<BoardItem
								key={item.name}
								item={item}
								info={info}
								BotContext={BotContext}
							/>
						);
					});
					newBC[b] = lis;
				}
				setBoardCache(newBC);
				setSelectedBoard("hot");
			} catch (err) {
				console.error(err);
			}
		}
		// get board list at the beginning
		if (BotContext.botState.login) {
			console.log("initBoards");
			getBoardInit();
		}
	}, [BotContext.botState.login]);

	// set to hot init
	useEffect(() => {
		const getBoard = async () => {
			let lis;
			console.log("boardCache", boardCache);
			console.log("selectedBoard", selectedBoard);
			lis = boardCache[selectedBoard];
			console.log("lis", lis);
			setListItems(lis);
		};
		if (
			BotContext.botState.login &&
			boardCache &&
			selectedBoard.length > 0
		) {
			console.log("sb");
			getBoard();
		}
	}, [selectedBoard, boardCache, BotContext.botState.login]);

	useEffect(() => {
		const getBoard = async () => {
			let lis;
			let query;

			if (searchCache.current[searchBoardText]) {
				lis = searchCache.current[searchBoardText];
			} else {
				query = BotContext.bot
					.select(Board)
					.where("prefix", searchBoardText);
			}

			if (!lis) {
				let res = await BotContext.executeCommand({
					type: "select",
					arg: query
				});
				if (!res) return false;
				// generate list items
				lis = res.map((item, index) => {
					return (
						<BoardItem
							key={item.name}
							item={item}
							info={info}
							BotContext={BotContext}
						/>
					);
				});
				searchCache.current[searchBoardText] = lis;
			}
			setListItems(lis);
		};
		if (BotContext.botState.login && searchBoardText.length > 0) {
			console.log("sbt");
			getBoard();
		}
	}, [searchBoardText, BotContext.botState.login]);

	return (
		<Grid container component="main" className={classes.root}>
			<Grid item className={classes.skeleton}>
				{searchBoardText.length === 0 && listItems.length === 0 && (
					<Skeleton />
				)}
				{searchBoardText.length === 0 && listItems.length === 0 && (
					<Skeleton />
				)}
				{searchBoardText.length === 0 && listItems.length === 0 && (
					<Skeleton />
				)}
				{searchBoardText.length === 0 && listItems.length === 0 && (
					<Skeleton />
				)}
				{searchBoardText.length === 0 && listItems.length === 0 && (
					<Skeleton />
				)}
				{searchBoardText.length === 0 && listItems.length === 0 && (
					<Skeleton />
				)}
			</Grid>
			{listItems && <List className={classes.list}> {listItems} </List>}
			{!listItems && ""}
		</Grid>
	);
}
