import { getArticleList } from "./article";
const submitSearch = async (criteria,info,BotContext) => {
    //console.log(values);
    // search for matching articles
    info.setCriteria(criteria);
    try {
        let res = await getArticleList(BotContext, criteria);
        console.log(res);
        if (res.length > 0) {
            info.setArticleSearchList(res);
            info.setIndex(1);
        } else {
            info.setCriteria({});
            return false;
        }
    } catch (err) {
        return Promise.reject(err);
    }
};

export {submitSearch};