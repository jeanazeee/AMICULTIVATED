import express from "express";
import cors from 'cors';
import Logger from "../Logger/Logger.js";
class API {

    app = null
    port = null

    constructor(port){
        this.port = port
        this.app = express()
        this.app.use(cors())
        this.app.listen(this.port)
    }

}

export default API;