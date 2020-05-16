import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {ListItem, ListItemText } from "@material-ui/core";


export default function ArticleContentItem(props) {
    const key = props.key;
    const text = props.text;
	
  
	
	return (
		<ListItem key={key} disableGutters={true} style={{whiteSpace: "pre"}}>
						<ListItemText primary={text} />
        </ListItem>
	);
}
