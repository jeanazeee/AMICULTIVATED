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
        this.roomSocketManager = RoomSocketManager.getInstance();
        this.store = store;
    }

    async joinRoom(roomCode, username) {
        try {
            const response = await this.api.post('room/join', {
                roomCode: roomCode,
                username: username
            });
            if(response.status === 200){
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
                this.roomSocketManager.leaveRoom(roomCode, this.store.getters.user);
                this.store.dispatch('deleteRoomInfos'); 
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
                this.store.dispatch('setCurrentRoomCode', { currentRoomCode: roomCode })
            }else{
                throw response;
            }

            return this.store.getters.currentRoomCode;
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
    

    async updateRoom(roomCode, maxPlayers){
        try{
            const response = await this.api.put(`room/${roomCode}`, {
                maxPlayers: maxPlayers
            });
            if(response.status === 200){
                this.roomSocketManager.updateRoom(roomCode, maxPlayers);
                return response.data;
            }else{
                throw response;
            }
        } catch (error) {
            console.error('Error updating room:', error);
            throw error;
        }
    }

    async startGame(roomCode){
        try{
            const response = await this.api.post(`room/${roomCode}/start`);
            if(response.status === 200){
                this.roomSocketManager.startGame(roomCode);
                return response.data;
            }else{
                throw response;
            }
        } catch (error) {
            console.error('Error starting game:', error);
            throw error;
        }
    }
}

export default API;