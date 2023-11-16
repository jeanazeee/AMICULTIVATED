<template>
    <div class="greetings">
        <div class="create">
            <button @click="createRoom()">Create Room</button>
            <p id="room-code"></p>
        </div>
        <div class="join-leave">
            <button @click="joinRoom()">Join Room</button>
            <button @click="leaveRoom()">Leave Room</button>
            <input type="text" name="" id="" v-model="roomCode" >
        </div>
    </div>
  </template>

<script setup>
import { ref } from 'vue'
import API from './../api/api.js'


const roomCode = ref()
const api = new API()

const joinRoom = () => {
    api.joinRoom(roomCode.value, "")
}


const leaveRoom = () => {
    api.leaveRoom(roomCode.value, "")
}

const createRoom = async () => {
    try {
        let roomCode = await api.createRoom();
        console.log(roomCode);
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

