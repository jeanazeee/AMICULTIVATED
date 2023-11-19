// import to use axios

import axios from 'axios';
import RoomSocketManager from './roomSocketManager';
import { useStore } from 'vuex';


class API {

    api = null;
    roomSocketManager = null;
    store = null;

    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:3000/',
            timeout: 1000,
        });
        this.roomSocketManager = new RoomSocketManager();
        this.store = useStore();
    }

    async joinRoom(roomCode, userName) {
        const response = await this.api.post('room/join', {
            roomCode: roomCode,
            username: userName
        });
        if(response.status === 200){
            this.roomSocketManager.joinRoom(roomCode, userName);
            this.store.commit('setCurrentRoomCode', roomCode);
        }
    }

    async leaveRoom(username) {
        this.api.post('room/leave', {
            username: username
        }).then((response) => {
            if(response.status === 200){
                let roomCode = response.data.code;
                this.roomSocketManager.leaveRoom(roomCode, username);
                this.store.commit('deleteCurrentRoomCode');
            }
        });
    }

    async createRoom() {
        try {
            const body = {
                maxPlayers: 5,
                username: 'alex'
            };
    
            const response = await this.api.post('room/create', body);
            let roomCode = response.data.room.code;
    
            this.roomSocketManager.joinRoom(roomCode, 'alex');
            this.store.commit('setCurrentRoomCode', roomCode);
            
            return roomCode; 
        } catch (error) {
            console.error('Error creating room:', error);
        }
    }
    
}

export default API;