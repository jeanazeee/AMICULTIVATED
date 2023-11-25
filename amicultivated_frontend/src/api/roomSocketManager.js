import io from 'socket.io-client';

class RoomSocketManager {

    static instance = null;
    socket = null;

    constructor() {
        this.socket = io('http://localhost:3000/room');
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new RoomSocketManager();
        }
        return this.instance;
    }

    joinRoom(roomCode, user) {
        this.socket.emit('joinRoom', {
            roomCode: roomCode,
            user: user
        });
    }

    leaveRoom(roomCode, user) {
        this.socket.emit('leaveRoom', {
            roomCode: roomCode,
            user: user
        });
    }

    updateRoom(roomCode, maxPlayers) {
        this.socket.emit('updateRoom', {
            roomCode: roomCode,
            maxPlayers: maxPlayers
        });
    }

    startGame(roomCode) {
        this.socket.emit('startGame', {
            roomCode: roomCode,
            difficulty: 0,
            artId: ""
        });
    }

    submitAnswer(roomCode, user, answer) {
        console.log("Answering round Emit");
        this.socket.emit('submitAnswer', {
            roomCode: roomCode,
            user: user,
            answer: answer
        });
    }

    onUserJoined(callback) {
        this.socket.on('userJoined', callback);
    }

    onUserLeft(callback) {
        this.socket.on('userLeft', callback);
    }

    onRoomUpdated(callback) {
        this.socket.on('updateRoom', callback);
    }

    onGameStarted(callback) {
        this.socket.on('gameStarting', callback);
    }

    onRoundStarted(callback){
        this.socket.on('roundStarted', callback);
    }

    onRoundEnded(callback){
        this.socket.on('roundEnded', callback);
    }

    offUserJoined(callback) {
        this.socket.off('userJoined', callback);
    }

    offUserLeft(callback) {
        this.socket.off('userLeft', callback);
    }

    offRoomUpdated(callback) {
        this.socket.off('updateRoom', callback);
    }

    offGameStarted(callback) {
        this.socket.off('gameStarting', callback);
    }

    offRoundStarted(callback){
        this.socket.off('roundStarted', callback);
    }

    offRoundEnded(callback){
        this.socket.off('roundEnded', callback);
    }
}

export default RoomSocketManager;
