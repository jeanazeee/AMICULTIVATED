import APIManager from "./src/API/ApiManager.js";
import DefaultController from "./src/Controller/DefaultController.js";

let api = APIManager.init();


//Controller Instanciation
new DefaultController(api.app)