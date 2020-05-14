import { useState } from "react";
import constate from "constate";
import { Article } from "./utils/article";
import { useBotContext } from "./BotContext";

const useArticleBoardInfo = () => {
	const BotContext = useBotContext();
	const [boardName, setBoardName] = useState("");
	const [article, setArticle] = new useState({
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
	const [articleSearchIterator, setArticleSearchIterator] = useState(null);
	const [criteria, setCriteria] = useState({});
	const info = {
		boardName: boardName,
		setBoardName: setBoardName,
		article: article,
		setArticle: setArticle,
		articleList: articleList,
		setArticleList: setArticleList,
		index: index,
		setIndex: setIndex,
		articleSearchIterator : articleSearchIterator,
		setArticleSearchIterator : setArticleSearchIterator,
		criteria: criteria,
		setCriteria : setCriteria
	};

	return info;
};

export const [ArticleBoardInfoProvider, useArticleBoardInfoContext] = constate(
	useArticleBoardInfo
);
