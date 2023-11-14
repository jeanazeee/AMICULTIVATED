import ConfigManager from '../Config/ConfigManager.js';
import Logger from '../Logger/Logger.js';
import { Database, DatabaseConfig } from './Database.js';

export default class DatabaseFactory {


    static instance = null;
    configManager = null;

    static init() {
        return new Promise(async (resolve, reject) => {
            try{
                await this.createDb();
                await this.initModels();
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
    static createDb() {
        return new Promise((resolve, reject) => {
            try {
                this.configManager = new ConfigManager();
                let dbConfig = new DatabaseConfig(this.configManager.dbConfig);
                new Database(dbConfig);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}