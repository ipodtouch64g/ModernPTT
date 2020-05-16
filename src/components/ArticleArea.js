import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import ArticleDisplay from './ArticleDisplay';
import ArticleSelect from './ArticleSelect';
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
import ArticleSearch from "./ArticleSearch";


export default function ArticleArea() {
  const useStyles = makeStyles(theme => ({
		root: {
			width:'100%',
		},
		skeleton: {
			fontSize: "40px",
			width: "80%"
		},

  }));
  const info = useArticleBoardInfoContext(); 
  const classes = useStyles();

  const handleChangeIndex = (i) =>{
    info.setIndex(i);
  }
  return(
    <SwipeableViews index={info.index} onChangeIndex={handleChangeIndex} className={classes.root}>
      <ArticleSelect/>
      <ArticleSearch/>
      <ArticleDisplay/>
    </SwipeableViews>
    
  );
    
}