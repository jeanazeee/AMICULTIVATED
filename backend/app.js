import APIManager from "./src/API/ApiManager.js";
import DefaultController from "./src/Controller/DefaultController.js";
import AuthController from "./src/Controller/AuthController.js";
import Logger from "./src/Logger/Logger.js"

const init = async () => {
    try {
        const api = await APIManager.init();
        Logger.success("API Started on port " + api.port);

        // Controller Instanciation
        initController(api.app);
    } catch (e) {
        Logger.error("API Failed to start");
        console.log(e);
    }
}

const initController = (app) => {
    new DefaultController(app);
    new AuthController(app);
}

init();