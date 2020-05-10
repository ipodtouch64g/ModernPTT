import React ,{useState} from "react";
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
import LinearProgress from "@material-ui/core/LinearProgress";
import {refreshArticleComment} from './utils/article'
export default function SendComment(props) {
	const useStyles = makeStyles(theme => ({
		root: {
			width: "100%",
			paddingLeft: "4vw",
			paddingRight: "2vw",
			paddingTop: "12px",
			paddingBottom: "12px"
		},
		divider: {
			height: "100%",
			margin: 4
		},
		type: {
			flexBasis: "12%"
		},
		text: {
			flexBasis: "75%"
		},
		form: {
			width: "100%",
			display: "flex"
		},
		button: {
			height: "fit-content",
			flexBasis: "13%"
		}
	}));

	const info = useArticleBoardInfoContext();
	const article = info.articleContent;

	const classes = useStyles();
	const BotContext = useBotContext();

	const { handleSubmit, control } = useForm();
	// Todo : 1. 貼圖不要被切掉
    //        2. variable length
	const wordsPerLine = 25;
	const onSubmit = async values => {
		console.log(values);
        let text = values.text;
        // do not send empty str
        text = text.trim();
        if(text.length === 0) return;

		let arg = {
			type: values.type,
			text: "",
			boardName: article.info.boardname,
			aid: article.info.aid
		};
		let command = {
			type: "comment",
			arg: arg
		};
		var i = 0;
		for (i = 0; i < text.length / wordsPerLine; i++) {
			arg.text = text.substring(
				i * wordsPerLine,
				(i + 1) * wordsPerLine > text.length
					? text.length
					: (i + 1) * wordsPerLine
            );
            try {
                await BotContext.executeCommand(command);
            } catch(err) {
                console.log(err);
                return;
            }
        }
        // reload this article
        console.log('reload',article)
        try{
            let refreshArticleCommentRes = await refreshArticleComment(BotContext,{...article});
            info.setArticleContent(refreshArticleCommentRes);

        } catch(err) {
            console.log(err);
        }
        
        
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
					<InputLabel>推文類型</InputLabel>

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
			</form>
		</Grid>
	);
}
