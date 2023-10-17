import Logger from "../Logger/Logger.js";

export default class User_Model {

    name = null;
    data = null;
    options = null;

    constructor(name, data={}, options={}) {
        this.name = name;
        this.data = data;
        this.options = options;
        Logger.info(`Model ${this.name} created`);
    }
}