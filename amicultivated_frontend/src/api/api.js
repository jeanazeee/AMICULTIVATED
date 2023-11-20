// import to use axios

import axios from 'axios';
import RoomSocketManager from './roomSocketManager';


class API {

    api = null;
    roomSocketManager = null;
    store = null;

    constructor(store) {
        this.api = axios.create({
            baseURL: 'http://localhost:3000/',
            timeout: 1000,
        });
        this.roomSocketManager = new RoomSocketManager();
        this.store = store;
    }

    async joinRoom(roomCode, username) {
        try {
            const response = await this.api.post('room/join', {
                roomCode: roomCode,
                username: username
            });
            if(response.status === 200){
                this.roomSocketManager.joinRoom(roomCode, username);
                this.store.dispatch('setCurrentRoomCode', { currentRoomCode: roomCode })
            }
        } catch {
            this.leaveRoom(username);
            console.error('Error joining room:', error);
            throw error;
        }
    }

    async leaveRoom(username) {
        try{
            const response = await this.api.post('room/leave', {
                username: username
            });
            if(response.status === 200){
                let roomCode = response.data.code;
                this.roomSocketManager.leaveRoom(roomCode, username);
                this.store.dispatch('deleteCurrentRoomCode'); 
            }
        }catch(error){
            console.error('Error leaving room:', error);
            throw error;
        }
    }

    async createRoom(username) {
        try {
            const body = {
                maxPlayers: 5,
                username: username
            };
    
            const response = await this.api.post('room/create', body);


            if(response.status === 201){
                let roomCode = response.data.room.code;
                this.roomSocketManager.joinRoom(roomCode, username);
                this.store.dispatch('setCurrentRoomCode', { currentRoomCode: roomCode })
            }else{
                throw response;
            }

            return this.store.state.currentRoomCode; 
        } catch (error) {
            this.leaveRoom(username);
            console.error('Error creating room:', error);
            throw error;
        }
    }

    async getRoomInfos(roomCode) {
        try {
            const response = await this.api.get(`room/${roomCode}`);
            if(response.status === 200){
                return response.data;
            }else{
                throw response;
            }
        } catch (error) {
            console.error('Error getting room infos:', error);
            throw error;
        }
    }
    
}

export default API;