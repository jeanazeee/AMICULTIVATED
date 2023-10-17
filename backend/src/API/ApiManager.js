import API from "./API.js";
import ConfigManager from "../Config/ConfigManager.js";

class APIManager {

    configManager = null;
    static createApi(){
        this.configManager = new ConfigManager();
        return new Promise((resolve, reject) => {
            try{
                const api = new API(this.configManager.apiPort);
                resolve(api);
            } catch (e) {
                reject(e);
                throw e;
            }
        });
    }
}

export default APIManager;