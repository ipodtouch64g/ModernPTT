import { useState } from "react";
import constate from "constate";
import Ptt from "ptt-client";
import usePrev from "./usePrev";

const useBot = () => {
	const ptt = new Ptt();
	const [bot] = useState(ptt);

	const [botState, setBotState] = useState(bot.state);
	const prevBotState = usePrev(botState);

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
	// command = {type : "login"|"select"|"content"|"comment", arg : query | userObject}
	const executeCommand = async command => {
		if (busy) {
			return Promise.reject('bot is busy!');
		}
		busy = true;
		console.log("bot command : ", command);
		try {
			// not connected
			if (!botState.connect) return Promise.reject('not login!');;
			// login
			if (command.type === "login") {
				if (botState.login) return true;
				let res = await login(command.arg);
				busy = false;
				return res;
			}
			// select
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
			// comment
			if (command.type === "comment") {
				if (!botState.login) return false;
				await bot.sendComment(command.arg);
				busy = false;
				return true;
			}
			
		} catch(err) {
			busy = false;
			return Promise.reject(err);
		}
	};

	bot.on("connect", () => {
		console.log("bot connected");
		setBotState(bot.state);
	});

	bot.on("disconnect", () => {
		console.log("bot disconnected");
		setBotState(bot.state);
	});

	return {
		bot: bot,
		botState: botState,
		prevBotState: prevBotState,
		setBotState: setBotState,
		executeCommand: executeCommand
	};
};

export const [BotProvider, useBotContext] = constate(useBot);
