import { useState } from "react";
import constate from "constate";

const useArticleBoardInfo = () => {
	// Todo : can config this
	const [boardName, setBoardName] = useState("");
  const [articleContent, setArticleContent] = useState({});
  const [articleList, setArticleList] = useState([]);

	const info = {
		boardName: boardName,
		setBoardName: setBoardName,
		articleContent: articleContent,
		setArticleContent: setArticleContent,
		articleList: articleList,
    	setArticleList: setArticleList,
	};

	return info;
};

export const [ArticleBoardInfoProvider, useArticleBoardInfoContext] = constate(
	useArticleBoardInfo
);
