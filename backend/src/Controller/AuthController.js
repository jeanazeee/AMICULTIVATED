import { getUserModel } from "../Model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ConfigManager from "../Config/ConfigManager.js";
import AuthMiddleware from "../Middlewares/AuthMiddleware.js";
import Route from "../Route/Route.js";
import Logger from "../Logger/Logger.js";
class AuthController {
    app = null

    user_model = null

    routes = [
        new Route("/login", "post", this.login.bind(this)),
        new Route("/signup", "post", this.signup.bind(this)),
    ];

    constructor(app) {
        this.app = app;
        this.user_model = getUserModel();
        this.initRoutes();
    }

    initRoutes() {
        Logger.info("Starting regestering routes for Controller: " + this.constructor.name);
        for (let route of this.routes) {
            Logger.info("Registering route " + route.path);
            route.register(this.app);
        }
        Logger.success("Routes registered");
    }

    async login(req, res) {
        const { username, password } = req.body;

        const user = await this.user_model.findOne({ where: { username: username } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id }, ConfigManager.instance.jwtSecret, { expiresIn: "1h" });
        return res.status(200).json({ token: token });

    }

    async signup(req, res) {
        const { username, password } = req.body;

        const user = await this.user_model.findOne({ where: { username: username } });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await this.user_model.create({ username: username, password: hashedPassword });

        const token = jwt.sign({ id: newUser.id }, ConfigManager.instance.jwtSecret, { expiresIn: "1h" });

        return res.status(201).json({ message: "User created successfully", token: token });

    }

    

}


export default AuthController;