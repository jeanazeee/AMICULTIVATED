<template>
    <div class="room-container">
        <div class="room-frame">
            <div class="player-list">
                <div class="player-card" v-for="playerInfo in props.roomInfos.players" :key="playerInfo.id">
                    {{ playerInfo.username }}
                </div>
            </div>
            <div class="main">
                <div v-if="errorMessage != ''">{{ errorMessage }}</div>
                <div class="title">Room : {{ roomCode }}</div>
                <div class="settings">
                    <div class="max-players">
                        <label for="playerRange">Nombre de joueurs max</label>
                        <div class="slider">
                            <input type="range" name="playerRange" id="" v-model="props.roomInfos.maxPlayers" max="12"
                                @change="sliderChange()">
                            {{ props.roomInfos.maxPlayers }}
                        </div>

                    </div>
                    <div class="copy-link">
                        <input type="text" name="" id="" :value="fullPath" disabled>
                        <button class="copy" @click="copyPath()">Copier</button>
                    </div>
                </div>
                <div class="start-game">
                    <button class="full-button" @click="startGame()">Lancer la partie</button>
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
import { useStore } from 'vuex';

const router = useRouter();
const route = useRoute();
const roomCode = ref(route.params.roomCode);
const store = useStore();
const errorMessage = ref("");
const fullPath = ref(window.location.origin + route.fullPath);

const props = defineProps({
    roomInfos: Object,
    errorMessage: String
});

const emit = defineEmits(['startGame', 'leaveRoom', 'updateRoom']);


const startGame = () => {
    emit('startGame')
}

const leaveRoom = async () => {
    emit('leaveRoom')
}

const sliderChange = () => {
    emit('updateRoom', props.roomInfos)
}

const copyPath = () => {
    navigator.clipboard.writeText(fullPath.value);
}

</script>

<style scoped>
.room-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    overflow-y: visible;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.player-card {
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
    background-color: grey;
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

.leave-room button {
    margin: 1em;
}
</style>