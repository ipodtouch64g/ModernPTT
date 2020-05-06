import { useState } from 'react';
import Cookies from 'universal-cookie';
import constate from "constate";

const cookies = new Cookies();

const useUser = () => {
    const [user,setUser] = useState(cookies.get('user')); 

    return {
      user,setUser
    };
  };

export const [UserProvider, useUserContext] = constate(useUser);
