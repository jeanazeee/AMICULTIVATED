import axios from 'axios';


class AuthAPI {

    api = null;
    store = null;

    constructor(store) {
        this.api = axios.create({
            baseURL: 'http://192.168.215.241:3000/',
            timeout: 1000,
        });
        this.store = store;
    }

    async login(username, password) {
        try{
            const response = await this.api.post('/login', {
                username,
                password,
            });


            if (response.status !== 200) {
                throw new Error('Error logging in');
            }
            
            const user = {
                userId: response.data.userId,
                username: username,
                token: response.data.token,
            }

            this.store.dispatch('login', { user: user, roomCode: response.data.currentRoomInfo.code })
        } catch (error) {
            throw error;
        }
    }

    async signup(username, password) {
        try {
            const response =  await this.api.post('/signup', {
                username,
                password,
            });

            if (response.status !== 201) {
                throw new Error('Error signing up');
            }

            const user = {
                userId: response.data.userId,
                username: username,
                token: response.data.token,
            }

            this.store.dispatch('login', { user: user, currentRoomCode: response.data.roomCode })

        } catch (error) {
            throw error;
        }
    }
    
}

export default AuthAPI;