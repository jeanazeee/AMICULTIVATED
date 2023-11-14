import API from "./API.js";
import ConfigManager from "../Config/ConfigManager.js";

class APIFactory {

    configManager = null;
    static createApi(){
        this.configManager = new ConfigManager();
        return new Promise((resolve, reject) => {
            try{
                new API(this.configManager.apiPort);
                resolve();
            } catch (e) {
                reject(e);
                throw e;
            }
        });
    }
}

export default APIFactory;