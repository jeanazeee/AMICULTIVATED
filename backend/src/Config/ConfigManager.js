import dotenv from "dotenv"

export default class ConfigManager {

    api = null;

  constructor(path="") {
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
  }

  get apiPort(){
    return this.api.port;
  }

  get dbConfig(){
    return this.db;
  }
}