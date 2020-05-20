import React, { useState } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { initArticle } from "./utils/article";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { submitSearch } from "./utils/search";

export default function ArticleItem(props) {
	let item = props.item;
	let info = props.info;
	let BotContext = props.BotContext;
	const [mouseState, setMouseState] = useState({
		mouseX: null,
		mouseY: null
	});
	const [preventLeftClick, setPreventLeftClick] = useState(false);
	const handleRightClick = e => {
		e.preventDefault();
		setMouseState({ mouseX: e.clientX - 2, mouseY: e.clientY - 4 });
		setPreventLeftClick(true);
	};
	const handleLeftClick = async e => {
		e.preventDefault();
		if (preventLeftClick) {
			setPreventLeftClick(false);
			return;
		}
		if (e.button === 0) {
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
		}
	};
	const handleCloseMenu = () => {
		setMouseState({
			mouseX: null,
			mouseY: null
		});
	};
	const handleClickSearch = async partialCriteria => {
		const criteria = { title: "", author: "", push: "", ...partialCriteria };
		try {
			await submitSearch(criteria, info, BotContext);
			handleCloseMenu();
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<ListItem
			onClick={handleLeftClick}
			onContextMenu={handleRightClick}
			button
			key={item.id}
			divider={true}
			style={{ height: "10vh" }}
		>
			<Menu
				id="simple-menu"
				keepMounted
				onClose={handleCloseMenu}
				anchorReference="anchorPosition"
				anchorPosition={
					mouseState.mouseY !== null && mouseState.mouseX !== null
						? {
								top: mouseState.mouseY,
								left: mouseState.mouseX
						  }
						: undefined
				}
				open={mouseState.mouseY !== null}
			>
				<MenuItem
					onClick={e =>
						handleClickSearch({
							boardname: item.boardname,
							title: item.title
						})
					}
				>
					搜尋同標題文章
				</MenuItem>
				<MenuItem
					onClick={e =>
						handleClickSearch({
							boardname: item.boardname,
							author: item.author
						})
					}
				>
					搜尋作者
				</MenuItem>
			</Menu>

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
							<Typography variant="body2" color="textSecondary">
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
