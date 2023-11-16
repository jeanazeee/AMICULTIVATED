import axios from 'axios';


class AuthAPI {

    api = null;

    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:3000/',
            timeout: 1000,
        });
    }

    login(username, password) {
        return this.api.post('/login', {
            username,
            password,
        });
    }

    signup(username, password) {
        return this.api.post('/signup', {
            username,
            password,
        });
    }
    
}

export default AuthAPI;