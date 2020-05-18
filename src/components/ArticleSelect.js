import React, { useState, useEffect, useCallback } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
import { useBotContext } from "./BotContext";
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
import { useProgressContext } from "./ProgressContext";
import Slide from "@material-ui/core/Slide";

export default function ArticleSelect(props) {
	const useStyles = makeStyles(theme => ({
		root: {
			alignItems: "center",
			justifyContent: "center",
			overflow: "auto",
			height: "95vh",
		},
		skeleton: {
			fontSize: "40px",
			width: "80%",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center"
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
		},
		list: {
			width: "100%"
		}
	}));

	const classes = useStyles();
	const info = useArticleBoardInfoContext();
	const BotContext = useBotContext();
	const [isArticleSearchFormOpen, setIsArticleSearchFormOpen] = useState(
		false
	);

	const [articleItems, setArticleItems] = useState([]);

	const { setIsSnackbarOpen, setSnackbarContent } = useProgressContext();

	useEffect(() => {
		if (info.articleList.length > 0) {
			// generate list items
			let res = info.articleList.map(item => {
				return ArticleItem({ item, info, BotContext });
			});
			setArticleItems(res);
		}
	}, [info]);

	const toggleSearchForm = () => {
		setIsArticleSearchFormOpen(
			isArticleSearchFormOpen => !isArticleSearchFormOpen
		);
	};
	const { handleSubmit, control, errors } = useForm();

	const onSubmitSearch = async values => {
		//console.log(values);
		// search for matching articles
		let criteria = {
			boardname: info.boardName,
			title: values.title,
			author: values.author,
			push: values.push
		};
		info.setCriteria(criteria);
		try {
			let res = await getArticleList(BotContext, criteria);
			console.log(res);
			if (res.length > 0) {
				info.setArticleSearchList(res);
				info.setIndex(1);
			} else {
				setIsSnackbarOpen(true);
				setSnackbarContent({
					severity: "error",
					text: "搜尋不到東西！"
				});
				info.setCriteria({});
			}
			toggleSearchForm();
		} catch (err) {
			console.error(err);
		}
	};

	const handleLoadMore = () => {
		// prevent default action
		if (info.articleList.length === 0) return;

		//console.log("handleLoadMore", info);
		let offset = info.articleList[info.articleList.length - 1].id;
		let query = BotContext.bot
			.select(Article)
			.where("boardname", info.boardName)
			.where("id", offset);
		BotContext.executeCommand({
			type: "select",
			arg: query
		}).then(res => {
			//console.log("res", res);
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
			<Slide direction="down" in={info.articleList.length === 0}>
				{info.articleList.length === 0 ? (
					<Grid item className={classes.skeleton}>
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
					</Grid>
				) : (
					<div></div>
				)}
			</Slide>

			<Slide
				direction="up"
				in={info.articleList.length > 0}
				className={classes.list}
			>
				{info.articleList.length > 0 ? (
					<Grid container className={classes.list}>
						<Backdrop
							className={classes.backdrop}
							open={isArticleSearchFormOpen}
							invisible={true}
						>
							<ClickAwayListener
								mouseEvent={
									isArticleSearchFormOpen ? "onClick" : false
								}
								onClickAway={toggleSearchForm}
							>
								<Paper elevation={4} className={classes.paper}>
									<IconButton
										className={classes.closeIcon}
										onClick={toggleSearchForm}
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
										onSubmit={handleSubmit(onSubmitSearch)}
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
													value: /\b\d{0,6}\b/
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
							<SearchIcon onClick={toggleSearchForm} />
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
						>
							{articleItems}
						</InfiniteScroll>
					</Grid>
				) : (
					<div></div>
				)}
			</Slide>
		</Grid>
	);
}
