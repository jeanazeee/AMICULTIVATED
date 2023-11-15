import { DataTypes } from 'sequelize';
import BaseModel from './BaseModels.js';

class RoomModel extends BaseModel{


    constructor() {
        super('Room',{
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            maxPlayers: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            currentPlayerNumber: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            }
        })
        RoomModel.instance = this;
    }


    static getInstance() {
        if (!RoomModel.instance) {
            RoomModel.instance = new RoomModel();
        }
        return RoomModel.instance;
    }
    
}

export default RoomModel;