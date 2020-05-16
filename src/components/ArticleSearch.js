import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
import { useBotContext } from "./BotContext";
import CssBaseline from "@material-ui/core/CssBaseline";
import ArticleItem from "./ArticleItem";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";

import IconButton from "@material-ui/core/IconButton";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { getArticleList } from "./utils/article";

export default function ArticleSearch(props) {
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
			height: "fit-content",
			backgroundColor: "rgba(0,0,0,0.1)"
		},
		goback: {
			width: "4vw",
			zIndex: 1001
		},
		buttoninfo: {
			top: "0",
			display: "flex",
			width: "100%",
			position: "absolute",
			justifyContent: "space-between"
		}
	}));

	const classes = useStyles();
	const info = useArticleBoardInfoContext();
	const BotContext = useBotContext();

	const [articleItems, setArticleItems] = useState([]);

	const hasMore = () => {
		return (
			info.articleSearchList.length > 0 &&
			info.articleSearchList[info.articleSearchList.length - 1].id > 1
		);
	};

	// generate items
	useEffect(() => {
		////console.log("articleListSearch", articleListSearch);
		if (info.articleSearchList.length > 0) {
			// generate list items
			let res = info.articleSearchList.map(item => {
				return ArticleItem({
					item,
					info,
					BotContext
				});
			});

			setArticleItems(res);
			////console.log("hi res", res);
		}
	}, [info.articleSearchList]);

	const handleLoadMore = async () => {
		////console.log("hlm");
		// last id from current list
		let l_id = info.articleSearchList[info.articleSearchList.length - 1].id;
		////console.log("l_id", l_id);
		//console.log(values);
		// search for matching articles
		let criteria = info.criteria;
		criteria.id = l_id;
		try {
			let res = await getArticleList(BotContext, criteria);
			
			//console.log("res value", res);
			// generate list items
			let res_reduced = res.reduce((rtn, item) => {
				if (item.id < l_id) {
					rtn.push(item);
				}
				return rtn;
			}, []);
			info.setArticleSearchList([
				...info.articleSearchList,
				...res_reduced
			]);
		} catch (err) {
			console.error(err);
		}
	};

	if (info.index !== 1) return null;
	else {
		return (
			<Grid
				container
				component="main"
				className={classes.root}
				id="scrollableDiv1"
			>
				<CssBaseline />
				<Grid className={classes.buttoninfo} item>
					<IconButton
						onClick={async (e) => {
							// force bot to get back to index page
							await BotContext.executeCommand({ type: "index" });
							info.setIndex(0);
                            info.setArticleSearchList([]);
                            info.setCriteria({});
						}}
						className={classes.goback}
					>
						<ChevronLeftIcon />
					</IconButton>

					<Grid item className={classes.info}>
						{info.criteria.boardname
							? `看板：${info.criteria.boardname}`
							: ""}
						{info.criteria.title
							? `．標題：${info.criteria.title}`
							: ""}
						{info.criteria.author
							? `．作者：${info.criteria.author}`
							: ""}
						{info.criteria.push
							? `．讚數：${info.criteria.push}`
							: ""}
					</Grid>
				</Grid>

				<InfiniteScroll
					style={{ overflow: "inherit" }}
					scrollableTarget="scrollableDiv1"
					dataLength={articleItems.length} //This is important field to render the next data
                    next={handleLoadMore}
                    scrollThreshold={0.5}
					hasMore={hasMore()}
					loader={
						<CircularProgress
							color="secondary"
							size={12}
							className={classes.loading}
						/>
					}
				>
					{articleItems}
				</InfiniteScroll>
			</Grid>
		);
	}
}
