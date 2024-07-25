import {io,Socket} from 'socket.io-client'

const SOCKET_SERVER_URL:string = import.meta.env.VITE_BACKEND_BASE_URL 
console.log('SOCKET_SERVER_URL = ',SOCKET_SERVER_URL)

const socket: Socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,  
  reconnection: true, 
  reconnectionAttempts: Infinity, 
  reconnectionDelay: 1000, 
});

export const connectSocket = (userId: string) => {
  socket.io.opts.query = { userId };
  socket.connect();
};


export default socket;