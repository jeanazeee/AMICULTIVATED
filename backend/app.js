import APIManager from "./src/API/ApiManager.js";

let api = APIManager.init();

api.app.get('/', (req, res) => {
    res.send('Server Working!');
});