import { createContext, useContext, useState } from "react";


//CUSTOM HOOK-

//create the context using createContext hook
export const AuthContext = createContext();

//exoport the function to set the value in our context using useContext
export const useAuthContext =()=>{
    return useContext(AuthContext);
}

//Provide a AuthContextProvider to wrap our application so that each can use the information of the candidates
export const AuthContextProvider =({children})=>{
    const [authUser, setAuthUser]= useState(JSON.parse(localStorage.getItem("chat-user"))|| null)
    return <AuthContext.Provider value={{authUser, setAuthUser}}>
        {children}
    </AuthContext.Provider>
}