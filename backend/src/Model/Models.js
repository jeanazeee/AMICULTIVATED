import Logger from "../Logger/Logger.js";
import UserModel from "./UserModel.js";
import RoomModel from "./RoomModel.js";

class Models {

    static get allModels() {
        return [UserModel.getInstance(), RoomModel.getInstance()];
    }

    static initModels() {
        return new Promise(async (resolve, reject) => {
            try {
    
                for (let model of Models.allModels) {
                    let modelInstance = model.getModel();
                    await modelInstance.sync({alter: true});
                    Logger.success(`Model ${modelInstance.name} synced`);
                }
            } catch (e) {
                Logger.error("Failed to init and sync models");
                throw e;
            }
        });
    }


}

export { Models };
