<template>
    <div class="game-container">
        <img :src="currentRoundInfos.image" alt="">
        <div class="answers">
            <button class="answer" v-for="answer in currentRoundInfos.answers" @click="submitAnswer(answer)">
                {{ answer }}
            </button>
        </div>
    </div>
    <div class="restart-room">
        <button class="full-button" @click="restartGame()">Quitter la Room</button>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const loading = ref(false);
const props = defineProps({
    roomInfos: Object,
    socketManager: Object
});
const store = useStore();
const currentRoundInfos = ref({
    image: "",
    answers: []
});

const emit = defineEmits(['restartGame']);


onMounted(() => {
    initSocketHandlers();
    currentRoundInfos.value = store.getters.currentRoundInfos;
});


const initSocketHandlers = () => {
    loading.value = true;
    props.socketManager.onRoundStarted((data) => {
        console.log("Round started");
        formatRoundInfos(data.artInfo);
        store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
        loading.value = false;
    })
}

const restartGame = () => {
    emit('restartGame');
}

const formatRoundInfos = (artsInfo) => {
    currentRoundInfos.value.answers = [];
    currentRoundInfos.value.image = artsInfo[0].image;
    for (let i = 0; i < artsInfo.length; i++) {
        currentRoundInfos.value.answers.push(artsInfo[i].title);
    }
    shuffleArray(currentRoundInfos.value.answers);
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const submitAnswer = (answer) => {
    console.log("Answering round");
    props.socketManager.submitAnswer(store.getters.currentRoomCode,store.getters.user,answer);
}
</script>