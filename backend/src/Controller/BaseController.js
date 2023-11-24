import Logger from "../Logger/Logger.js";

class BaseController {
    constructor(app) {
        this.app = app;
        this.routes = this.defineRoutes(); 
        this.initRoutes(); 
    }

    defineRoutes() {
        return [];
    }

    initRoutes() {
        if (this.routes) {
            Logger.info("Starting registering routes for Controller: " + this.constructor.name);
            for (let route of this.routes) {
                Logger.info("Registering route [" + route.method.toUpperCase() + "] " + route.path);
                route.register(this.app);
                // to upper
            }
            Logger.success("Routes registered");
        }
    }
}

export default BaseController;
