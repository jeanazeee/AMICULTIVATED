import BaseController from "./BaseController.js";
import RoomRepository from "../Repository/RoomRepository.js";
import Route from "../Route/Route.js";
import Logger from "../Logger/Logger.js";

class RoomController extends BaseController{

    app = null
    roomRepository = null
    static prefix = "/room"

    defineRoutes() {
        return [
            new Route(RoomController.prefix + "/create", "post", this.create.bind(this)),
            new Route(RoomController.prefix + "/join", "post", this.join.bind(this)),
            new Route(RoomController.prefix + "/leave", "post", this.leave.bind(this))
        ];
    }
    constructor(app) {
        super(app)
        this.roomRepository = new RoomRepository();

    }


    //This endpoint allow to create room like in web party games
    // So it will first create the room in db
    // and then the user who created the room is connected to it
    async create(req, res) {
        const {maxPlayers, username} = req.body;
        if(maxPlayers == undefined){
            return res.status(400).json({message: "Missing maxPlayers"});
        }
        // generate a five char (number and letters) code for the room that will be use to join it
        let roomCode = this.generateRoomCode();
        let status = "Open";

        // create the room in db

        let room = await this.roomRepository.createRoom(roomCode, maxPlayers, status);

        // connect the user to the room

        res.status(201).json({message: "Room created successfully", room: room});
    }


    async join(req, res){
        const {roomCode, username} = req.body;
        // Validation de base
        if (!roomCode) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        // Vérifier si la room est rejoignable
        if (!await this.roomRepository.isRoomJoinable(roomCode)) {
            return res.status(400).json({ message: "Room is not joinable" });
        }


        await this.roomRepository.incrementCurrentPlayerNumber(roomCode);

        res.status(200).json({ message: "Joined room successfully", code: roomCode});
    }


    async leave(req, res){
        const {roomCode, username} = req.body;
        // Validation de base
        if (!roomCode) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //Check if user is in room

        await this.roomRepository.decrementCurrentPlayerNumber(roomCode);

        res.status(200).json({ message: "Left room successfully", code: roomCode});
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