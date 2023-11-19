<template>
    <div class="greetings">
        <div class="create">
            <button @click="createRoom()">Create Room</button>
            <p id="room-code"></p>
        </div>
        <div class="join-leave">
            <button @click="joinRoom()">Join Room</button>
            <input type="text" name="" id="" v-model="roomCode" >
            <button @click="leaveRoom()" v-if="hasCurrentRoom()">Leave Room</button>

        </div>
    </div>
  </template>

<script setup>
import { ref } from 'vue'
import API from './../api/api.js'
import { useStore } from 'vuex';


const roomCode = ref()
const api = new API()
const store = useStore();

const hasCurrentRoom = () => {
    return store.state.currentRoomCode != "";
}

const joinRoom = () => {
    let username = store.state.username;
    api.joinRoom(roomCode.value, username)
}


const leaveRoom = () => {
    let username = store.state.username;
    api.leaveRoom(username)
}

const createRoom = async () => {
    try {
        let roomCode = await api.createRoom();
        document.getElementById("room-code").innerHTML = "Room code : " + roomCode;
    } catch (error) {
        console.error('Error in createRoom:', error);
    }
}
</script>

<style scoped>

/* greetings take all the page, and each div inside take 50 width */

.greetings {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
}

.create {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}

.join-leave {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}
</style>

