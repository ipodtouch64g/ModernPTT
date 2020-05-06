import React, { useState, useEffect, useCallback } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import { Article } from "ptt-client/dist/sites/ptt/model";

export default function ArticleItem(props) {
	let item = props.item;
	let info = props.info;
	let BotContext = props.BotContext;
	let setIndex = props.setIndex;

	const parseArticle = article => {
		let articleContent = {
			author: article.author,
			boardname: article.boardname,
			timestamp: article.timestamp,
			content: [],
			ip: "",
			comment: [],
			title: article.title,
		};
		let content = article.content;
		// content starts from index 4
		for(let i=4,state=0;i<content.length;i++) {
			let s = content[i].str; 
			if(state===0){
				if(s.startsWith("※ 發信站: 批踢踢實業坊(ptt.cc)")) {
					state = 1;
					articleContent.ip = s.substring(27);
					i++;
				} else {
					articleContent.content.push(s);
				}
			} else {
				// type : '推','噓','→'
				let commentLine = {type:"",author:"",text:"",timestamp:""};
				// find out whether it is a normal comment
				if(s.match(/[推噓→] [\w\d]+: .+/)) {
					commentLine.type = s[0];
					commentLine.timestamp = s.substring(s.length-11);
					let ss = s.split(":");
					commentLine.author = ss[0].substring(2);
					commentLine.text = ss[1].substring(1,ss[1].length-11);
				} else {
					commentLine.text = s;
				}
				articleContent.comment.push(commentLine);
			}
		}
		return articleContent
	};

	const handleClick = async () => {
		console.log("article item click:", info, item, BotContext);
		let query = BotContext.bot
			.select(Article)
			.where("boardname", item.boardname)
			.where("id", item.id);
		let res = await BotContext.executeCommand({
			type: "content",
			arg: query
		});
		if (!res) return false;
		console.log("handleclick", res);
		// parse article
		info.setArticleContent(parseArticle(res));
		// info.setArticleContent((res));
		setIndex(1);
		return true;
	};

	return (
		<ListItem
			onClick={handleClick}
			button
			key={item.id}
			divider={true}
			style={{ height: "9vh" }}
		>
			<ListItem
				style={{ flexBasis: "15%", flexGrow: "0", flexShrink: "0" }}
			>
				<ListItemText
					primary={
						<Typography variant="body2">{item.push}</Typography>
					}
				/>
				{item.status === "R:" && (
					<ListItemText
						primary={<Typography variant="body2">RE:</Typography>}
						style={{ textAlign: "right" }}
					/>
				)}
			</ListItem>

			<ListItemText
				primary={<Typography variant="body1">{item.title}</Typography>}
				secondary={
					<Typography variant="body2">{item.author}</Typography>
				}
				style={{ flexBasis: "60%", flexGrow: "0", flexShrink: "0" }}
			/>
			<ListItemText
				primary={<Typography variant="body2">{item.date}</Typography>}
				secondary={
					<Typography variant="body2">id:{item.id}</Typography>
				}
			/>

			<ListItemIcon style={{ justifyContent: "center" }}>
				<ChevronRightIcon />
			</ListItemIcon>
		</ListItem>
	);
}
