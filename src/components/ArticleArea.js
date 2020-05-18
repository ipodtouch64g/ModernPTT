import React from "react";
import { makeStyles } from '@material-ui/core/styles';

import SwipeableViews from 'react-swipeable-views';
import ArticleDisplay from './ArticleDisplay';
import ArticleSelect from './ArticleSelect';
import { useArticleBoardInfoContext } from "./ArticleBoardInfoContext";
import ArticleSearch from "./ArticleSearch";


export default function ArticleArea() {
  const useStyles = makeStyles(theme => ({
		root: {
      width:'100%',
      height:"95vh",
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