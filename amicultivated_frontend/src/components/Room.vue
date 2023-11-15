<template>
    <div class="greetings">
        <button @click="joinRoom()">Join Room</button>
        <button @click="leaveRoom()">Leave Room</button>
        <input type="text" name="" id="" v-model="roomCode" >
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


</script>
