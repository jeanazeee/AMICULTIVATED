<template>
    <div class="room-container">
        <div class="room-frame">
            <div class="player-list">
                <div class="player-card" v-for="player in settings.players" :key="player.id">
                    {{ player }}
                </div>
            </div>
            <div class="main">
                <div class="title">Room : {{ roomCode }}</div>
                <div class="settings">
                    <div class="max-players">
                        <label for="playerRange">Nombre de joueurs max</label>
                        <div class="slider">
                            <input type="range" name="playerRange" id="" v-model="settings.maxPlayers" max="12" @change="sliderChange()">
                            {{ settings.maxPlayers }}
                        </div>

                    </div>
                    <div class="copy-link">
                        <input type="text" name="" id="" :value="settings.fullPath" disabled>
                        <button class="copy" @click="copyPath()">Copier</button>
                    </div>
                </div>
                <div class="start-game">
                    <button class="full-button" @click="createRoom()">Lancer la partie</button>
                </div>
                <div class="leave-room">
                    <button class="full-button" @click="leaveRoom()">Quitter la Room</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import API from './../../api/api.js'
import { useStore } from 'vuex';
import RoomSocketManager from './../../api/roomSocketManager.js'

const router = useRouter();
const route = useRoute();
const roomCode = ref(route.params.roomCode);
const store = useStore();
const api = new API(store);
const socketManager = RoomSocketManager.getInstance();

const settings = ref({
    maxPlayers: 0,
    fullPath: "",
    players: []
});

onMounted(async () => {
    init();
}),

onUnmounted(() => {
    socketManager.offUserJoined(getUpdateRoom);
    socketManager.offUserLeft(getUpdateRoom);
    socketManager.offRoomUpdated(getUpdateRoom);
}),


    // watch route params for changes
    watch(async () => route.params.roomCode, async (newRoomCode) => {
        init();
    });



const init = async () => {
    getUpdateRoom();
    initSocketHandlers();
}

const initSocketHandlers = () => {
    socketManager.joinRoom(roomCode.value, store.getters.username);
    socketManager.onUserJoined(getUpdateRoom);
    socketManager.onUserLeft(getUpdateRoom);
    socketManager.onRoomUpdated(getUpdateRoom);
}

const getUpdateRoom = async () => {
    const datas = await api.getRoomInfos(roomCode.value);
    settings.value.players = datas.room.players;
    settings.value.fullPath = window.location.origin + route.fullPath
    settings.value.maxPlayers = datas.room.maxPlayers;
}

const sendUpdateRoom = async () => {
    await api.updateRoom(roomCode.value, settings.value.maxPlayers);
}

const leaveRoom = async () => {
    try {
        let username = store.state.username;
        await api.leaveRoom(username)
        router.push({ name: 'home' });
    } catch (error) {
        errorMessage.value = "Erreur : " + error;
    }
}

const copyPath = () => {
    navigator.clipboard.writeText(settings.value.fullPath);
}

const sliderChange = () => {
    sendUpdateRoom();
}
</script>

<style scoped>
.room-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
}

.room-frame {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 90%;
    width: 70vw;
    background: #42385a;
    color: white;
    border-radius: 0.75rem;
}

.player-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20%;
    color: white;
    height: 100%;
    overflow-y: visible;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.player-card {
    height: 100%;
    font-size: 2rem;
}

.main {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 80%;
    color: white;
}


.main .title {
    margin-top: 3rem;
    font-size: 3rem;
    height: 10%;
}

.main .settings {
    height: 80%;
}

.main .start-game {
    height: 10%;
}

.main .start-game button {
    min-height: 50px;
    min-width: 150px;
    padding: .5em 1em;
    border: none;
    background-color: #a78bfa;
    font-size: 15px;
    cursor: pointer;
    transition: background-color .3s ease-in-out;
}


.main .start-game button:hover {
    background-color: #8c68f7;
}

.full-button {
    border-radius: 6px;
}

.settings {
    margin-top: 50px;
    font-size: 1.5rem;
}

.settings .max-players label {
    margin-right: 20px;
}

.slider {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.max-players {
    display: flex;
}


.copy-link {
    display: flex;
    align-items: center;
    justify-content: center;
}

.copy-link input {
    height: 50px;
    width: 280px;
    margin-right: 20px;
    font-size: 1rem;
    text-align: center;
    /* hide disabled style */
    background-color: white;
}

.copy-link button {
    min-height: 50px;
    min-width: 150px;
    padding: .5em 1em;
    border: none;
    background-color: #a78bfa;
    font-size: 15px;
    cursor: pointer;
    transition: background-color .3s ease-in-out;
    border-radius: 6px;
}
</style>