<template>
    <div class="room-container">
        <div class="error">
            <p id="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        </div>
        <div class="create-join-room" v-if="!hasCurrentRoom()">
            <div class="create">
                <button class="full-button" @click="createRoom()">Créer une Room</button>
            </div>
            <div class="join">
                <input class="join-input" type="text" name="" id="" v-model="roomCode">
                <button class="join-button" @click="joinRoom()">Rejoindre une Room</button>
            </div>
        </div>
        <div class="leave-room" v-if="hasCurrentRoom()">
            <button class="full-button" @click="leaveRoom()">Quitter la Room</button>
            <p id="room-code">Votre code de Room est : {{ store.state.currentRoomCode }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import API from './../api/api.js'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';


const roomCode = ref()
const store = useStore();
const api = new API(store);
const errorMessage = ref('')
const router = useRouter();


const hasCurrentRoom = () => {
    return store.state.currentRoomCode != "";
}

const joinRoom = async () => {
    try {
        if(roomCode.value == "") throw new Error("Le code de la room ne peut pas être vide");
        let username = store.state.username;
        await api.joinRoom(roomCode.value, username)
        router.push({ name: 'room', params: { roomCode: roomCode.value } });
    } catch (error) {
        errorMessage.value = "Erreur : " + error;
    }
}


const leaveRoom = async () => {
    try {
        let username = store.state.username;
        await api.leaveRoom(username)
    } catch (error) {
        errorMessage.value = "Erreur : " + error;
    }
}

const createRoom = async () => {
    try {
        let username = store.state.username;
        roomCode.value = await api.createRoom(username);
        router.push({ name: 'room', params: { roomCode: roomCode.value } });
    } catch (error) {
        console.error(error);
        errorMessage.value = "Erreur : " + error.response.data.message;
    }
}
</script>

<style scoped>
.room-container {
    height: 100%;
    margin-top: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
}


.create-join-room {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
}

.create {
    display: flex;
    flex-direction: column;
    align-items: center;

}

#room-code {
    color: #fff;
    font-size: 18px;
}

button {
    min-height: 50px;
    min-width: 150px;
    padding: .5em 1em;
    border: none;
    background-color: #a78bfa;
    color: #111827;
    font-size: 15px;
    cursor: pointer;
    transition: background-color .3s ease-in-out;
}

button:hover {
    background-color: #8c68f7;
}

.full-button {
    border-radius: 6px;
}

.join button {
    border-radius: 0 6px 6px 0;
}

.join {
    display: flex;
    align-items: center;
}

.join-input {
    min-height: 50px;
    max-width: 150px;
    padding: 0 1rem;
    color: #fff;
    font-size: 15px;
    border: 1px solid #a78bfa;
    border-radius: 6px 0 0 6px;
    background-color: transparent;
}

.leave-room {
    display: flex;
    flex-direction: column;
    align-items: center;

}

.error{
    color: red;
    text-align: center;
    padding-bottom: 1rem;
}
</style>

