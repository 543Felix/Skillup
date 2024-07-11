export interface Notification {
  id: string;
  name: string;
  content: string;
  createdAt: string | Date;
  image: string;
}

export interface messages {
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export interface Allchats{
  id:string;
  name:string;
  image:string;
  lastMessage:string;
  createdAt:string
}