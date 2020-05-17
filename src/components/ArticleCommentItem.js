import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

 const ArticleCommentItem = (props) => {
    const theme = useTheme();
    let commentLine = props.commentLine;
	return (
		<ListItem disableGutters={true} divider={true} key={commentLine.key}>
			{commentLine.type ? (
				<ListItemText
					style={{
						flexBasis: "5%",
						color:
							commentLine.type === "噓"
								? theme.palette.error.dark
								: commentLine.type === "推"
								? theme.palette.primary.dark
								: theme.palette.secondary.dark
					}}
                    primary={commentLine.type}
				/>
			) : (
				""
			)}
			{commentLine.author ? (
				<ListItemText
					style={{ flexBasis: "20%" }}
					primary={commentLine.author}
				/>
			) : (
				""
			)}

			<ListItemText
				style={{ flexBasis: "65%" }}
				primary={commentLine.text}
			/>
			{commentLine.timestamp ? (
				<ListItemText
					style={{ flexBasis: "10%" }}
					primary={commentLine.floor + "F"}
					secondary={commentLine.timestamp}
				/>
			) : (
				""
			)}
		</ListItem>
	);
}
export default ArticleCommentItem