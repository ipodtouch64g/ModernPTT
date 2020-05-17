import React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import { initArticle } from "./utils/article";

export default function ArticleItem(props) {
	let item = props.item;
	let info = props.info;
	let BotContext = props.BotContext;

	const handleClick = async () => {
		// handle deleted article
		if (item.title.startsWith("(本文已被刪除)")) return;
		if (item.author.startsWith("-")) return;
		console.log("article item click:", info, item, BotContext);
		try {
			let article;
			// block load version
			// article = await parseArticle(item,BotContext);
			// iterator version
			performance.mark("handleClick");
			article = await initArticle(item, BotContext);
			console.log("article", article);
			performance.mark("setArticle");
			info.setIndex(2);
			info.setArticle(article);
			performance.measure("handleclick", "handleClick");
			performance.measure("setArticle", "setArticle");
			performance.getEntriesByType("measure").forEach(e => {
				console.log(e);
			});
			performance.clearMarks();
			performance.clearMeasures();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<ListItem
			onClick={handleClick}
			button
			key={item.id}
			divider={true}
			style={{ height: "10vh" }}
		>
			<ListItem
				style={{ flexBasis: "15%", flexGrow: "0", flexShrink: "0" }}
			>
				<ListItemText
					primary={
						<Typography
							variant="h5"
							color={
								Number(item.push) > 50
									? "error"
									: Number(item.push) > 10
									? "secondary"
									: Number(item.push) > 0
									? "primary"
									: "error"
							}
						>
							{item.push}
						</Typography>
					}
				/>
				{item.status === "R:" && (
					<ListItemText
						primary={
							<Typography
								variant="body2"
								color="textSecondary"
							>
								RE:
							</Typography>
						}
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

			
		</ListItem>
	);
}
