// import to use axios

import axios from 'axios';
import RoomSocketManager from './roomSocketManager';


class API {

    api = null;
    roomSocketManager = null;

    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:3000/',
            timeout: 1000,
        });
        this.roomSocketManager = new RoomSocketManager();
    }

    async joinRoom(roomCode, userName) {
        const response = await this.api.post('room/join', {
            roomCode: roomCode,
            username: userName
        });
        if(response.status === 200){
            this.roomSocketManager.joinRoom(roomCode, userName);
        }
    }

    async leaveRoom(roomCode, userName) {
        this.api.post('room/leave', {
            roomCode: roomCode,
            username: userName
        }).then((response) => {
            if(response.status === 200){
                this.roomSocketManager.leaveRoom(roomCode, userName);
            }
        });
    }
}

export default API;