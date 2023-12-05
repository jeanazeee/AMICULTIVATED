import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
class API {

    app = null
    port = null
    static instance = null
    server = null

    constructor(port){
        if(API.instance){
            return API.instance;
        }

        this.port = port
        this.app = express()
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.server = this.app.listen(this.port)

        API.instance = this;
    }
}

export default API;