import Logger from "../Logger/Logger.js";
import RoomRepository from "../Repository/RoomRepository.js";
import UserRepository from "../Repository/UserRepository.js";
import RoundSocketManager from "./RoundSocketManager.js";
import ArtApiService from "../Services/ArtApiService.js";

class RoomSocketHandler {

    io = null;
    userRepository = null;
    roomRepository = null;

    constructor(io) {
        this.io = io;
        this.userRepository = new UserRepository();
        this.roomRepository = new RoomRepository();
        this.setupRoomNamespace();
    }

    setupRoomNamespace() {
        const roomNamespace = this.io.of("/room");
        roomNamespace.on("connection", (socket) => {    
            socket.on("joinRoom", ({ roomCode }) => {
                socket.join(roomCode);
                roomNamespace.to(roomCode).emit('userJoined', { user: socket.id, room: roomCode });
                Logger.info(`Utilisateur ${socket.id} a rejoint la room: ${roomCode}`);
                this.attachRoomEventListeners(socket, roomCode); // Attacher les écouteurs d'événements spécifiques à la room

                socket.on("disconnect", () => {
                    Logger.info(`Utilisateur ${socket.id} a déconnecté de la room: ${roomCode}`);

                    this.handleLeaveRoom(socket, roomCode);
                });
            });

            socket.on("leaveRoom", ({ roomCode, username }) => {
                Logger.info(`Utilisateur ${socket.id} a quitté la room: ${roomCode}`);

                this.handleLeaveRoom(socket, roomCode);
            });
        });
    }

    attachRoomEventListeners(socket, roomCode) {
        const roomNamespace = this.io.of("/room");
        socket.on("updateRoom", async ({ roomCode, maxPlayers }) => {
            Logger.info(`Utilisateur ${socket.id} a changé les paramètres de la room: ${roomCode}`);
            roomNamespace.to(roomCode).emit('updateRoom', { room: roomCode });
        });

        socket.on("startGame", async ({ roomCode, difficulty, artId }) => {
            Logger.info(`Utilisateur ${socket.id} a lancé la partie de la room: ${roomCode}`);
            const roundSocketManager = new RoundSocketManager(roomNamespace, roomCode);
            roomNamespace.to(roomCode).emit('gameStarting', { room: roomCode });
            roundSocketManager.startRound(difficulty, artId);
            // roomNamespace.to(roomCode).emit('roundStarted', {artInfo: data, room: roomCode });
        });

        socket.on("nextRound", async ({ roomCode, difficulty, artId }) => {
            Logger.info(`Utilisateur ${socket.id} a lancé un nouveau round dans la room: ${roomCode}`);
            const roundSocketManager = new RoundSocketManager(this.io, roomCode);
            roundSocketManager.startRound(difficulty, artId);
        });
    }

    handleLeaveRoom(socket, roomCode) {
        const roomNamespace = this.io.of("/room");
        this.detachRoomEventListeners(socket);
        socket.leave(roomCode);
        roomNamespace.to(roomCode).emit('userLeft', { user: socket.id, room: roomCode });
    }

    detachRoomEventListeners(socket) {
        socket.removeAllListeners("updateRoom");
        socket.removeAllListeners("startGame");
        socket.removeAllListeners("nextRound");
    }

}

export default RoomSocketHandler;