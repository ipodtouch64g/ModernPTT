import React, { useState } from "react";
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
import { useBotContext } from "./BotContext";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { useForm, Controller } from "react-hook-form";
import InputLabel from "@material-ui/core/InputLabel";
import { CircularProgress } from "@material-ui/core";

import { refreshArticleComment } from "./utils/article";
export default function SendComment(props) {
	const useStyles = makeStyles(theme => ({
		root: {
			width: "100%",
			paddingLeft: "4vw",
			paddingRight: "2vw",
			paddingBottom: "12px",
			paddingTop:'12px',
			minHeight: '12vh'
		},
		divider: {
			height: "100%",
			margin: 4
		},
		type: {
			flexBasis: "10%"
		},
		text: {
			flexBasis: "75%"
		},
		form: {
			width: "100%",
			display: "flex"
		},
		button: {
			fontSize: "0.6rem",
			height: "fit-content",
			flexBasis: "10%",
			alignSelf: "center"
		},
		sending: {
			flexBasis: "5%",
			alignSelf: "center",
			marginLeft: "4px"
		},
		lp: {
			width: "100%"
		}
	}));

	const info = useArticleBoardInfoContext();
	const article = info.article;
	const setHasMore = props.setHasMore;
 	const classes = useStyles();
	const BotContext = useBotContext();
	const [isSending, setIsSending] = useState(false);
	const { handleSubmit, control } = useForm();
	// Todo : 1. 貼圖不要被切掉
	//        2. variable length

	const onSubmit = async values => {
		//console.log(values);
		let text = values.text;
		// do not send empty str
		text = text.trim();
		if (text.length === 0) return;
		setIsSending(true);
		
		let arg = {
			type: values.type,
			text: text,
			boardName: article.info.boardname,
			aid: article.info.aid
		};

		try {
			await article.sendComment(arg,BotContext.bot);
			article.iterator.reset();
			info.setArticle({
				...article,
				lines: [],
				commentStartFloor: 1,
			});
			setHasMore(true);
		} catch (err) {
			console.error(err);
			return;
		}

		setIsSending(false);
	};

	return (
		<Grid container component="main" className={classes.root}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={classes.form}
				noValidate
				autoComplete="off"
			>
				<FormControl className={classes.type}>
					<InputLabel>類型</InputLabel>

					<Controller
						as={
							<Select>
								<MenuItem value={"1"}>推</MenuItem>
								<MenuItem value={"2"}>噓</MenuItem>
								<MenuItem value={"3"}>→</MenuItem>
							</Select>
						}
						name="type"
						rules={{ required: "this is required" }}
						control={control}
						defaultValue="1"
					/>
				</FormControl>

				<Divider className={classes.divider} orientation="vertical" />
				<Controller
					className={classes.text}
					as={<TextField label="內容" multiline />}
					rules={{ required: true }}
					name="text"
					control={control}
					defaultValue=""
				/>
				<Button
					variant="contained"
					color="primary"
					className={classes.button}
					endIcon={<PlayArrowIcon />}
					type="submit"
				>
					送出
				</Button>
				<Grid item className={classes.sending}>
					{isSending && <CircularProgress size={"1rem"} />}
				</Grid>
			</form>
		</Grid>
	);
}
