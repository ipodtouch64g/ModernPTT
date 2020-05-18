import React, { useState, useEffect } from "react";
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { List, ListItem, ListItemText } from "@material-ui/core";
import SendComment from "./SendComment";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";
import { parseArticleLines } from "./utils/article";
import { useBotContext } from "./BotContext";
export default function ArticleDisplay(props) {
	const useStyles = makeStyles(theme => ({
		root: {
			alignItems: "center",
			height: "95vh",
			overflow: "auto"
		},
		skeleton: {
			fontSize: "40px",
			width: "80%"
		},
		top: {
			height: "20vh",
			borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
			marginTop: "12px",
			flexWrap: "nowrap",
			paddingLeft: "4vw"
		},
		goback: {
			width: "4vw",
			top: 0,
			position: "absolute",
			zIndex: 1001
		},
		info: {},
		titleText: {
			alignSelf: "center",
			flexBasis: "100%",
			flexGrow: "0",
			flexShrink: "0"
		},

		sendComment: {
			position: "absolute",
			bottom: 0,
			backgroundColor: theme.palette.background.paper
		},
		author: {
			alignSelf: "center"
		},

		scrollBottom: {
			paddingBottom: "12vh"
		},
		infScroll: {
			overflow: "inherit",
			paddingTop: 0,
			width: "100%",
			paddingLeft: "4vw",
			paddingRight: "2vw"
		}
	}));

	const info = useArticleBoardInfoContext();
	const article = info.article;
	const classes = useStyles();
	const BotContext = useBotContext();

	const ref = React.createRef();
	const [hasMore, setHasMore] = useState(true);
	// go back to top when load new article
	useEffect(() => {
		if (info.index === 2) {
			ref.current.scrollTop = 0;
		} else {
			// when exist article display always set hasmore = true
			// fix next article not load more bug
			console.log("exit display");
			setHasMore(true);
		}
	}, [info.index]);

	const handleLoadMore = async () => {
		// prevent default action
		// if (article.lines.length === 0) return;
		// call the iterator
		console.log("loadmore");

		try {
			performance.mark("iterator.next()");
			let res = await article.iterator.next();
			performance.mark("iterator.next() finished");
			console.log("res", res);
			// all loaded
			if (res.done) {
				setHasMore(false);
				return;
			}
			// parse lines
			res = res.value;
			// parse other lines
			performance.mark("parseLines");
			let parsed = parseArticleLines(
				res,
				article.commentStartFloor,
				article.lines.length
			);
			performance.mark("parseLines finished");
			let newLines = [...article.lines, ...parsed[0]];
			let newCommentStartFloor = parsed[1];
			console.log("article", article);
			console.log("newLines", newLines);
			console.log("newCommentStartFloor", newCommentStartFloor);
			performance.mark("setArticle");
			info.setArticle({
				...article,
				lines: newLines,
				commentStartFloor: newCommentStartFloor
			});
			performance.mark("setArticle finished");
			performance.measure(
				"iterator",
				"iterator.next()",
				"iterator.next() finished"
			);
			performance.measure(
				"parselines",
				"parseLines",
				"parseLines finished"
			);
			performance.measure(
				"setarticle",
				"setArticle",
				"setArticle finished"
			);
			performance.getEntriesByType("measure").forEach(e => {
				console.log(e);
			});

			performance.clearMarks();
			performance.clearMeasures();
			setHasMore(true);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Grid
			container
			ref={ref}
			component="main"
			id="scrollableDiv2"
			className={classes.root}
		>
			<CssBaseline />
			{info.index ? (
				<IconButton
					onClick={async () => {
						// scroll to top of this article: prevent reenter bug
						await BotContext.executeCommand({ type: "top" });
						// very important to get back to index
						await BotContext.executeCommand({ type: "index" });
						setHasMore(true);
						info.setIndex(
							info.articleSearchList.length > 0 ? 1 : 0
						);
					}}
					className={classes.goback}
				>
					<ChevronLeftIcon />
				</IconButton>
			) : (
				""
			)}
			<Grid container className={classes.top}>
				<Grid container className={classes.info}>
					<Typography className={classes.author} variant={"body1"}>
						{article.info.author}
					</Typography>

					<Typography variant={"h5"} className={classes.titleText}>
						{article.info.title}
					</Typography>

					<Typography className={classes.boardName} variant={"body2"}>
						{article.info.boardname}
					</Typography>
					<Typography className={classes.timestamp} variant={"body2"}>
						・{article.info.timestamp}
					</Typography>
				</Grid>
			</Grid>
			<InfiniteScroll
				className={classes.infScroll}
				scrollableTarget="scrollableDiv2"
				dataLength={article.lines.length} //This is important field to render the next data
				next={handleLoadMore}
				hasMore={hasMore}
				loader={
					<CircularProgress
						color="secondary"
						size={12}
						className={classes.loading}
					/>
				}
			>
				{article.lines}
			</InfiniteScroll>
			<Grid container className={classes.scrollBottom} />

			<Grid container className={classes.sendComment}>
				<SendComment setHasMore={setHasMore} />
			</Grid>
		</Grid>
	);
}
