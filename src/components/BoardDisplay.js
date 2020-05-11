import React, { useState, useEffect, useCallback } from "react";
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
			alignItems : 'center',
			justifyContent : 'center',
			maxHeight: "80vh",
			height: "80vh",
			overflow: "auto"
		},
		skeleton: {
			fontSize: "40px",
			width: "80%"
		},
		list: {
			padding: "0px"
		}
	}));
	const classes = useStyles();
	const { user } = useUserContext();
	const BotContext = useBotContext();
	const [listItems, setListItems] = useState([]);
	
	const info = useArticleBoardInfoContext();

	let selectedBoard = props.selectedBoard;

	const getBoardCallback = useCallback(async () => {
		
		// Todo : 	1. support more boards 
		console.log('getBoardCallback()');

		let query =
			selectedBoard === "hot"
				? BotContext.bot.select(Board).where("entry", "hot")
				: BotContext.bot.select(Board).where("entry", "favorite");
		let t1 = performance.now();
		let res = await BotContext.executeCommand({type:"select",arg:query});
		let t2 = performance.now();
		console.log('bot select board',t2-t1)
		if(!res) return false;
		console.log(res)
		// generate list items
		let lis = res.map(item => {
			return BoardItem({item,info,BotContext});
		});
		let t3 = performance.now();
		console.log('map boardItem',t3-t2)
		setListItems(lis);
		

	}, [BotContext, setListItems,selectedBoard, info]);

	useEffect(() => {
		async function getBoard() {
			return await getBoardCallback(user);
		}
		// get board list at the beginning
		if (BotContext.botState.login) {
			console.log(selectedBoard)
			getBoard();
		}
	}, [BotContext.botState.login, selectedBoard]);

	return (
		<Grid container component="main" className={classes.root}>
			<Grid item className={classes.skeleton}>
				{listItems.length === 0 && <Skeleton count={6} />}
			</Grid>
			{listItems && <List className={classes.list}> {listItems} </List>}
		</Grid>
	);
}
