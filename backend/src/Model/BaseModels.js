import { Database } from '../Database/Database.js';


class BaseModel {
    static instances = new Map();

    model = null;

    constructor(modelName, attributes) {
        if (BaseModel.instances.get(modelName)) {
            return BaseModel.instances.get(modelName);
        }

        this.model = this.createModel(modelName, attributes);
        BaseModel.instances.set(modelName, this);
    }

    createModel(modelName, attributes) {
        return Database.instance.db.define(modelName, attributes);
    }

    getModel() {
        return this.model;
    }

}

export default BaseModel;