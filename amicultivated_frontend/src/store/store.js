import { createStore } from 'vuex';
import AuthAPI from '../api/auth_api.js';


const authApi = new AuthAPI();

export const store = new createStore({
    state: {
        loggedIn: (localStorage.getItem('usename') !== null && localStorage.getItem('token') !== null),
        currentRoundInfos: JSON.parse(localStorage.getItem('currentRoundInfos')) || {
            imageUrl: '',
            answers: [],
            roundStatus: '',
            roundResults: {},
            roundNumber: 0,
        },
        user: JSON.parse(localStorage.getItem('user')) || {
            userId: '',
            username: '',
            token: '',
        },
        currentRoomInfos: JSON.parse(localStorage.getItem('currentRoomInfos')) || {
            code: '',
            maxPlayers: 0,
            players: {},
            status: "",
            currentRoundNumber: 0,
            currentRoundStatus: '',
            currentRoundResults: {},
        }
    },
    mutations: {
        login(state, {username, token, userId, currentRoomCode}) {
            state.loggedIn = true;
            state.currentRoomInfos.code = currentRoomCode;
            state.user = {
                userId: userId,
                username: username,
                token: token,
            };
        },
        logout(state) {
            state.loggedIn = false;
            state.currentRoomInfos.code = '';
            state.user = {
                userId: '',
                username: '',
                token: '',
            };
        },
        saveCurrentRoundInfos(state, currentRoundInfos) {
            state.currentRoundInfos = currentRoundInfos;
        },
        deleteCurrentRoundInfos(state) {
            state.currentRoundInfos = {
                imageUrl: '',
                answers: [],
                roundStatus: '',
                roundResults: {},
                roundNumber: 0,
            };
        },
        saveCurrentRoomInfos(state, currentRoomInfos) {
            state.currentRoomInfos = currentRoomInfos;
        },
        deleteCurrentRoomInfos(state) {
            state.currentRoomInfos = {
                code: '',
                maxPlayers: 0,
                players: {},
                status: "",
                currentRoundNumber: 0,
                currentRoundStatus: '',
                currentRoundResults: {},
            };
        },
        changeRoomStatus(state, status) {
            state.currentRoomInfos.status = status;
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
                    roomData = {code: response.data.currentRoomCode}
                    localStorage.setItem('currentRoomInfos', JSON.stringify(roomData));
                    commit('login', { username: user.username, token: user.token, userId:user.userId, currentRoomCode: response.data.currentRoomCode });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        logout: ({ commit }) => {
            localStorage.removeItem('user');
            localStorage.removeItem('currentRoomInfos');
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
                    roomData = {code: response.data.currentRoomCode}
                    localStorage.setItem('currentRoomInfos', JSON.stringify(roomData));
                    commit('login', { username, token: response.data.token, userId:response.data.userId , currentRoomCode: response.data.currentRoomCode });
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        
        saveCurrentRoundInfos: ({ commit }, { currentRoundInfos }) => {
            commit('saveCurrentRoundInfos', currentRoundInfos);
            localStorage.setItem('currentRoundInfos', JSON.stringify(currentRoundInfos));
        },
        saveCurrentRoomInfos: ({ commit }, { currentRoomInfos }) => {
            commit('saveCurrentRoomInfos', currentRoomInfos);
            localStorage.setItem('currentRoomInfos', JSON.stringify(currentRoomInfos));
        },
        deleteRoomInfos: ({ commit }) => {
            commit('deleteCurrentRoomInfos');
            localStorage.removeItem('currentRoomInfos');

            commit('deleteCurrentRoundInfos');
            localStorage.removeItem('currentRoundInfos');
        },
        changeRoomStatus: ({ commit }, { status }) => {
            const currentRoomInfos = JSON.parse(localStorage.getItem('currentRoomInfos'));
            currentRoomInfos.status = status;
            commit('saveCurrentRoomInfos', currentRoomInfos);
            localStorage.setItem('currentRoomInfos', JSON.stringify(currentRoomInfos));
        },
    },
    getters: {
        user: state => state.user,
        loggedIn: state => state.loggedIn,
        currentRoundInfos: state => state.currentRoundInfos,
        currentRoomInfos: state => state.currentRoomInfos,
    },

});

