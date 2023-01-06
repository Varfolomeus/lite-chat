import io from 'socket.io-client';
const curIp = '192.168.68.113';
export const currentIp =`http://${curIp}:3001`;
export const socket = io(currentIp);
