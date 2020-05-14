import React, { useState, useReducer } from "react";

import GlobalContext from "./context";
import Ptt from "ptt-client";
import Cookies from 'universal-cookie';

const GlobalState = props => {
	const bot = new Ptt();
    const cookies = new Cookies();

    const [user,setUser] = useState(cookies.get('user')); 



	const [botState, dispatch] = useReducer(Reducer, {
		login: false,
		connect: false,
		busy: false
	});

	bot.on("connect", () => {
		//console.log("bot connected");
		// setBotState(bot.state);
	});

	bot.on("disconnect", () => {
		console.log("bot disconnected");
		// setBotState(bot.state);
	});

	const executeCommand = async(command)=> {
            if (botState.busy) {
                return false;
            }
            botState.busy = true;
            console.log('bot command : ',command);
            try {
                // not connected
                if (!botState.connect) return false;
                // login
                if (command.type === "login") {
                    if (botState.login) return true;
            let res = await login(command.arg);
            return res;
                }
                // select
                if (command.type === "select") {
                    if (!botState.login) return false;
                    let query = command.arg;
                    let res = await query.get();
                    return res;
          }
          // content
          if (command.type === "content") {
                    if (!botState.login) return false;
                    let query = command.arg;
                    let res = await query.getOne();
                    return res;
          }
                // Todo : post
            } catch {
            } finally {
                busy = false;
            }
        };
    };

    const executeCommandAction = command => {};

	return (
		<GlobalContext.Provider
			value={{
				bot: bot,
				botState: botState,
				executeCommand: executeCommand
			}}
		>
			{props.children}
		</GlobalContext.Provider>
	);
};

export default GlobalState;
