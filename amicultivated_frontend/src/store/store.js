import { createStore } from 'vuex';
import AuthAPI from '../api/auth_api.js';


const authApi = new AuthAPI();

export const store = new createStore({
    state: {
        loggedIn: (localStorage.getItem('usename') !== null && localStorage.getItem('token') !== null),
        currentRoomCode: localStorage.getItem('currentRoomCode') || '',
        currentRoundInfos: JSON.parse(localStorage.getItem('currentRoundInfos')) || {
            imageUrl: '',
            answers: [],
        },
        user: JSON.parse(localStorage.getItem('user')) || {
            userId: '',
            username: '',
            token: '',
        },
    },
    mutations: {
        login(state, {username, token, userId, currentRoomCode}) {
            state.loggedIn = true;
            state.currentRoomCode = currentRoomCode;
            state.user = {
                userId: userId,
                username: username,
                token: token,
            };
        },
        logout(state) {
            state.loggedIn = false;
            state.currentRoomCode = '';
            state.user = {
                userId: '',
                username: '',
                token: '',
            };
        },
        setCurrentRoomCode(state, currentRoomCode) {
            state.currentRoomCode = currentRoomCode;
        },
        deleteCurrentRoomCode(state) {
            state.currentRoomCode = '';
        },
        saveCurrentRoundInfos(state, currentRoundInfos) {
            state.currentRoundInfos = currentRoundInfos;
        },
        deleteCurrentRoundInfos(state) {
            state.currentRoundInfos = {
                imageUrl: '',
                answers: [],
            };
        }
    },
    actions: {
        login: ({ commit }, { username, password }) => {
            return authApi.login(username, password)
                .then((response) => {
                    const user = {
                        userId: response.data.userId,
                        username: username,
                        token: response.data.token,
                    }
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('currentRoomCode', response.data.currentRoomCode);
                    commit('login', { username, token: response.data.token, currentRoomCode: response.data.currentRoomCode });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        logout: ({ commit }) => {
            localStorage.removeItem('user');
            localStorage.removeItem('currentRoomCode');
            commit('logout');
        },
        signup: ({ commit }, { username, password }) => {
            return authApi.signup(username, password)
                .then((response) => {
                    const user = {
                        userId: response.data.userId,
                        username: username,
                        token: response.data.token,
                    }
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('currentRoomCode', response.data.currentRoomCode);
                    commit('login', { username, token: response.data.token, userId:response.data.userId , currentRoomCode: response.data.currentRoomCode });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        setCurrentRoomCode: ({ commit }, { currentRoomCode }) => {
            localStorage.setItem('currentRoomCode', currentRoomCode);
            commit('setCurrentRoomCode', currentRoomCode);
        },
        deleteRoomInfos: ({ commit }) => {
            commit('deleteCurrentRoomCode');
            localStorage.removeItem('currentRoomCode');

            commit('deleteCurrentRoundInfos');
            localStorage.removeItem('currentRoundInfos');
        },
        saveCurrentRoundInfos: ({ commit }, { currentRoundInfos }) => {
            commit('saveCurrentRoundInfos', currentRoundInfos);
            localStorage.setItem('currentRoundInfos', JSON.stringify(currentRoundInfos));
        },
    },
    getters: {
        user: state => state.user,
        loggedIn: state => state.loggedIn,
        currentRoomCode: state => state.currentRoomCode,
        currentRoundInfos: state => state.currentRoundInfos,
    },
});

