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
                let roomData = response.data.room;
                this.store.dispatch('saveCurrentRoomInfos', { currentRoomInfos: roomData })
            }
        } catch(error) {
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
                username: username,
                maxRounds: 2,
            };
    
            const response = await this.api.post('room/create', body);
            if(response.status === 201){
                let roomData = response.data.room;
                this.store.dispatch('saveCurrentRoomInfos', { currentRoomInfos: roomData })
            }else{
                throw response;
            }

            return this.store.getters.currentRoomInfos;
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
                this.store.dispatch('saveCurrentRoomInfos', { currentRoomInfos: response.data.room })
                return response.data;
            }else{
                throw response;
            }
        } catch (error) {
            console.error('Error getting room infos:', error);
            throw error;
        }
    }
    

    async updateRoom(roomCode, maxPlayers, maxRounds){
        try{
            const response = await this.api.put(`room/${roomCode}`, {
                maxPlayers: maxPlayers,
                maxRounds: maxRounds
            });
            if(response.status === 200){
                this.roomSocketManager.updateRoom(roomCode, maxPlayers, maxRounds);
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
                this.store.dispatch('changeRoomStatus', { status: response.data.status });
                return response.data.status;
            }else{
                throw response;
            }
        } catch (error) {
            console.error('Error starting game:', error);
            throw error;
        }
    }

    async endGame(roomCode){
        try {
            const response = await this.api.post(`room/${roomCode}/end`);
            if(response.status === 200){
                this.roomSocketManager.endGame(roomCode);
                this.store.dispatch('changeRoomStatus', { status: response.data.status });
                return response.data.status;
            }else{
                throw response;
            }
        } catch {
            console.error('Error ending game:', error);
            throw error;
        }
    }

    async getScoresByRoom(roomCode){
        try {
            const response = await this.api.get(`room/${roomCode}/scores`);
            if(response.status === 200){
                const scores = response.data.scores;
                const currentRoomInfos = this.store.getters.currentRoomInfos;
                //for each player in players update his score
                for (let i = 0; i < currentRoomInfos.players.length; i++) {
                    currentRoomInfos.players[i].score = scores[currentRoomInfos.players[i].username];
                }
                this.store.dispatch('saveCurrentRoomInfos', {currentRoomInfos});
                return response.data.scores;
            }else{
                throw response;
            }
        } catch {
            console.error('Error getting scores:', error);
            throw error;
        }
    }
}

export default API; 