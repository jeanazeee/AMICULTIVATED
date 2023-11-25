import Logger from "../Logger/Logger.js";
import RoomRepository from "../Repository/RoomRepository.js";
import UserRepository from "../Repository/UserRepository.js";
import RoundSocketManager from "./RoundSocketManager.js";
import ArtApiService from "../Services/ArtApiService.js";

class RoomSocketHandler {

    io = null;
    userRepository = null;
    roomRepository = null;
    roundManagers = {};

    constructor(io) {
        this.io = io;
        this.roundManagers = {};
        this.userRepository = new UserRepository();
        this.roomRepository = new RoomRepository();
        this.setupRoomNamespace();
    }

    setupRoomNamespace() {
        const roomNamespace = this.io.of("/room");
        roomNamespace.on("connection", (socket) => {    
            socket.on("joinRoom", ({ roomCode, user }) => {
                socket.join(roomCode);
                roomNamespace.to(roomCode).emit('userJoined', { user: user.username, room: roomCode });
                Logger.info(`Utilisateur ${user.username} a rejoint la room: ${roomCode}`);
                if (!this.roundManagers[roomCode]) {
                    this.roundManagers[roomCode] = new RoundSocketManager(roomNamespace, roomCode);
                }
                this.attachRoomEventListeners(socket, roomCode, user); // Attacher les écouteurs d'événements spécifiques à la room

                socket.on("disconnect", () => {
                    Logger.info(`Utilisateur ${user.username} a déconnecté de la room: ${roomCode}`);

                    this.handleLeaveRoom(socket, roomCode, user);
                });
            });

            socket.on("leaveRoom", ({ roomCode, user }) => {
                Logger.info(`Utilisateur ${user.username} a quitté la room: ${roomCode}`);
                this.handleLeaveRoom(socket, roomCode, user);
            });
        });
    }

    attachRoomEventListeners(socket, roomCode, user) {
        const roomNamespace = this.io.of("/room");
        socket.on("updateRoom", async ({ roomCode, maxPlayers }) => {
            Logger.info(`Utilisateur ${user.username} a changé les paramètres de la room: ${roomCode}`);
            roomNamespace.to(roomCode).emit('updateRoom', { room: roomCode });
        });

        socket.on("startGame", async ({ roomCode, difficulty, artId }) => {
            Logger.info(`Utilisateur ${user.username} a lancé la partie de la room: ${roomCode}`);
            const roundSocketManager = this.roundManagers[roomCode];
            roomNamespace.to(roomCode).emit('gameStarting', { room: roomCode });
            if (roundSocketManager) {
                roundSocketManager.startRound(difficulty, artId);
            }
        });

        socket.on("nextRound", async ({ roomCode, difficulty, artId }) => {
            Logger.info(`Utilisateur ${user.username} a lancé un nouveau round dans la room: ${roomCode}`);
            const roundSocketManager = this.roundManagers[roomCode];
            if (roundSocketManager) {
                roundSocketManager.startRound(difficulty, artId);
            }
        });

        socket.on("submitAnswer", async ({ roomCode, user, answerId }) => {
            Logger.info(`Utilisateur ${user.username} a répondu dans la room: ${roomCode} avec la réponse: ${answerId}`);
            const roundSocketManager = this.roundManagers[roomCode];
            roundSocketManager.handlePlayerResponse(user, answerId);
        });

        socket.on("endGame", async ({ roomCode }) => {
            Logger.info(`Utilisateur ${user.username} a terminé la partie dans la room: ${roomCode}`);
            const roundSocketManager = this.roundManagers[roomCode];
            if (roundSocketManager) {
                roundSocketManager.endGame();
            }
        });
    }

    handleLeaveRoom(socket, roomCode, user) {
        const roomNamespace = this.io.of("/room");
        this.detachRoomEventListeners(socket);
        socket.leave(roomCode);
        roomNamespace.to(roomCode).emit('userLeft', { user: user.username, room: roomCode });
        const roundSocketManager = this.roundManagers[roomCode];
        if (roundSocketManager) {
            roundSocketManager.handlePlayerLeave(user);
        }
    }

    detachRoomEventListeners(socket) {
        socket.removeAllListeners("updateRoom");
        socket.removeAllListeners("startGame");
        socket.removeAllListeners("nextRound");
        socket.removeAllListeners("submitAnswer");
        socket.removeAllListeners("endGame");
    }

}

export default RoomSocketHandler;