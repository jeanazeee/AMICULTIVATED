import API from "./API.js";
import ConfigManager from "../Config/ConfigManager.js";

class APIManager {

    configManager = null;
    static init(){
        this.configManager = new ConfigManager();
        return new Promise((resolve, reject) => {
            resolve(this.createApi());
        });
    }

    static createApi(){
        return new API(this.configManager.apiPort);
    }
}

export default APIManager;