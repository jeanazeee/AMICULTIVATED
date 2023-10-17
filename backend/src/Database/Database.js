import Sequelize from 'sequelize';
import Logger from '../Logger/Logger.js';

class DatabaseConfig{

    dialect = null;
    storage = null;

    constructor(config={}) {
        try{
            this.dialect = config.host;
            this.storage = config.port;
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
            this.db = new Sequelize({
                dialect: this.config.dialect,
                storage: this.config.storage,
            });
            
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