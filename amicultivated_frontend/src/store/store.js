import { createStore } from 'vuex';
import AuthAPI from '../api/auth_api.js';


const authApi = new AuthAPI();

export const store = new createStore({
    state: {
        loggedIn: (localStorage.getItem('username') !== null && localStorage.getItem('token') !== null),
        username: localStorage.getItem('username') || '',
        token: localStorage.getItem('token') || '',
    },
    mutations: {
        login(state, {username, token}) {
            state.loggedIn = true;
            state.username = username;
            state.token = token;
        },
        logout(state) {
            state.loggedIn = false;
            state.username = '';
            state.token = '';
        }
    },
    actions: {
        login: ({ commit }, { username, password }) => {
            return authApi.login(username, password)
                .then((response) => {
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', response.data.token);
                    commit('login', { username, token: response.data.token });
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
                    commit('login', { username, token: response.data.token });
                    localStorage.setItem('username', username);
                    localStorage.setItem('token', response.data.token);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
    getters: {
        username: state => state.username,
        loggedIn: state => state.loggedIn,
        token: state => state.token,
    },
});

