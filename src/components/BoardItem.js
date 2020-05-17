import React, { useState, useEffect, useCallback } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { getArticleList } from "./utils/article";
import { useTheme } from '@material-ui/core/styles';

const BoardItem = props => {
	let item = props.item;
	let info = props.info;
	let BotContext = props.BotContext;
	const theme = useTheme();
	const handleClick = async e => {
		//console.log("boardItem click", item, info, BotContext);
		try {
			let criteria = { boardname: item.name };
			info.setArticleList([]);
			info.sethaveSelectBoard(true);
			// scroll to top of this article: prevent reenter bug
			await BotContext.executeCommand({ type: "top" });
			// very important to get back to index
			await BotContext.executeCommand({ type: "index" });
			let res = await getArticleList(BotContext, criteria);

			info.setArticleList(res);
			info.setBoardName(item.name);
			info.setIndex(0);
			info.setCriteria({});
			// clear search
			info.setArticleSearchList([]);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<ListItem
			button
			onClick={handleClick}
			key={item.name}
			style={{
				borderLeft: "solid",
				borderLeftColor:
					item.users === "爆!"
						? theme.palette.error.dark
						: item.users === "HOT"
						? theme.palette.secondary.dark
						: theme.palette.primary.dark,
				borderLeftWidth:'6px',
			}}
			divider={true}
		>
			<ListItemText
				primary={<Typography variant="body1">{item.name}</Typography>}
				secondary={
					<Typography variant="body2">{item.title}</Typography>
				}
			/>

		</ListItem>
	);
};

export default BoardItem;
