import UserModel from '../Model/UserModel.js';

class UserRepository {
  
    model = null;

    constructor() {
        this.model = UserModel.getInstance().getModel();
    }


    getUserByUsername = (username) => {
        return this.model.findOne({ where: { username: username } });
    }

    createUser = (username, password) => {
        return this.model.create({
            username: username,
            password: password
        });
    }

    addRoomToUser = (username, roomId) => {
        return this.model.update({ currentRoomId: roomId }, { where: { username: username } });
    }

    removeRoomFromUser = (username) => {
        return this.model.update({ currentRoomId: null }, { where: { username: username } });
    }

    getUsersByRoomId = (roomId) => {
        return this.model.findAll({ where: { currentRoomId: roomId } });
    }

    addScoreById = (userId, score) => {
        return this.model.increment('score', { by: score, where: { id: userId } });
    }

    resetScoreById = (userId) => {
        return this.model.update({ score: 0 }, { where: { id: userId } });
    }

    resetScoreByRoomId = (roomId) => {
        return this.model.update({ score: 0 }, { where: { currentRoomId: roomId } });
    }
}

export default UserRepository;