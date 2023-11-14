import dotenv from "dotenv"

export default class ConfigManager {

    static instance = null;
    api = null;
    db = null;
    jwt_secret = null;

  constructor(path="") {
    if(ConfigManager.instance){
        return ConfigManager.instance;
    }

    dotenv.config(path)
    this.api = {
        port: process.env.API || 3000
    }

    this.db = {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || "database",
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "",
    }

    this.jwt_secret = process.env.JWT_SECRET

    ConfigManager.instance = this;
  }

  get apiPort(){
    return this.api.port;
  }

  get dbConfig(){
    return this.db;
  }

  get jwtSecret(){
    return this.jwt_secret;
  }
}