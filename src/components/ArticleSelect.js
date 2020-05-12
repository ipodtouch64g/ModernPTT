import React, { useState, useEffect, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
import { useBotContext } from "./BotContext";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Article } from "ptt-client/dist/sites/ptt/model";
import ArticleItem from "./ArticleItem";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import SearchIcon from "@material-ui/icons/Search";
import Grow from "@material-ui/core/Grow";
import ArticleSearch from "./ArticleSearch";
import Backdrop from "@material-ui/core/Backdrop";

export default function ArticleSelect(props) {
	const useStyles = makeStyles(theme => ({
		root: {
			alignItems: "center",
			justifyContent: "center",
			maxHeight: "90vh",
			height: "90vh",
			overflow: "auto"
		},
		skeleton: {
			fontSize: "40px",
			width: "80%"
		},
		info: {
			position: "absolute",
			right: "0",
			backgroundColor: "rgba(0,0,0,0.1)"
		},
		searchFab: {
			position: "absolute",
			right: "1vw",
			bottom: "1vh",
			zIndex: "1001"
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			backgroundColor : 'unset'
		}
	}));

	const classes = useStyles();
	const info = useArticleBoardInfoContext();
	const BotContext = useBotContext();
	const [isArticleSearchOpen, setIsArticleSearchOpen] = useState(false);
	const [articleItems, setArticleItems] = useState([]);

	useEffect(() => {
		if (info.articleList.length > 0) {
			// generate list items
			let res = info.articleList.map(item => {
				return ArticleItem({ item, info, BotContext });
			});
			setArticleItems(res);
		}
	}, [info]);
	const handleClickSearch = () => {
		setIsArticleSearchOpen(isArticleSearchOpen => !isArticleSearchOpen);
	};
	const handleLoadMore = () => {
		// prevent default action
		if (info.articleList.length === 0) return;

		console.log("handleLoadMore", info);
		let offset = info.articleList[info.articleList.length - 1].id;
		let query = BotContext.bot
			.select(Article)
			.where("boardname", info.boardName)
			.where("id", offset);
		BotContext.executeCommand({
			type: "select",
			arg: query
		}).then(res => {
			console.log("res", res);
			if (!res) return false;
			// generate list items
			let res_reduced = res.reduce((rtn, item) => {
				if (item.id < offset) {
					rtn.push(item);
				}
				return rtn;
			}, []);
			info.setArticleList([...info.articleList, ...res_reduced]);
		});
	};

	return (
		<Grid
			container
			component="main"
			className={classes.root}
			id="scrollableDiv"
		>
			<CssBaseline />

			<Grid item className={classes.skeleton}>
				{info.articleList.length === 0 && <Skeleton count={3} />}
			</Grid>
			{info.articleList.length > 0 && (
				<Grid container>
					<Backdrop
						className={classes.backdrop}
						open={isArticleSearchOpen}
					>
						<ArticleSearch className={classes.articleSearch} />
					</Backdrop>

					<Grid item className={classes.info}>
						看板：{info.boardName}
					</Grid>

					<Fab color="secondary" className={classes.searchFab}>
						<SearchIcon onClick={handleClickSearch} />
					</Fab>
					<InfiniteScroll
						style={{ overflow: "inherit" }}
						scrollableTarget="scrollableDiv"
						dataLength={articleItems.length} //This is important field to render the next data
						next={handleLoadMore}
						hasMore={true}
						loader={
							<CircularProgress
								color="secondary"
								size={12}
								className={classes.loading}
							/>
						}
						endMessage={
							<p style={{ textAlign: "center" }}>
								<b>Yay! You have seen it all</b>
							</p>
						}
					>
						{articleItems}
					</InfiniteScroll>
				</Grid>
			)}
		</Grid>
	);
}
