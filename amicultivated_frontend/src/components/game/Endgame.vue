<template>
    <div class="end-game-container">
        <div class="title">
            <h1>Fin de la partie, {{ store.getters.user.username }}</h1>
            <h3>Tu es classé {{ computeRanking() }} / {{ playersLength }} !</h3>
        </div>
        <div class="profile-container">
            <div class="player-card" v-for="player in sortedPlayers">
                <div class="player-info">
                    <p class="name">{{ player.username}} </p>
                    <p class="score">{{ player.score }}</p>
                </div>
            </div>
        </div>
        <div class="home" >
            <button @click="home()">Quitter la partie</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import {store} from './../../store/store.js'

const emits = defineEmits(['home']);

const home = () => {
    emits('home');
}

const players = ref(store.getters.currentRoomInfos.players);
const playersLength = ref(store.getters.currentRoomInfos.players.length);
const sortedPlayers = ref(store.getters.currentRoomInfos.players.sort((a, b) => {
    return b.score - a.score;
}));

const computeRanking = () => {
    let sortedPlayers = players.value.sort((a, b) => {
        return b.score - a.score;
    });
    let index = sortedPlayers.findIndex((player) => {
        return player.username === store.getters.user.username;
    });
    return index + 1 ;
}
</script>

<style  scoped>

.end-game-container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}
.profile-container {
    width: fit-content;
    display: flex;
    flex-direction: column;
    margin: auto;
    background: rgb(17, 24, 39);
    background: radial-gradient(circle, rgba(17, 24, 39, 1) 0%, rgba(21, 31, 54, 1) 100%);
    border-radius: 0.75rem;

}

.title {
    text-align: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 700;
    margin-bottom: 2em;
}

.title h3{
    margin-top: 3em;
    font-size: 1.5rem;
}

.player-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: 3s;
}

.player-info {
    width: 20em;
    display: flex;
    justify-content: space-between;
}

.player-info p {
    padding: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-weight: 400;
}

.name {
    padding: 2em;
    width: 50%;
}

.score {
    padding: 2em;
    margin: auto;
}
.home {
    margin-top: 2em;
    background-color: white;
    border-radius:5px;
    margin-bottom: 2em;
    text-align: center;
    color: black;
}

.home button {
    width: 10em;
    height: 2.5em;
    border-radius: 5px;
    font-size: 1.3rem;
    font-weight: 500;
}

</style>