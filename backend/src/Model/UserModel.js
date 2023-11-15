import { DataTypes } from 'sequelize';
import BaseModel from './BaseModels.js';
import Logger from '../Logger/Logger.js';

class UserModel extends BaseModel{

    static instance = null;

    constructor() {
        super('User',{
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        })
        UserModel.instance = this;
    }


    static getInstance() {
        if (!UserModel.instance) {
            UserModel.instance = new UserModel();
        }
        return UserModel.instance;
    }
    

}

export default UserModel;