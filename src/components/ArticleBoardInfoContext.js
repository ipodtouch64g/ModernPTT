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
			title: "",
		},
		lines:[],
		iterator:null,
	});

	const [articleList, setArticleList] = useState([]);
	const [index, setIndex] = useState(0);
	const [articleSearchList, setArticleSearchList] = useState([]);
	const [criteria, setCriteria] = useState({});
	const [haveSelectBoard, sethaveSelectBoard] = useState(false);
	const info = {
		boardName: boardName,
		setBoardName: setBoardName,
		article: article,
		setArticle: setArticle,
		articleList: articleList,
		setArticleList: setArticleList,
		index: index,
		setIndex: setIndex,
		articleSearchList : articleSearchList,
		setArticleSearchList : setArticleSearchList,
		criteria: criteria,
		setCriteria : setCriteria,
		haveSelectBoard:haveSelectBoard,
		sethaveSelectBoard:sethaveSelectBoard
	};


	return info;
};

export const [ArticleBoardInfoProvider, useArticleBoardInfoContext] = constate(
	useArticleBoardInfo
);
