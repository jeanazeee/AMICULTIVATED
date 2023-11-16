import { DataTypes } from 'sequelize';
import BaseModel from './BaseModels.js';

let User;

export const getUserModel = () => {
    if (!User) {
        User = Database.instance.db.define('User', {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            currentRoomId: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        });
    }
    return User;
}
