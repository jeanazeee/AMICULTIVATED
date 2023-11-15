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

}

export default UserRepository;