import React, { useState, useEffect, useCallback } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import {getArticleList} from './utils/article'

export default function BoardItem(props) {
	let item = props.item;
	let info = props.info;
	let BotContext = props.BotContext;

	const handleClick = async () => {
		//console.log("boardItem click", item, info, BotContext);
		try {
			let res = await getArticleList(BotContext,item.name);
			info.setArticleList(res);
			info.setBoardName(item.name);
			info.setIndex(0);
			// clear search
			info.setArticleSearchIterator(null);
		}catch(err) {
			console.error(err);
		}
		
	};

	return (
		<ListItem
			button
			onClick={handleClick}
			key={item.name}
			style={{ height: "10vh" }}
		>
			<ListItemText
				primary={<Typography variant="body1">{item.name}</Typography>}
				secondary={
					<Typography variant="body2">{item.title}</Typography>
				}
			/>
			<ListItemIcon style={{ justifyContent: "center" }}>
				<ChevronRightIcon />
			</ListItemIcon>
		</ListItem>
	);
}
