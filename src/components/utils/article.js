import { Article as ArticleModel } from "ptt-client/dist/sites/ptt/model";
import { URL2AID } from "./decode";
import ArticleCommentItem from "../ArticleCommentItem";
import ArticleContentItem from "../ArticleContentItem";
import React from "react";
const initArticle = async (articleItem, BotContext) => {
	try {
		let article = {
			info: {
				id: "",
				aid: "",
				author: "",
				boardname: "",
				timestamp: "",
				title: "",
				ip: ""
			},
			lines: [],
			iterator: null,
			sendComment: null
		};
		article.info.boardname = articleItem.boardname;
		article.info.id = articleItem.id;
		article.info.title = articleItem.title;
		article.info.author = articleItem.author;

		let res = await getArticleResponseIterator(BotContext, article);

		// call the iterator to get info first
		article.iterator = res.iterator;
		let firstPartOfContent = await article.iterator.next();
		firstPartOfContent = firstPartOfContent.value;
		// parse header
		if (
			firstPartOfContent.length > 0 &&
			firstPartOfContent[0].str.includes("作者")
		) {
			article.info.author = firstPartOfContent[0].str
				.substring(4, 50)
				.trim();
			article.info.timestamp = firstPartOfContent[2].str
				.substring(3)
				.trim();
			// get rid of first four lines
			firstPartOfContent = firstPartOfContent.slice(4);
		}
		// parse other lines
		[article.lines, article.commentStartFloor] = parseArticleLines(
			firstPartOfContent,
			1,
			0
		);

		article.sendComment = res.sendComment;
		return article;
	} catch (err) {
		return Promise.reject(err);
	}
};

const getArticleResponseIterator = async (BotContext, article) => {
	let query = BotContext.bot
		.select(ArticleModel)
		.where("boardname", article.info.boardname)
		.where("author", article.info.author)
		.where("title", article.info.title)
		.where("id", article.info.id);
	console.log("q", query);

	let res = await BotContext.executeCommand({
		type: "contentIterator",
		arg: query
	});
	if (!res) return Promise.reject("getArticleResponse err.");
	console.log(res);
	return res;
};



const parseArticle = async (articleItem, BotContext) => {
	try {
		let article = {
			info: {
				id: "",
				aid: "",
				author: "",
				boardname: "",
				timestamp: "",
				commentStartIndex: -1,
				title: "",
				ip: ""
			},
			content: [],
			comment: []
		};
		article.info.boardname = articleItem.boardname;
		article.info.id = articleItem.id;
		article.info.title = articleItem.title;
		article.info.author = articleItem.author;
		let res = await getArticleResponse(BotContext, article);

		article.info.aid = "";

		article.info.timestamp = res.timestamp;
		article.info.commentStartIndex = -1;
		article.info.title = res.title;
		article.info.ip = "";
		article.content = [];
		article.comment = [];
		parseArticleInfoAndContent(res, article);
		parseArticleComment(res, article);
		// //console.log(article);
		return article;
	} catch (err) {
		return Promise.reject(err);
	}
};

const getArticleResponse = async (BotContext, article) => {
	let query = BotContext.bot
		.select(ArticleModel)
		.where("boardname", article.info.boardname)
		.where("author", article.info.author)
		.where("title", article.info.title);
	console.log("q", query);

	let res = await BotContext.executeCommand({
		type: "content",
		arg: query
	});
	if (!res) return Promise.reject("getArticleResponse err.");
	console.log(res);
	return res;
};

// Start from top.
const parseArticleInfoAndContent = (res, article) => {
	let content = res.content;
	// content starts from index 4
	for (let i = 4; i < content.length; i++) {
		let s = content[i].str;
		if (s.startsWith("※ 發信站: 批踢踢實業坊(ptt.cc)")) {
			article.info.ip = s.substring(27);
			// next line should be "※ 文章網址: https://www.ptt.cc/bbs/Test/M.1588897271.A.57F.html"
			if (
				i + 1 < content.length &&
				content[i + 1].str.startsWith("※ 文章網址: ")
			) {
				// parse as AID
				let aidLine = content[++i].str;
				let url = aidLine.substring(aidLine.indexOf(":") + 2);
				const [board, AID] = URL2AID(url);
				article.info.aid = AID;
				article.info.commentStartIndex = i + 1;
				break;
			}
		} else {
			article.content.push(s);
		}
	}
};
// Starts from top.
// Todo : check commentStartIndex is correct.
const parseArticleComment = (res, article) => {
	if (article.info.commentStartIndex === -1) return;

	let content = res.content;
	// clear all comment
	article.comment = [];

	for (
		var i = article.info.commentStartIndex, floor = 1;
		i < content.length;
		i++
	) {
		let s = content[i].str;
		// type : '推','噓','→'
		let commentLine = { type: "", author: "", text: "", timestamp: "" };
		// find out whether it is a normal comment
		if (s.match(/[推噓→]\s+[\w\d]+\s*:.+/)) {
			// todo : check has ip

			commentLine.floor = floor++;
			commentLine.type = s[0];
			commentLine.timestamp = s.substring(s.length - 11);
			let firstColon = s.indexOf(":");
			commentLine.author = s.substring(2, firstColon);
			commentLine.text = s.substring(firstColon + 1, s.length - 11);
		} else {
			commentLine.text = s;
		}
		article.comment.push(commentLine);
	}
};

// This is used when you already have article.
// Used in sendComment because we only need to refresh comment.
const refreshArticleComment = async (BotContext, article, criteria) => {
	let res = await getArticleResponse(BotContext, article, criteria);
	if (!res) return Promise.reject("refreshArticleComment err");
	parseArticleComment(res, article);
	//console.log("refresh", article.comment);
	return article;
};

// Get articleList based on searching criteria
// criteria = { boardname:'',
//  			title:'',
//   			author:'',
//    			push:'',
//				id:'',
// 			  }

const getArticleList = async (BotContext, criteria) => {
	try {
		// build query based on criteria
		let query = BotContext.bot
			.select(ArticleModel)
			.where("boardname", criteria.boardname);
		if (criteria.id) query.where("id", criteria.id);
		if (criteria.title) query.where("title", criteria.title);
		if (criteria.author) query.where("author", criteria.author);
		if (criteria.push) query.where("push", criteria.push);

		let res = await BotContext.executeCommand({
			type: "select",
			arg: query
		});
		return res;
	} catch (err) {
		return Promise.reject(err);
	}
};

// parse article line by line, generate parsed line items.
const parseArticleLines = (lines, commentStartFloor, index) => {
	let res = [];
	for (var i = 0; i < lines.length; i++) {
		let s = lines[i].str;
		// comment line
		if (s.match(/[推噓→]\s+[\w\d]+\s*:.+/)) {
			// type : '推','噓','→'
			let commentLine = {
				type: "",
				author: "",
				text: "",
				timestamp: "",
				key: index
			};
			// todo : check has ip
			commentLine.floor = commentStartFloor++;
			commentLine.type = s[0];
			commentLine.timestamp = s.substring(s.length - 11);
			let firstColon = s.indexOf(":");
			commentLine.author = s.substring(2, firstColon);
			commentLine.text = s.substring(firstColon + 1, s.length - 11);
			res.push(<ArticleCommentItem key={index} commentLine={commentLine}/>);
		} else {
			// not comment line
			res.push(ArticleContentItem({ text: s, key: index }));
		}
		index++;
	}
	return [res, commentStartFloor];
};

export {
	parseArticle,
	refreshArticleComment,
	getArticleList,
	initArticle,
	parseArticleLines
};
