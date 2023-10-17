import ConfigManager from '../Config/ConfigManager.js';
import {Database, DatabaseConfig} from './Database.js';

export default class DatabaseManager {

    configManager = null;
        static createDb() {

            return new Promise((resolve, reject) => {
                try{
                    this.configManager = new ConfigManager();
                    let dbConfig = new DatabaseConfig(this.configManager.dbConfig);
                    let db = new Database(dbConfig);
                    resolve(db);
                } catch (e) {
                    reject(e);
                }
            });
        }
}