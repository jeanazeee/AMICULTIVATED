
import ConfigManager from "../Config/ConfigManager.js";
import jwt from "jsonwebtoken";

export default class AuthMiddleware {
    static async verifyToken(req, res, next) {
        const token = req.headers['x-access-token'];

        if (!token) return res.status(403).send('Token not provided.');

        jwt.verify(token, ConfigManager.instance.jwtSecret, (err, decoded) => {
            if (err){
                 return res.status(500).send('Token verification failed.');
            }

            req.userId = decoded.id;
            next();
        });
    }
}