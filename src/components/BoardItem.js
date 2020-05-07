import React, { useState, useEffect, useCallback } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import { Article } from "ptt-client/dist/sites/ptt/model";
import ArticleItem from "./ArticleItem";

export default function BoardItem(props) {

	let item = props.item;
	let info = props.info;
	let BotContext = props.BotContext;

	const handleClick = async () =>{
		console.log('boardItem click',item,info,BotContext);
		// set articleList
		let query = BotContext.bot.select(Article).where('boardname', item.name);
		let res = await BotContext.executeCommand({type:"select",arg:query});
		if(!res) return false;
		console.log('handleclick',res)
		
		info.setArticleList(res);
		info.setBoardName(item.name)
		info.setIndex(0);
		return true;
	}

	return (
		<ListItem button onClick={handleClick} key={item.id} style={{height:"10vh"}}>
			<ListItemText
				primary={<Typography variant="body1">{item.name}</Typography>}
				secondary={
					<Typography variant="body2">{item.title}</Typography>
				}
			/>
			<ListItemIcon style={{justifyContent:'center'}}>
				<ChevronRightIcon />
			</ListItemIcon>
		</ListItem>
	);
}
