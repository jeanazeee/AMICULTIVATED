import API from "./API.js";

class APIManager {
    static init(){
        const api = new API(3000);
        return api;
    }
}

export default APIManager;