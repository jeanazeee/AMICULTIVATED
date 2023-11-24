<template>

    <div class="game-container">
        {{ artInfo }}
        <img :src="artInfo.image" alt="">
    </div>
    <div class="restart-room">
        <button class="full-button" @click="restartGame()">Quitter la Room</button>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const artInfo = ref({});
const loading = ref(false);
const props = defineProps({
    roomInfos: Object,
    socketManager: Object
});

const emit = defineEmits(['restartGame']);


onMounted(() => {
    initSocketHandlers();
});


const initSocketHandlers = () => {
    loading.value = true;
    props.socketManager.onRoundStarted((data) => {
        artInfo.value = data.artInfo;
        console.log("Round started", artInfo);
        loading.value = false;
    })
}

const restartGame = () => {
    emit('restartGame');
}
</script>