import Logger from "../Logger/Logger.js";
import Route from "../Route/Route.js";
import AuthMiddleware from "../Middlewares/AuthMiddleware.js";
class DefaultController {

    app = null;

    routes = [
        new Route("/", "get", this.defaultRoute.bind(this)),
        new Route("/secured", "all", this.defaultSecured.bind(this), AuthMiddleware.verifyToken)
    ];

    constructor(app) {
        this.app = app;
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

    defaultRoute(req, res){
        res.send('Server Working!');
    }

    defaultSecured(req, res){
        res.send('Token OK!');
    }
}

export default DefaultController;