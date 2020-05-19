import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import Image from "material-ui-image";

export default function ArticleText(props) {

	const text = props.text;
	const maxWidth = props.maxWidth;
	let t = text;
	let ti = (
		<ListItemText style={{ whiteSpace: "pre-wrap" }}>{t}</ListItemText>
	);

	// url
	let url = text.match(
		/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
	);
	// change text if hyperlink exists
	if (url) {
		let hyperlink = (
			<a
				style={{ color: "#ffffff", marginLeft: '-4px' }}
				href={url[0]}
				target="_blank"
				rel="noopener noreferrer"
			>
				{url[0]}
			</a>
		);
		ti = (
			<ListItemText style={{ whiteSpace: "pre-wrap" }}>
				{t.substring(0, t.indexOf(url[0]))} {hyperlink}{" "}
				{t.substring(t.indexOf(url[0]) + url[0].length)}
			</ListItemText>
		);
	}

	// url image
	const imgType = [".jpg", ".gif", ".png"];
	let img;
	if (url && imgType.indexOf(url[0].slice(-4)) === 0) img = url[0];

	// imgur with no extension
	let imgur = text.match(/imgur.com\/[0-9a-zA-Z]{7}/);
	// Issue: we have no idea what the extension will be.
	if (imgur) img = "https://" + imgur[0] + ".jpg";
	// console.log("url", url, "img", img, "t", t);
	// should proper place image
	if (img) {
		return (
			<ListItem
				disableGutters={true}
				style={{
					whiteSpace: "pre",
					display: "flex",
					flexDirection: "column",
					width: maxWidth,
					overflow: "hidden",
					height: "auto",
					alignItems: "flex-start"
				}}
			>
				{ti}
				<Image
					style={{
						backgroundColor: "none"
					}}
					imageStyle={{ width: maxWidth, height: "auto" }}
					src={img}
				/>
			</ListItem>
		);
	} else {
		return (
			<ListItem
				disableGutters={true}
				style={{ whiteSpace: "pre" }}
			>
				{ti}
			</ListItem>
		);
	}
}
