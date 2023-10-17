import dotenv from "dotenv"

export default class ConfigManager {

    api = null;

  constructor(path="") {
    dotenv.config(path)
    this.api = {
        port: process.env.API || 3000
    }
  }

  get apiPort(){
    return this.api.port;
  }
}