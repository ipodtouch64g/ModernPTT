import React from "react";
import {ListItem, ListItemText } from "@material-ui/core";


export default function ArticleCommentItem(commentLine) {
	return (
            <ListItem
                disableGutters={true}
                divider={true}
                key={commentLine.key}
            >
                {commentLine.type ? (
                    <ListItemText
                        style={{flexBasis: "5%"}}
                        primary={commentLine.type}
                    />
                ) : (
                    ""
                )}
                {commentLine.author ? (
                    <ListItemText
                        style={{flexBasis: "20%"}}
                        primary={commentLine.author}
                    />
                ) : (
                    ""
                )}

                <ListItemText
                    style={{flexBasis: "65%"}}
                    primary={commentLine.text}
                />
                {commentLine.timestamp ? (
                    <ListItemText
                        style={{flexBasis: "10%"}}
                        primary={commentLine.floor + "F"}
                        secondary={commentLine.timestamp}
                    />
                ) : (
                    ""
                )}
            </ListItem>
	);
}
