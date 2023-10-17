import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
class API {

    app = null
    port = null

    constructor(port){
        this.port = port
        this.app = express()
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.listen(this.port)
    }

}

export default API;