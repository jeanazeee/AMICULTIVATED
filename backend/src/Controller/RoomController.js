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
            new Route(RoomController.prefix + "/:roomCode", "put", this.updateRoom.bind(this)),
            new Route(RoomController.prefix + "/:roomCode/start", "post", this.startGame.bind(this)),
            new Route(RoomController.prefix + "/:roomCode/end", "post", this.endGame.bind(this)),
            new Route(RoomController.prefix + "/:roomCode/scores", "get", this.getScoresByRoom.bind(this)),
        ];
    }
    
    constructor(app) {
        super(app)
        this.roomRepository = new RoomRepository();
        this.userRepository = new UserRepository();
    }


    //This endpoint allow to create room like in web party games
    // So it will first create the room in dbF
    // and then the user who created the room is connected to it
    async create(req, res) {
        const {maxPlayers, username, maxRounds} = req.body;
        if(maxPlayers == undefined){
            return res.status(400).json({message: "Missing maxPlayers"});
        }

        if(username == undefined){
            return res.status(400).json({message: "Missing username"});
        }

        if(maxRounds == undefined){
            return res.status(400).json({message: "Missing maxRounds"});
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
        let room = await this.roomRepository.createRoom(roomCode, maxPlayers, maxRounds, status, user.id);

        await this.userRepository.addRoomToUser(username, room.id);

        try {
            room = await this.roomRepository.getRoomByCode(roomCode);
        } catch (error) {
            return res.status(400).json({ message: "Room not found" });
        }

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

        try {
            let room = await this.roomRepository.getRoomByCode(roomCode);
            await this.userRepository.addRoomToUser(username, room.id);
        } catch (error) {
            return res.status(400).json({ message: "Room not found" });
        }


        await this.roomRepository.incrementCurrentPlayerNumber(roomCode);

        const room = await this.roomRepository.getRoomByCode(roomCode);
        

        res.status(200).json({ message: "Joined room successfully", room: room});
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


        res.status(200).json({ message: "Room found", room: room});
    }


    async updateRoom(req, res){
        const {roomCode} = req.params;
        const {maxPlayers, maxRounds} = req.body;
        if (!roomCode) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let room = await this.roomRepository.getRoomByCode(roomCode);
        if(!room){
            return res.status(400).json({ message: "Room not found" });
        }

        if(maxPlayers != undefined){
            await this.roomRepository.updateRoomSettings(roomCode, maxPlayers, maxRounds);
        }

        res.status(200).json({ message: "Room updated successfully"});
    }

    async startGame(req, res){
        const {roomCode} = req.params;
        if (!roomCode) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let room = await this.roomRepository.getRoomByCode(roomCode);
        if(!room){
            return res.status(400).json({ message: "Room not found" });
        }

        if(room.status != "Open"){
            return res.status(400).json({ message: "Room is not open" });
        }

        await this.roomRepository.updateRoomStatus(roomCode, "Started");

        // reset score from all players
        this.userRepository.resetScoreByRoomId(room.id);

        res.status(200).json({ message: "Room updated successfully", status: "Started"});
    }

    async endGame(req, res){
        const {roomCode} = req.params;

        if (!roomCode) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let room = await this.roomRepository.getRoomByCode(roomCode);

        if(!room){
            return res.status(400).json({ message: "Room not found" });
        }

        if(room.status != "Started"){
            return res.status(400).json({ message: "Room is not started" });
        }

        await this.roomRepository.updateRoomStatus(roomCode, "Finished");
        this.userRepository.resetScoreByRoomId(room.id);

        res.status(200).json({ message: "Room updated successfully", status: "Finished"});
    }

    async getScoresByRoom(req, res){
        const {roomCode} = req.params;

        if (!roomCode) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let room = await this.roomRepository.getRoomByCode(roomCode);

        if(!room){
            return res.status(400).json({ message: "Room not found" });
        }

        let users = await this.userRepository.getUsersByRoomId(room.id);

        const usersScores = {};
        users.forEach(user => {
            usersScores[user.username] = user.score;
        });

        res.status(200).json({ message: "Scores found", scores: usersScores});
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