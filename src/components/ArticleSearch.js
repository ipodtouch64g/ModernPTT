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
            height: 'fit-content',
			backgroundColor: "rgba(0,0,0,0.1)"
		},
		goback: {
			width: "4vw",
			zIndex: 1001
        },
        buttoninfo: {
            top: '0',
            display: 'flex',
            width: '100%',
            position: 'absolute',
            justifyContent: 'space-between',
        }
	}));

	const classes = useStyles();
	const info = useArticleBoardInfoContext();
	const BotContext = useBotContext();

	const [articleListSearch, setArticleListSearch] = useState([]);
	const [articleItemsSearch, setArticleItemsSearch] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	// use iterator the first time
	useEffect(() => {
		const setList = async it => {
			let res = await it.next();
			//console.log(res);
			if (!res.done) {
				setArticleListSearch(res.value.reverse());
				setHasMore(true);
				info.setIndex(1);
			}
		};
		let it = info.articleSearchIterator;
		if (it) {
			setList(it);
		}
	}, [info.articleSearchIterator]);

	// generate items
	useEffect(() => {
		//console.log("articleListSearch", articleListSearch);
		if (articleListSearch.length > 0) {
			// generate list items
			let res = articleListSearch.map(item => {
				return ArticleItem({ item, info, BotContext });
			});

			setArticleItemsSearch(res);
			//console.log("hi res", res);
		}
	}, [articleListSearch]);

	const handleLoadMore = async () => {
		//console.log("hlm");
		// last id from current list
		let l_id = articleListSearch[articleListSearch.length - 1].id;
		//console.log("l_id", l_id);
		let it = info.articleSearchIterator;
		let res = await it.next();
		//console.log("hlm res", res);
		if (res.done) {
			setHasMore(false);
		} else {
			res = res.value.reverse();
			//console.log("res value", res);
			// generate list items
			let res_reduced = res.reduce((rtn, item) => {
				if (item.id < l_id) {
					rtn.push(item);
				}
				return rtn;
			}, []);
			//console.log("res_reduced", res_reduced);
			setArticleListSearch([...articleListSearch, ...res_reduced]);
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
						onClick={e => {
							info.setIndex(0);
                            info.setArticleSearchIterator(null);
                            // force bot to get back to index page
                            BotContext.executeCommand({type:'index'});
						}}
						className={classes.goback}
					>
						<ChevronLeftIcon />
					</IconButton>

					<Grid item className={classes.info}>
                        {info.criteria.boardname ? `看板：${info.criteria.boardname}` : ''}
                        {info.criteria.title ? `．標題：${info.criteria.title}` : ''}
                        {info.criteria.author ? `．作者：${info.criteria.author}` : ''}
                        {info.criteria.push ? `．讚數：${info.criteria.push}` : ''}
					</Grid>
				</Grid>

				<InfiniteScroll
					style={{ overflow: "inherit" }}
					scrollableTarget="scrollableDiv1"
					dataLength={articleItemsSearch.length} //This is important field to render the next data
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
					{articleItemsSearch}
				</InfiniteScroll>
			</Grid>
		);
	}
}
