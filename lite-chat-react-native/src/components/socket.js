import io from 'socket.io-client';
const socket = io('http://192.168.42.30:3001');
// console.log(socket);
export default socket;
