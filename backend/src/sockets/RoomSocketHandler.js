import Logger from "../Logger/Logger.js";
import RoomRepository from "../Repository/RoomRepository.js";
import UserRepository from "../Repository/UserRepository.js";
import RoundSocketManager from "./RoundSocketManager.js";

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
                Logger.info(`User ${user.username} joined the room: ${roomCode}`);
                if (!this.roundManagers[roomCode]) {
                    this.roundManagers[roomCode] = new RoundSocketManager(roomNamespace, roomCode);
                }
                // attach room event listeners
                this.attachRoomEventListeners(socket, user); 

                socket.on("disconnect", () => {
                    Logger.info(`User ${user.username} has disconnected from the room: ${roomCode}`);

                    this.handleLeaveRoom(socket, roomCode, user);
                });
            });

            socket.on("leaveRoom", ({ roomCode, user }) => {
                Logger.info(`User ${user.username} left the room: ${roomCode}`);
                this.handleLeaveRoom(socket, roomCode, user);
            });
        });
    }

    attachRoomEventListeners(socket, user) {
        const roomNamespace = this.io.of("/room");
        socket.on("updateRoom", async ({ roomCode }) => {
            Logger.info(`User ${user.username} has changed the settings of the the room: ${roomCode}`);
            roomNamespace.to(roomCode).emit('updateRoom', { room: roomCode });
        });

        socket.on("startGame", async ({ roomCode, difficulty, artId }) => {
            Logger.info(`User ${user.username} started the game for room: ${roomCode}`);
            const roundSocketManager = this.roundManagers[roomCode];
            roomNamespace.to(roomCode).emit('gameStarting', { room: roomCode });
            if (roundSocketManager) {
                roundSocketManager.startRound(difficulty, artId);
            }
        });

        socket.on("nextRound", async ({ roomCode, difficulty, artId }) => {
            Logger.info(`User ${user.username} started a new round for room: ${roomCode}`);
            const roundSocketManager = this.roundManagers[roomCode];
            if (roundSocketManager) {
                roundSocketManager.startRound(difficulty, artId);
            }
        });

        socket.on("submitAnswer", async ({ roomCode, user, answerId }) => {
            Logger.info(`User ${user.username} answered in room: ${roomCode} with answer: ${answerId}`);
            const roundSocketManager = this.roundManagers[roomCode];
            roundSocketManager.handlePlayerResponse(user, answerId);
        });

        socket.on("endGame", async ({ roomCode }) => {
            Logger.info(`User ${user.username} ended game in room: ${roomCode}`);
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