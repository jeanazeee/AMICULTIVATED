import { createStore } from 'vuex';
import AuthAPI from '../api/auth_api.js';


const authApi = new AuthAPI();

export const store = new createStore({
    state: {
        loggedIn: (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).username !== null && JSON.parse(localStorage.getItem('user')).token !== null),
        currentRoundInfos: JSON.parse(localStorage.getItem('currentRoundInfos')) || {
            imageUrl: '',
            answers: [],
            roundStatus: '',
            roundResults: {},
            roundNumber: 0,
            questionType: '',
            hasAnswered: false,
        },
        user: JSON.parse(localStorage.getItem('user')) || {
            userId: '',
            username: '',
            token: '',
        },
        currentRoomInfos: JSON.parse(localStorage.getItem('currentRoomInfos')) || {
            id: '',
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
        login(state, { username, token, userId, currentRoomCode }) {
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
                questionType: '',
                hasAnswered: false,
            };
        },
        saveCurrentRoomInfos(state, currentRoomInfos) {
            state.currentRoomInfos = currentRoomInfos;
        },
        deleteCurrentRoomInfos(state) {
            state.currentRoomInfos = {
                id: '',
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
        login: ({ commit }, { user, roomCode }) => {
            console.log(user, roomCode);
            localStorage.setItem('user', JSON.stringify(user));
            const roomData = { code: roomCode }
            localStorage.setItem('currentRoomInfos', JSON.stringify(roomData));
            commit('login', { username: user.username, token: user.token, userId: user.userId, currentRoomCode: roomCode });
        },
        logout: ({ commit }) => {
            localStorage.removeItem('user');
            localStorage.removeItem('currentRoomInfos');
            localStorage.removeItem('currentRoundInfos');
            commit('logout');
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
        }
    },
    getters: {
        user: state => state.user,
        loggedIn: state => state.loggedIn,
        currentRoundInfos: state => state.currentRoundInfos,
        currentRoomInfos: state => state.currentRoomInfos,
    },

});

