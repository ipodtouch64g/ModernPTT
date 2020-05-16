import { useState } from "react";
import constate from "constate";
import Ptt from "ptt-client";
import usePrev from "./usePrev";
import { useProgressContext } from "./ProgressContext";

/* 救命 為啥他有時候會一直亂new 中邪了嗎 也不是斷線阿？ */
const useBot = () => {
	
	console.info('new useBot()')
	const [bot] = useState(new Ptt());
	
	const [botState, setBotState] = useState(bot.state);
	const prevBotState = usePrev(botState);

	// const { setIsSnackbarOpen, setSnackbarContent } = useProgressContext();

	bot.on("connect", () => {
		//console.log("bot connected");
		setBotState(bot.state);
	});

	bot.on("disconnect", () => {
		//console.log("bot disconnected");
		setBotState(bot.state);
	});

	let busy = false;

	// login function
	const login = async arg => {
		const username = arg.username,
			password = arg.password;
		let res = await bot.login(username, password, true);
		if (res) setBotState({ ...botState, login: true });
		return res;
	};

	// bot command
	const executeCommand = async command => {
		if (busy) {
			// setSnackbarContent({severity:'info',text:'等！'})
			// setIsSnackbarOpen(true)
			return Promise.reject('bot is busy!');
		}
		busy = true;
		//console.log("bot command : ", command);
		try {
			// not connected
			if (!botState.connect) return Promise.reject('not login!');
			// go back to index
			if (command.type === "index") {
				await bot.enterIndex();
				busy = false;
				return true;
			}
			// go to top of article
			if (command.type === "top") {
				await bot.goToTop();
				busy = false;
				return true;
			}

			// login
			if (command.type === "login") {
				if (botState.login) return true;
				let res = await login(command.arg);
				busy = false;
				return res;
			}
			// articleList
			if (command.type === "select") {
				if (!botState.login) return false;
				let query = command.arg;
				let res = await query.get();
				busy = false;
				return res;
			}
			
			// content 
			if (command.type === "content") {
				if (!botState.login) return false;
				let query = command.arg;
				let res = await query.getOne();
				busy = false;
				return res;
			}

			if(command.type === "contentIterator") {
				if (!botState.login) return false;
				let query = command.arg;
				let res = await query.getOneIterator();
				busy = false;
				return res;
			}
			
			// // comment in normal mode
			// if (command.type === "comment") {
			// 	if (!botState.login) return false;
			// 	await bot.sendComment(command.arg);
			// 	busy = false;
			// 	return true;
			// }

		} catch(err) {
			busy = false;
			return Promise.reject(err);
		}
	};
	
	return {
		bot: bot,
		botState: botState,
		prevBotState: prevBotState,
		setBotState: setBotState,
		executeCommand: executeCommand
	};
};

export const [BotProvider, useBotContext] = constate(useBot);
