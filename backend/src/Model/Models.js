import Logger from "../Logger/Logger.js";
import {Database} from "../Database/Database.js";

export default class Models {

    static #registeredModels = [];

    
    static registerModel(model){
        this.#registeredModels.push(model);
    }

    static initModels(){
        return new Promise((resolve, reject) => {
            try {
                this.#registeredModels.forEach((model) => {
                    Database.instance.db.define(model.name, model.data, model.options);
                    Logger.success(`Models ${model.name} created`);
                });

                resolve();
            } catch (e) {
                Logger.error("Models failed to init");
                reject(e);
            }
        });
    }

    static getRegisteredModels(){
        return this.#registeredModels;
    }
}