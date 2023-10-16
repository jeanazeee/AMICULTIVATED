import express from "express";
import cors from 'cors';
class API {

    app = null
    port = null

    constructor(port){
        this.port = port
        this.app = express()
        this.app.use(cors())
        this.app.listen(this.port, this.listenFunction)
    }


    listenFunction = () => {
        console.log("Serveur Démarré sur le port " + this.port);
    }
}

export default API;