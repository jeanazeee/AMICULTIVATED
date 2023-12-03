<template>
    <RoomStarting v-if="isGameOpen()" :roomInfos="roomInfo" :errorMessage="errorMessage" @startGame="startGame"
        @leaveRoom="leaveRoom" @updateRoom="sendUpdateRoom" />
    <Game v-if="isGameStarted()" :roomInfos="roomInfo" :socketManager="socketManager" @leaveGame="leaveRoom" @endGame="endGame" @roundEnd="roundEnd" />
</template>

<script setup>
import RoomStarting from './../../components/game/RoomStarting.vue';
import Game from './../../components/game/Game.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import API from './../../api/api.js'
import RoomSocketManager from './../../api/roomSocketManager.js'
import { useStore } from 'vuex';

const roomInfo = ref({});
const errorMessage = ref("");
const route = useRoute();
const router = useRouter();
const roomCode = ref(route.params.roomCode);
const store = useStore();
const api = new API(store);
const socketManager = RoomSocketManager.getInstance();

onMounted(async () => {
    initSocketHandlers();
    await getNewRoomInfo();
});

onUnmounted(() => {
    releaseSocketHandlers();
});

const getNewRoomInfo = async () => {
    roomInfo.value = (await api.getRoomInfos(roomCode.value)).room;
}
const sendUpdateRoom = async (newInfos) => {
    console.log(newInfos)
    try {
        await api.updateRoom(roomCode.value, newInfos.maxPlayers, newInfos.maxRounds);
    } catch (error) {
        handleError(error);
    }
}

const handleError = (error) => {
    errorMessage.value = "Erreur : " + error;
};

const isGameStarted = () => {
    return roomInfo.value.status === 'Started';
}

const isGameOpen = () => {
    return roomInfo.value.status === 'Open';
}

const startGame = async () => {
    try {
        await api.startGame(roomCode.value);
    } catch (error) {   
        handleError(error);
    }
}

const endGame = async () => {
    try {
        await api.endGame(roomCode.value);
    } catch (error) {
        handleError(error);
    }
}

const leaveRoom = async () => {
    try {
        let username = store.getters.user.username;
        await api.leaveRoom(username)
        router.push({ name: 'home' });
    } catch (error) {
        handleError(error);
    }
}

const roundEnd = async () => {
    try {
        await api.getScoresByRoom(roomCode.value);
    } catch (error) {
        handleError(error);
    }
}

const initSocketHandlers = () => {
    socketManager.joinRoom(roomCode.value, store.getters.user);
    socketManager.onUserJoined(getNewRoomInfo);
    socketManager.onUserLeft(getNewRoomInfo);
    socketManager.onRoomUpdated(getNewRoomInfo);
    socketManager.onGameStarted(getNewRoomInfo);
    socketManager.onGameEnded(getNewRoomInfo);
}


const releaseSocketHandlers = () => {
    socketManager.offUserJoined(getNewRoomInfo);
    socketManager.offUserLeft(getNewRoomInfo);
    socketManager.offRoomUpdated(getNewRoomInfo);
    socketManager.offGameStarted(getNewRoomInfo);
}

</script>