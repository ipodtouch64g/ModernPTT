import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import ArticleDisplay from './ArticleDisplay';
import ArticleSelect from './ArticleSelect';


export default function ArticleArea() {
  const useStyles = makeStyles(theme => ({
		root: {
			maxHeight: "80vh",
			height: "40vh",
			overflow: "auto"
		},
		skeleton: {
			fontSize: "40px",
			width: "80%"
		},

	}));
  const classes = useStyles();
  const [index,setIndex] = useState(0);
  const handleChangeIndex = (i) =>{
    setIndex(i);
  }
  return(
    <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
      <ArticleSelect setIndex={setIndex}/>
      <ArticleDisplay setIndex={setIndex}/>
    </SwipeableViews>
    
  );
    
}