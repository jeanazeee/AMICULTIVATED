<template>
    <div class="game-container" v-if="displayGame()">
        <div class="left-container">
            <div class="players">
                <h2>Joueurs</h2>
                <div class="player-card" v-for="player in props.roomInfos.players" :key="player.id">
                    {{ player.username }} : {{ player.score }}
                </div>
            </div>
            <div class="leave-room">
                <button class="full-button" @click="leaveGame()">Quitter la Room</button>
            </div>
        </div>
        <div class="main-container">
            <div class="not-loading" v-if="!isLoading()">
                <ArtGame @submitAnswer="submitAnswerHandler"
                    v-if="isRoundGoing()" />
                <RoundRecap @startNextRound="startNextRoundHandler"
                    v-if="isRoundFinished()" />
            </div>
            <GameLoader v-if="isLoading()" />
        </div>
    </div>
    <div class="endgame-container" v-if="displayEndgame()">
        <Endgame @quitGame="leaveGame()"/>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import ArtGame from './ArtGame.vue';
import GameLoader from './GameLoader.vue';
import Endgame from './Endgame.vue';
import RoundRecap from './RoundRecap.vue';

const loading = ref();
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
    roundNumber: 0,
    questionType: "",
    hasAnswered: false
});


const emit = defineEmits(['leaveGame', 'endGame', 'roundEnd']);


onMounted(() => {
    initSocketHandlers();
    currentRoundInfos.value = store.getters.currentRoundInfos;
    loading.value = (!isRoundGoing() && !isRoundFinished());
});

const initSocketHandlers = () => {

    props.socketManager.onRoundLoading( () => {
        loading.value = true;
    });

    props.socketManager.onRoundStarted((data) => {
        formatRoundInfos(data.artInfo);
        currentRoundInfos.value.roundStatus = "Going"
        currentRoundInfos.value.roundNumber++;
        currentRoundInfos.value.questionType = data.questionType;
        currentRoundInfos.value.hasAnswered = false;
        store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
        loading.value = false;
    });

    props.socketManager.onRoundEnded((data) => {
        currentRoundInfos.value.roundStatus = "Finished"
        currentRoundInfos.value.roundResults = data.roundResults;
        store.dispatch('saveChosenArtInfo', { chosenArtInfo: data.answerData })
        //add from currentRoundInfos and roundResults
        store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
        //scores will be updated by parent
        emit('roundEnd');
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
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const submitAnswerHandler = (artAnswerId) => {
    currentRoundInfos.value = store.getters.currentRoundInfos;
    currentRoundInfos.value.hasAnswered = true;
    store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
    props.socketManager.submitAnswer(store.getters.currentRoomInfos.code, store.getters.user, artAnswerId);
}

const startNextRoundHandler = () => {
    loading.value = true;
    currentRoundInfos.value.hasAnswered = false;
    store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
    props.socketManager.startNextRound(store.getters.currentRoomInfos.code);
}


const isRoundGoing = () => {
    return currentRoundInfos.value.roundStatus === "Going";
}

const isRoundFinished = () => {
    return currentRoundInfos.value.roundStatus === "Finished";
}

const isGameFinished = () => {
    return currentRoundInfos.value.roundNumber === props.roomInfos.maxRounds;
}

const displayGame = () => {
    return !isGameFinished() || !isRoundFinished();
}

const displayEndgame = () => {
    return isGameFinished() && isRoundFinished();
}

const isLoading = () => {
    return loading.value;
}


</script>

<style scoped>
.game-container {
    display: flex;
    margin-top: 2em;
}

.left-container {
    width: 15%;
    margin-left: 3em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
}

.main-container {
    width: 85%;
    margin-left: 2em;
}


.leave-room {
    margin: auto;
    margin-top: 2em;
    width: 7em;
    background-color: black;
    border-radius: 5px;
    margin-bottom: 5em;
}

.leave-room:hover {
    background-color: rgb(55, 40, 55);
    color: white;
}

.players {
    width: 100%;
    background-color: white;
}

.players h2 {
    background-color: grey;
    text-align: center;
    color: white;
}

.player-card {
    color: black;
    font-weight: 600;
    font-size: x-large;
    padding: 0.2em;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.2em;
    border-radius: 1em;
}
</style>