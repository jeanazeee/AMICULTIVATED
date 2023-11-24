import Logger from "../Logger/Logger.js";
import RoomRepository from "../Repository/RoomRepository.js";
import UserRepository from "../Repository/UserRepository.js";

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
            socket.on("joinRoom", ({ roomCode, username })  => {
                socket.join(roomCode);
                Logger.info(`Utilisateur ${socket.id} a rejoint la room: ${roomCode}`);
                // Informer les autres membres de la room
                roomNamespace.to(roomCode).emit('userJoined', { user: socket.id, room: roomCode });

                // Gérer la déconnexion de l'utilisateur
                socket.on("disconnect", () => {
                    socket.leave(roomCode);
                    Logger.info(`Utilisateur ${socket.id} a deconecté la room: ${roomCode}`);
                    // Informer les autres membres de la room
                    roomNamespace.to(roomCode).emit('userLeft', { user: socket.id, room: roomCode });
                });

                // gerer les changements dans les parametres de la room
                socket.on("updateRoom", async ({ roomCode, maxPlayers }) => {
                    Logger.info(`Utilisateur ${socket.id} a changé les parametres de la room: ${roomCode}`);
                    roomNamespace.to(roomCode).emit('updateRoom', { room: roomCode });
                });

                // gerer le lancement de la partie
                socket.on("startGame", async ({ roomCode }) => {
                    Logger.info(`Utilisateur ${socket.id} a lancé la partie de la room: ${roomCode}`);
                    roomNamespace.to(roomCode).emit('startGame', { room: roomCode });
                });
            });

            socket.on("leaveRoom", async ({roomCode, username}) => {
                socket.leave(roomCode);
                Logger.info(`Utilisateur ${socket.id} a quitté la room: ${roomCode}`);
                roomNamespace.to(roomCode).emit('userLeft', { user: socket.id, room: roomCode });
            });
        });
    }
}

export default RoomSocketHandler;