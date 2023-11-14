import Logger from "../Logger/Logger.js";
import Route from "../Route/Route.js";
import AuthMiddleware from "../Middlewares/AuthMiddleware.js";
import BaseController from "./BaseController.js";
class DefaultController extends BaseController{

    app = null;

    defineRoutes() {
        return [
            new Route("/", "get", (req, res) => this.defaultRoute(req, res)),
            new Route("/secured", "all", (req, res) => this.defaultSecured(req, res), AuthMiddleware.verifyToken)
        ];
    }
    constructor(app) {
        super(app);
    }

    defaultRoute(req, res){
        res.send('Server Working!');
    }

    defaultSecured(req, res){
        res.send('Token OK!');
    }
}

export default DefaultController;