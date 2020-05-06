import React, { useState, useEffect } from "react";
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
import Skeleton from "react-loading-skeleton";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { List, ListItem, ListItemText } from "@material-ui/core";

export default function ArticleDisplay(props) {
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
		top: {
			height: "20vh",
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
		},
		goback: {
			left: 0,
			flexBasis: "10%",
			flexGrow: "0",
      flexShrink: "0",
      marginTop : "12px"
		},
		info: {
			flexBasis: "90%",
			flexGrow: "0",
			flexShrink: "0"
		},
		titleText: {
			alignSelf: "center",
			flexBasis: "100%",
			flexGrow: "0",
			flexShrink: "0"
		},
    content: {
      paddingLeft:"6vw",
      paddingRight:"4vw",
      borderBottom: '2px solid rgba(0, 0, 0, 0.12)',

    },
    comment: {
      
    },
    author:{
      alignSelf:"center",
    },
    clist:{
      width:"100%",
    },
    lit_type:{
      flexBasis: "5%",
			flexGrow: "0",
      flexShrink: "0",

    },
    lit_author:{
      flexBasis: "15%",
			flexGrow: "0",
			flexShrink: "0"
    },
    lit_texxt:{
      flexBasis: "65%",
			flexGrow: "0",
			flexShrink: "0"
    },
    lit_timestamp:{
      flexBasis: "15%",
			flexGrow: "0",
			flexShrink: "0"
    }
    
	}));

	const info = useArticleBoardInfoContext();
	useEffect(() => {}, [info.articleContent]);
  const article = info.articleContent;
  const classes = useStyles();

	// Todo : image
	const genContentList = content => {
		if (content) {
			let res = content.map(item => {
				return <Typography variant={"body1"}>{item}</Typography>;
			});
			return res;
		}
		return "";
	};

	const genCommentList = comment => {
		if (comment) {
			let res = comment.map(item => {
				return (
					<ListItem divider = {true} disableGutters = {true} className={classes.lit}>
						<ListItemText className={classes.lit_type}>{item.type}</ListItemText>
						<ListItemText className={classes.lit_author}>{item.author}</ListItemText>
						<ListItemText className={classes.lit_text}>{item.text}</ListItemText>
						<ListItemText className={classes.lit_timestamp}>{item.timestamp}</ListItemText>
					</ListItem>
				);
			});
			return <List className={classes.clist}>{res}</List>;
		}
		return "";
	};

	let setIndex = props.setIndex;
	
	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid container className={classes.top}>
				<IconButton
					onClick={e => {
						setIndex(0);
					}}
					className={classes.goback}
				>
				<ChevronLeftIcon/>
        </IconButton>

				<Grid container className={classes.info}>
          <Typography className={classes.author} variant={"body1"}>{article.author}</Typography>
          
					<Typography variant={"h5"} className={classes.titleText}>
						{article.title}
					</Typography>
			
					<Typography className={classes.boardName} variant={"body2"}>
						{article.boardname}
					</Typography>
          <Typography className={classes.timestamp} variant={"body2"}>
						・{article.timestamp}
					</Typography>
          <Typography className={classes.ip} variant={"body2"}>
          ・來自：{article.ip}
            </Typography>

				</Grid>
			</Grid>
			<Grid container className={classes.content}>{genContentList(article.content)}</Grid>

			<Grid container className={classes.comment}>{genCommentList(article.comment)}</Grid>
		</Grid>
	);
}
