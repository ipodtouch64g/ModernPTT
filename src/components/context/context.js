import React from 'react';
import Ptt from "ptt-client";

export default React.createContext({
  bot: new Ptt(),
  botState:{login:false,connect:false,busy:false},
  user: {},
  executeCommandAction: (command) => {},
  executeCommand:(command) => {},
});