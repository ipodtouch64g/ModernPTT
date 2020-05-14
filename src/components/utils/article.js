import { Article as ArticleModel } from "ptt-client/dist/sites/ptt/model";
import { URL2AID } from "./decode";

const parseArticle = async (articleItem, BotContext,criteria) => {
	try {
		let newArticleContent = {
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
		newArticleContent.info.boardname = articleItem.boardname;
		newArticleContent.info.id = articleItem.id;
		newArticleContent.info.title = articleItem.title;

		let res = await getArticleResponse(
			BotContext,
			newArticleContent,
			criteria
		);

		newArticleContent.info.aid = "";
		newArticleContent.info.author = res.author;
		newArticleContent.info.timestamp = res.timestamp;
		newArticleContent.info.commentStartIndex = -1;
		newArticleContent.info.title = res.title;
		newArticleContent.info.ip = "";
		newArticleContent.content = [];
		newArticleContent.comment = [];
		parseArticleInfoAndContent(res, newArticleContent);
		parseArticleComment(res, newArticleContent);
		// //console.log(newArticleContent);
		return newArticleContent;
	} catch (err) {
		return Promise.reject(err);
	}
};

const getArticleResponse = async (
	BotContext,
	newArticleContent,
	criteria
) => {
	// we should still use id.
	// 置底文例外處理
	let query = BotContext.bot
		.select(ArticleModel)
		.where("boardname", newArticleContent.info.boardname)
		.where("id", newArticleContent.info.id);
		if (criteria.title) query.where("title", criteria.title);
		if (criteria.author) query.where("author", criteria.author);
		if (criteria.push) query.where("push", criteria.push);
	let res = await BotContext.executeCommand({
		type: 'content',
		arg: query
	});
	if (!res) return Promise.reject("getArticleResponse err.");
	console.log(res);
	return res;
};

// Start from top.
const parseArticleInfoAndContent = (res, newArticleContent) => {
	let content = res.content;
	// content starts from index 4
	for (let i = 4; i < content.length; i++) {
		let s = content[i].str;
		if (s.startsWith("※ 發信站: 批踢踢實業坊(ptt.cc)")) {
			newArticleContent.info.ip = s.substring(27);
			// next line should be "※ 文章網址: https://www.ptt.cc/bbs/Test/M.1588897271.A.57F.html"
			if (
				i + 1 < content.length &&
				content[i + 1].str.startsWith("※ 文章網址: ")
			) {
				// parse as AID
				let aidLine = content[++i].str;
				let url = aidLine.substring(aidLine.indexOf(":") + 2);
				const [board, AID] = URL2AID(url);
				newArticleContent.info.aid = AID;
				newArticleContent.info.commentStartIndex = i + 1;
				break;
			}	
		} else {
			newArticleContent.content.push(s);
		}
	}
};
// Starts from top.
// Todo : check commentStartIndex is correct.
const parseArticleComment = (res, newArticleContent) => {
	if (newArticleContent.info.commentStartIndex === -1) return;

	let content = res.content;
	// clear all comment
	newArticleContent.comment = [];

	for (
		var i = newArticleContent.info.commentStartIndex, floor = 1;
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
		newArticleContent.comment.push(commentLine);
	}
};

// This is used when you already have article.
// Used in sendComment because we only need to refresh comment.
const refreshArticleComment = async (
	BotContext,
	newArticleContent,
	criteria
) => {
	let res = await getArticleResponse(
		BotContext,
		newArticleContent,
		criteria
	);
	if (!res) return Promise.reject("refreshArticleComment err");
	parseArticleComment(res, newArticleContent);
	//console.log("refresh", newArticleContent.comment);
	return newArticleContent;
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
		if (criteria.id) query.where('id', criteria.id);
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


// const getArticleListIterator = async (BotContext, criteria) => {
// 	try {
// 		// build query based on criteria
// 		let query = BotContext.bot
// 			.select(ArticleModel)
// 			.where("boardname", criteria.boardname);
// 		if (criteria.title) query.where("title", criteria.title);
// 		if (criteria.author) query.where("author", criteria.author);
// 		if (criteria.push) query.where("push", criteria.push);
// 		// res will be an iterator
// 		let res = await BotContext.executeCommand({
// 			type: "selectIterator",
// 			arg: query
// 		});
// 		return res;
// 	} catch (err) {
// 		return Promise.reject(err);
// 	}
// };

export {
	parseArticle,
	refreshArticleComment,
	getArticleList,
};
