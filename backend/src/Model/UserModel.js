import { DataTypes } from 'sequelize';
import { Database } from '../Database/Database.js';

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
            }
        });
    }
    return User;
}
