import { createStore } from 'vuex';
import AuthAPI from '../api/auth_api.js';


const authApi = new AuthAPI();

export const store = new createStore({
    state: {
        loggedIn: (localStorage.getItem('usename') !== null && localStorage.getItem('token') !== null),
        username: localStorage.getItem('username') || '',
        token: localStorage.getItem('token') || '',
        currentRoomCode: localStorage.getItem('currentRoomCode') || '',
    },
    mutations: {
        login(state, {username, token, currentRoomCode}) {
            state.loggedIn = true;
            state.username = username;
            state.token = token;
            state.currentRoomCode = currentRoomCode;
        },
        logout(state) {
            state.loggedIn = false;
            state.username = '';
            state.token = '';
            state.currentRoomCode = '';
        },
        setCurrentRoomCode(state, currentRoomCode) {
            state.currentRoomCode = currentRoomCode;
        },
        deleteCurrentRoomCode(state) {
            state.currentRoomCode = '';
        }
    },
    actions: {
        login: ({ commit }, { username, password }) => {
            return authApi.login(username, password)
                .then((response) => {
                    console.log(response);
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('currentRoomCode', response.data.currentRoomCode);
                    commit('login', { username, token: response.data.token, currentRoomCode: response.data.currentRoomCode });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        logout: ({ commit }) => {
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            commit('logout');
        },
        signup: ({ commit }, { username, password }) => {
            return authApi.signup(username, password)
                .then((response) => {
                    commit('login', { username, token: response.data.token, currentRoomCode: response.data.currentRoomCode });
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('currentRoomCode', response.data.currentRoomCode);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        setCurrentRoomCode: ({ commit }, { currentRoomCode }) => {
            commit('setCurrentRoomCode', currentRoomCode);
            localStorage.setItem('currentRoomCode', currentRoomCode);
        },
        deleteCurrentRoomCode: ({ commit }) => {
            commit('deleteCurrentRoomCode');
            localStorage.removeItem('currentRoomCode');
        }
    },
    getters: {
        username: state => state.username,
        loggedIn: state => state.loggedIn,
        token: state => state.token,
        currentRoomCode: state => state.currentRoomCode,
    },
});

