import { Article as ArticleModel } from "ptt-client/dist/sites/ptt/model";
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
	getArticleList,
	initArticle,
	parseArticleLines
};
