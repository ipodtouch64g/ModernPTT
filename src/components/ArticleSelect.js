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
import Backdrop from "@material-ui/core/Backdrop";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { useForm, Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { getArticleList } from "./utils/article";

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
			zIndex: theme.zIndex.drawer + 1
		},
		paper: {
			flexDirection: "column"
		},
		form: {
			width: "40vw",
			margin: "12px",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center"
		},
		button: {
			alignSelf: "flex-end",
			marginTop: "12px"
		},
		title: {
			alignSelf: "flex-start",
			width: "90%",
			margin: "12px"
		},
		author: {
			alignSelf: "flex-start",
			width: "90%",
			margin: "12px"
		},
		push: {
			alignSelf: "flex-start",
			width: "90%",
			margin: "12px"
		},
		closeIcon: {
			position: "absolute",
			margin: "12px"
		},
		saTitle: {
			textAlign: "center",
			margin: "24px"
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
	const { handleSubmit, control, errors } = useForm();
	// console.log(errors);
	const onSubmit = async values => {
		console.log(values);
		// search for matching articles
		let criteria = {
			boardname: info.boardName,
			title: values.title,
			author: values.author,
			push: values.push
		};
		try {
			let res = await getArticleList(BotContext,criteria);
			info.setArticleList(res);
			console.log(res)
			handleClickSearch();
		} catch (err) {
			console.log(err);
		}
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
						invisible={true}
					>
						<ClickAwayListener
							mouseEvent={isArticleSearchOpen ? "onClick" : false}
							onClickAway={handleClickSearch}
						>
							<Paper elevation={4} className={classes.paper}>
								<IconButton
									className={classes.closeIcon}
									onClick={handleClickSearch}
								>
									<CloseIcon />
								</IconButton>

								<Typography className={classes.saTitle}>
									搜尋文章
								</Typography>

								<Divider
									className={classes.divider}
									orientation="horizontal"
								/>
								<form
									onSubmit={handleSubmit(onSubmit)}
									className={classes.form}
									noValidate
									autoComplete="off"
								>
									<Controller
										className={classes.title}
										as={<TextField label="標題" />}
										name="title"
										control={control}
										defaultValue=""
									/>

									<Controller
										className={classes.author}
										as={<TextField label="作者" />}
										name="author"
										control={control}
										defaultValue=""
									/>

									<Controller
										className={classes.push}
										as={
											<TextField
												label="推數(大於多少)"
												helperText={
													errors.length > 0
														? "必須是數字"
														: ""
												}
												error={errors.length > 0}
											/>
										}
										rules={{
											pattern: {
												value: /[0-9]*/
											}
										}}
										name="push"
										control={control}
										defaultValue=""
									/>

									<Button
										variant="contained"
										color="primary"
										className={classes.button}
										type="submit"
									>
										送出
									</Button>
								</form>
							</Paper>
						</ClickAwayListener>
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
