<template>
    <p class="title" id="room-code">Votre code de Room est : {{ store.getters.currentRoomInfos.code }}</p>
    <div class="join-leave">
        <div class="leave-room">
            <button class="full-button" @click="leaveRoom()">Quitter la Room</button>
        </div>
        <div class="join-room">
            <button class="full-button" @click="joinRoom( store.getters.currentRoomInfos.code)">Rejoindre la Room</button>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useStore();


const emit = defineEmits(['leaveRoom', 'joinRoom']);

const leaveRoom = () => {
    emit('leaveRoom')
}

const joinRoom = (roomCode) => {
    router.push({ name: 'room', params: { roomCode: roomCode } });
}

</script>

<style scoped>
.title {
  margin: 0 auto;
  text-align: center;
  padding-bottom: 1em;
  font-weight: 900;
  width: 70%;
  font-size:xx-large;
}
.join-leave{
    text-align: center;
}

button {
    margin-top: 2em;
    background-color: black;
    padding:1em;
    border-radius: 5px;
    color: white;
    font-size: 1rem;
    font-weight: 700;
}
button:hover {
    background-color: rgb(55, 40, 55);
}

</style>