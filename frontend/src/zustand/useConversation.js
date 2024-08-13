import {create} from 'zustand'

const useConversation = create((set)=>({
    selectedConversation: null, //initial state for the selectedConverasation
    setSelectedConversation: (selectedConversation)=> set({selectedConversation}),
    messages:[], //initial state for the messages to be displayed
    setMessages: (messages)=>set({messages})
}))

export default useConversation;