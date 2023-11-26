<template>
    <div class="round-container">
        <div class="roundOn-container" v-if="isRoundGoing()">
            <img :src="currentRoundInfos.image" alt="">
            <div class="answers">
                <button class="answer" v-for="artAnswer in currentRoundInfos.artAnswers"
                    @click="submitAnswer(artAnswer.id)">
                    {{ artAnswer.title }}
                    {{ artAnswer.artistName }}
                </button>
            </div>
        </div>
        <div class="roundOff-container" v-if="isRoundFinished()">
            <img :src="currentRoundInfos.image" alt="">
            <div v-for="result in currentRoundInfos.roundResults">
                {{ result.username }} : {{ result.score }}
            </div>
            <button @click="startNextRound()" v-if="hasNextRound()">Next Round</button>
            <button @click="endGame()" v-if="isGameFinished()">End Game</button>
        </div>
        <div class="restart-room">
            <button class="full-button" @click="leaveGame()">Quitter la Room</button>
        </div>
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
    artAnswers: [],
    roundStatus: "",
    roundResults: {},
    roundNumber: 0
});


const emit = defineEmits(['leaveGame', 'endGame', 'roundEnd']);


onMounted(() => {
    initSocketHandlers();
    currentRoundInfos.value = store.getters.currentRoundInfos;
});


const initSocketHandlers = () => {
    loading.value = true;
    props.socketManager.onRoundStarted((data) => {
        formatRoundInfos(data.artInfo);
        currentRoundInfos.value.roundStatus = "Going"
        currentRoundInfos.value.roundNumber++;
        store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
        loading.value = false;
    });

    props.socketManager.onRoundEnded((data) => {
        currentRoundInfos.value.roundStatus = "Finished"
        currentRoundInfos.value.roundResults = data.roundResults;
        //add from currentRoundInfos and roundResults
        store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
        //scores will be updated by parent
        emit('roundEnd');
        loading.value = false;
    });

}

const leaveGame = () => {
    emit('leaveGame');
}

const formatRoundInfos = (artsInfo) => {
    currentRoundInfos.value.artAnswers = [];
    currentRoundInfos.value.image = artsInfo[0].image;
    for (let i = 0; i < artsInfo.length; i++) {
        currentRoundInfos.value.artAnswers.push(artsInfo[i]);
    }
    shuffleArray(currentRoundInfos.value.artAnswers);
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const submitAnswer = (artAnswerId) => {
    props.socketManager.submitAnswer(store.getters.currentRoomInfos.code, store.getters.user, artAnswerId);
}

const startNextRound = () => {
    props.socketManager.startNextRound(store.getters.currentRoomInfos.code);
}

const endGame = () => {
    emit('endGame');
}

const isRoundGoing = () => {
    return currentRoundInfos.value.roundStatus === "Going";
}

const isRoundFinished = () => {
    return currentRoundInfos.value.roundStatus === "Finished";
}

const hasNextRound = () => {
    return currentRoundInfos.value.roundNumber < props.roomInfos.maxRounds;
}

const isGameFinished = () => {
    return currentRoundInfos.value.roundNumber === props.roomInfos.maxRounds;
}



</script>