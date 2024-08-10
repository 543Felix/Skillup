import { createContext,Dispatch,SetStateAction } from "react";

export interface Notification {
  id: string;
  name: string;
  content: string;
  createdAt: string | Date;
  image?: string;
}

export interface chats {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type:string;
  createdAt: string;
  isViewed:boolean
}

export interface Messages{
    date:string|Date
    chats:chats[]
}

export interface Allchats{
  id:string;
  name:string;
  image:string;
  lastMessage:string;
  type:string;
  createdAt:string
}

export interface UnRead{
  sender:string;
  count:number
}


export interface ChatContextType {
  messages: Messages[];
  setMessages: Dispatch<SetStateAction<Messages[]>>;
  allChats: Allchats[],
  setAllchats:Dispatch<SetStateAction<Allchats[]>>;
  unreadMesCount:UnRead[];
  setUnReadMesCount:Dispatch<SetStateAction<UnRead[]>>;
}



export const defaultChatContextValue: ChatContextType = {
  messages: [],
  setMessages: () => {},
  allChats:[],
  setAllchats:()=>{},
  unreadMesCount:[],
  setUnReadMesCount:()=>{}
};

export const devcontext = createContext<ChatContextType>(defaultChatContextValue);
export const companyContext = createContext<ChatContextType>(defaultChatContextValue);