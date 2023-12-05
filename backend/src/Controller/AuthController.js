import UserModel from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ConfigManager from "../Config/ConfigManager.js";
import Route from "../Route/Route.js";
import BaseController from "./BaseController.js";
import UserRepository from "../Repository/UserRepository.js";
import RoomRepository from "../Repository/RoomRepository.js";

class AuthController extends BaseController{
    app = null

    userRepository = null;
    roomRepository = null;
    
    defineRoutes() {
        return [
            new Route("/login", "post", this.login.bind(this)),
            new Route("/signup", "post", this.signup.bind(this)),
        ];
    }
    constructor(app) {
        super(app)
        this.userRepository = new UserRepository();
        this.roomRepository = new RoomRepository();
    }

    async login(req, res) {
        const { username, password } = req.body;

        const user = await this.userRepository.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, ConfigManager.instance.jwtSecret, { expiresIn: "1h" });


        let currentRoom = (await this.roomRepository.getRoomById(user.currentRoomId));

        let currentRoomInfo = currentRoom ? currentRoom : {};

        return res.status(200).json({ token: token,  username: username, userId: user.id, currentRoomInfo: currentRoomInfo });
    }

    async signup(req, res) {
        const { username, password } = req.body;

        const user = await this.userRepository.getUserByUsername(username);
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await this.userRepository.createUser(username, hashedPassword);

        const token = jwt.sign({ id: newUser.id, username: newUser.username }, ConfigManager.instance.jwtSecret, { expiresIn: "1h" });

        return res.status(201).json({ message: "User created successfully", token: token, username: username, userId: newUser.id, currentRoomCode: "" });
    }


}


export default AuthController;
