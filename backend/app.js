import APIManager from "./src/API/ApiManager.js";
import DefaultController from "./src/Controller/DefaultController.js";
import AuthController from "./src/Controller/AuthController.js";
import Logger from "./src/Logger/Logger.js"
import DatabaseFactory from "./src/Database/DatabaseFactory.js";
import { Models } from "./src/Model/Models.js";
import Sequelize from 'sequelize';

const init = async () => {
    //DB Instanciation
    DatabaseFactory.createDb()
        .then(() => {
            Logger.success("Database Started");
            Models.initModels();
        })
        .catch((e) => {
            Logger.error("Database Failed to start");
            console.log(e);
        });


    // API Instanciation
    APIManager.createApi().then((api) => {
        Logger.success("API Started on port " + api.port);
        initController(api.app);
    }).catch((e) => {
        Logger.error("API Failed to start");
    });
}

const initController = (app) => {
    new DefaultController(app);
    new AuthController(app);
}

init();