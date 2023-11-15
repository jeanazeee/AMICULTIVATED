import Logger from "../Logger/Logger.js";

class RoomSocketHandler {

    io = null;

    constructor(io) {
        this.io = io;
        this.setupRoomNamespace();
    }

    setupRoomNamespace() {
        const roomNamespace = this.io.of("/room");
        roomNamespace.on("connection", (socket) => {
            socket.on("joinRoom", ({ roomCode, username })  => {
                socket.join(roomCode);
                Logger.info(`Utilisateur ${socket.id} a rejoint la room: ${roomCode}`);
                // Informer les autres membres de la room
                roomNamespace.to(roomCode).emit('userJoined', { user: socket.id, room: roomCode });

                // Gérer la déconnexion de l'utilisateur
                socket.on("disconnect", () => {
                    socket.leave(roomCode);
                    Logger.info(`Utilisateur ${socket.id} a quitté la room: ${roomCode}`);
                    // Informer les autres membres de la room
                    roomNamespace.to(roomCode).emit('userLeft', { user: socket.id, room: roomCode });
                });
            });

            socket.on("leaveRoom", ({ roomCode, username }) => {
                socket.leave(roomCode);
                Logger.info(`Utilisateur ${socket.id} a quitté la room: ${roomCode}`);
                roomNamespace.to(roomCode).emit('userLeft', { user: socket.id, room: roomCode });
            });
        });
    }
}

export default RoomSocketHandler;