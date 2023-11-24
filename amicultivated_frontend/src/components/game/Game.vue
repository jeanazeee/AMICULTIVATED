<template>

    <div class="game-container">
        {{ artInfo }}
        <img :src="currentRoundInfos.image" alt="">
    </div>
    <div class="restart-room">
        <button class="full-button" @click="restartGame()">Quitter la Room</button>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import {useStore} from 'vuex';

const artInfo = ref({});
const loading = ref(false);
const props = defineProps({
    roomInfos: Object,
    socketManager: Object
});
const store = useStore();

const currentRoundInfos = ref({});

const emit = defineEmits(['restartGame']);


onMounted(() => {
    initSocketHandlers();
});


const initSocketHandlers = () => {
    loading.value = true;
    props.socketManager.onRoundStarted((data) => {
        currentRoundInfos.value.image = data.artInfo.image;
        store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
        console.log("Round started", currentRoundInfos.value.image);
        loading.value = false;
    })
}

const restartGame = () => {
    emit('restartGame');
}
</script>