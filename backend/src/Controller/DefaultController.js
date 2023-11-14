import Logger from "../Logger/Logger.js";
import Route from "../Route/Route.js";
import AuthMiddleware from "../Middlewares/AuthMiddleware.js";
import BaseController from "./BaseController.js";
import ArtApiService from "../Services/ArtApiService.js";
class DefaultController extends BaseController{

    app = null;

    defineRoutes() {
        return [
            new Route("/", "get", (req, res) => this.defaultRoute(req, res)),
            new Route("/secured", "all", (req, res) => this.defaultSecured(req, res), AuthMiddleware.verifyToken),
            new Route("/getall", "get", (req, res) => this.testApi(req, res))
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


    async testApi(req, res){
        res.send(await ArtApiService.getArt(2,3));
    }
}

export default DefaultController;