import BaseController from "./BaseController.js";
import RoomRepository from "../Repository/RoomRepository.js";
import UserRepository from "../Repository/UserRepository.js";
import Route from "../Route/Route.js";

class RoomController extends BaseController{

    app = null
    roomRepository = null
    userRepository = null
    static prefix = "/room"

    defineRoutes() {
        return [
            new Route(RoomController.prefix + "/create", "post", this.create.bind(this)),
            new Route(RoomController.prefix + "/join", "post", this.join.bind(this)),
            new Route(RoomController.prefix + "/leave", "post", this.leave.bind(this)),
            new Route(RoomController.prefix + "/:roomCode", "get", this.getRoomByCode.bind(this)),
        ];
    }
    constructor(app) {
        super(app)
        this.roomRepository = new RoomRepository();
        this.userRepository = new UserRepository();
    }


    //This endpoint allow to create room like in web party games
    // So it will first create the room in db
    // and then the user who created the room is connected to it
    async create(req, res) {
        const {maxPlayers, username} = req.body;
        if(maxPlayers == undefined){
            return res.status(400).json({message: "Missing maxPlayers"});
        }

        if(username == undefined){
            return res.status(400).json({message: "Missing username"});
        }
        // generate a five char (number and letters) code for the room that will be use to join it
        let roomCode = this.generateRoomCode();
        let status = "Open";
        let user = await this.userRepository.getUserByUsername(username);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        // check if user is not already in a room
        if(user.currentRoomId != null){
            return res.status(400).json({ message: "User is already in a room" });
        }

        // create the room in db
        let room = await this.roomRepository.createRoom(roomCode, maxPlayers, status, user.id);

        await this.userRepository.addRoomToUser(username, room.id);

        // connect the user to the room

        res.status(201).json({message: "Room created successfully", room: room});
    }


    async join(req, res){
        const {roomCode, username} = req.body;
        // Validation de base
        if (!roomCode || !username) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        // Vérifier si la room est rejoignable
        if (!await this.roomRepository.isRoomJoinable(roomCode)) {
            return res.status(400).json({ message: "Room is not joinable" });
        }

        let user = await this.userRepository.getUserByUsername(username);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if(user.currentRoomId != null){
            return res.status(400).json({ message: "User is already in a room" });
        }

        let room = await this.roomRepository.getRoomByCode(roomCode);

        await this.userRepository.addRoomToUser(username, room.id);

        await this.roomRepository.incrementCurrentPlayerNumber(roomCode);


        res.status(200).json({ message: "Joined room successfully", code: roomCode});
    }


    async leave(req, res){
        const {username} = req.body;
       //Check if user is in room
       
        let user = await this.userRepository.getUserByUsername(username);
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        if(user.currentRoomId == null){
            return res.status(400).json({ message: "User is not in a room" });
        }
        
        let roomId = user.currentRoomId;
        
        // get room code
        let room = await this.roomRepository.getRoomById(roomId);
        await this.roomRepository.decrementCurrentPlayerNumber(room.code);

        // user currentRoomId to null
        await this.userRepository.removeRoomFromUser(username);

        res.status(200).json({ message: "Left room successfully", code: room.code});
    }

    async getRoomByCode(req, res){
        const {roomCode} = req.params;
        if (!roomCode) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let room = await this.roomRepository.getRoomByCode(roomCode);
        if(!room){
            return res.status(400).json({ message: "Room not found" });
        }

        let roomData = {
            maxPlayers: room.maxPlayers,
            currentPlayerNumber: room.currentPlayerNumber,
            status: room.status,
            code: room.code,
            players: []
        }

        //TODO JUST GET USERNAME
        roomData.players = (await this.userRepository.getUsersByRoomId(room.id)).map(user => user.username);
        

        res.status(200).json({ message: "Room found", room: roomData});
    }


    generateRoomCode = () => {
        let code = "";
        for (let i = 0; i < 5; i++) {
            let random = Math.floor(Math.random() * 2);
            if (random === 0) {
                code += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
            } else {
                code += Math.floor(Math.random() * 10);
            }
        }
        return code;
    }

}

export default RoomController;