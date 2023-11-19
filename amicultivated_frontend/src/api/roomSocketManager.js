// Import to use socket.io

import io from 'socket.io-client';


class RoomSocketManager {

    socket = null;
    constructor() {
        this.socket = io('http://localhost:3000/room');
        this.initEventHandler();
        console.log('RoomSocketManager initialized');
    }


    joinRoom(roomCode, userName) {
        this.socket.emit('joinRoom', {
            roomCode: roomCode,
            username: userName
        });
    }

    leaveRoom(roomCode, userName) {
        this.socket.emit('leaveRoom', {
            roomCode: roomCode,
            username: userName
        });
    }

    
    initEventHandler(){
        this.socket.on('userJoined', (data) => {
            console.log(`Un utilisateur a rejoint la room: `);
            console.log(data);
            // Mettre à jour l'interface utilisateur ici si nécessaire
        });

        this.socket.on('userLeft', (data) => {
            console.log(`Un utilisateur a quitté la room: ${data}`);
            // Mettre à jour l'interface utilisateur ici si nécessaire
        });
    }
}

export default RoomSocketManager;