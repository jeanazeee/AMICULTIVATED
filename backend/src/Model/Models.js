import Logger from "../Logger/Logger.js";
import { getUserModel } from "./UserModel.js";

class Models {

    static get allModels() {
        return [getUserModel()];
    }

    static initModels() {
        return new Promise(async (resolve, reject) => {
            try {
    
                for (let model of Models.allModels) {
                    await model.sync({alter: true});
                    Logger.success(`Model ${model.name} synced`);
                }
            } catch (e) {
                Logger.error("Failed to init and sync models");
                throw e;
            }
        });
    }
}

export { Models };
