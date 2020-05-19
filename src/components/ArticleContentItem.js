import React from "react";
import ArticleText from './ArticleText'
export default function ArticleContentItem(props) {
	const text = props.text;
	const myKey = props.key;
	return (<ArticleText key={myKey} maxWidth={"50vw"} text={text}/>)
}
