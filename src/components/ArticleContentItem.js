import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem, ListItemText } from "@material-ui/core";
import Image from "material-ui-image";

export default function ArticleContentItem(props) {
	const key = props.key;
	const text = props.text;
	// very rough!
	const textImage = text => {
		let r = text.match(/imgur.com\/[0-9a-zA-Z]{7}/);
		// should proper place image
		if (r)
			return (
				
					<Image
						style={{backgroundColor:'none',position:'initial'}}
						imageStyle={{ maxWidth: "75%", height: "auto", }}
						src={"https://" + r[0] + ".jpg"}
					/>
				
			);
		else return <ListItemText>{text}</ListItemText>;
	};

	return (
		<ListItem key={key} disableGutter={true} style={{ whiteSpace: "pre" }}>
			{textImage(text)}
		</ListItem>
	);
}
