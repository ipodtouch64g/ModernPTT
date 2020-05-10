import { useState } from "react";
import constate from "constate";
import { Article } from "./utils/article";
import { useBotContext } from "./BotContext";

const useArticleBoardInfo = () => {
	const BotContext = useBotContext();
	const [boardName, setBoardName] = useState("");
	const [articleContent, setArticleContent] = new useState({
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
	});

	const [articleList, setArticleList] = useState([]);
	const [index, setIndex] = useState(0);
	const info = {
		boardName: boardName,
		setBoardName: setBoardName,
		articleContent: articleContent,
		setArticleContent: setArticleContent,
		articleList: articleList,
		setArticleList: setArticleList,
		index: index,
		setIndex: setIndex
	};

	return info;
};

export const [ArticleBoardInfoProvider, useArticleBoardInfoContext] = constate(
	useArticleBoardInfo
);
