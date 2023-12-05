import RoomSocketHandler from "./RoomSocketHandler.js";
import { Server } from "socket.io";

class SocketManager {
    io = null;

    constructor(server) {
        this.io = new Server(server, {
            // cors
            cors: {
                origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
                methods: ["GET", "POST"]
            }

        });

        this.setupHandlers();
    }

    setupHandlers() {
        new RoomSocketHandler(this.io);
    }
}

export default SocketManager;