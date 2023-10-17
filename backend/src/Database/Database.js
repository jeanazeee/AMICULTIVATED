import Sequelize from 'sequelize';
import Logger from '../Logger/Logger.js';

class DatabaseConfig{

    host = null;
    port = null;
    database = null;
    username = null;
    password = null;

    constructor(config={}) {
        try{
            this.host = config.host;
            this.port = config.port;
            this.database = config.database;
            this.username = config.username;
            this.password = config.password;
        } catch (e) {
            Logger.error("Database config failed to load");
        }
    }
}

class Database {

    config = null;
    db = null;

    constructor(config=new DatabaseConfig()) {
        this.config = config;
        this.init();
    }

    async init() {
        try{
            const connectionString = this.config.host + ":" + this.config.port
            this.db = new Sequelize(connectionString);
            await this.db.authenticate();
            Logger.success("Connection to database successful");
        }catch (e) {
            Logger.error("Connection to database failed");
            throw e;
        }
    }

    getConfig() {
        return this.config;
    }

}

export {Database, DatabaseConfig};