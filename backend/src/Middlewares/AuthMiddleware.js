
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

    static async verifyUserFromBody(req, res, next){
        const token = req.headers['x-access-token'];
        if (!token) {
          return res.status(403).send("Un token est requis pour l'authentification");
        }
      
        try {
          const decoded = jwt.verify(token, ConfigManager.instance.jwtSecret);
          req.user = decoded;
        } catch (err) {
          return res.status(401).send("Token invalide");
        }
      
        // Comparaison du username dans le token et celui fourni dans la requête
        const usernameFromToken = req.user.username;
        const {username} = req.body; // ou req.body.username, selon où se trouve le username dans votre requête
      
        if (usernameFromToken !== username) {
          return res.status(403).send("Le nom d'utilisateur ne correspond pas");
        }
      
        return next();
      };
      
}