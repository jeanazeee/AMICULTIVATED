<template>
    <div class="main-frame">
        <div class="title" v-if="!isLoading()">
            <h2>Trouvez la réponse correct pour l'attribut : {{ questionTypeMapAttributes[currentRoundInfos.questionType] }}
            </h2>
        </div>
        <div class="body-frame">
            <div class="left">
                
                <div class="players">
                    <h2>Joueurs</h2>
                    <div class="player-card" v-for="player in props.roomInfos.players" :key="player.id">
                        {{ player.username }} : {{ player.score }}
                    </div>
                </div>
                <div class="leave-room">
                    <button class="full-button" @click="leaveGame()" >Quitter la Room</button>
                </div>
            </div>
            <div class="art-frame">
                <div class="img" v-if="!isLoading()">
                    <img :src="currentRoundInfos.image" oncontextmenu="return false;">
                </div>
                <div class="title" v-if="isLoading()">
                    <h2>Chargement du prochain round</h2>
                    <img src="./../../assets/paint_loader.gif" alt="" class="loading-gif">
                </div>
                <div class="response" v-if="isRoundGoing()">
                    <button class="answer-button" v-for="artAnswer in currentRoundInfos.artAnswers"
                        @click="submitAnswer(artAnswer.id)" :disabled="currentRoundInfos.hasAnswered">
                        <span v-if="currentRoundInfos.questionType == 'title'">{{ artAnswer.title }}</span>
                        <span v-if="currentRoundInfos.questionType == 'artist'">{{ artAnswer.artistName }}</span>
                        <span v-if="currentRoundInfos.questionType == 'year'">{{ artAnswer.completitionYear }}</span>
                    </button>
                </div>

                <div class="roundOff-container" v-if="isRoundFinished()">
                    <div class="has-next-round" v-if="hasNextRound()">
                        <button class="leave-room" @click="startNextRound()">Next Round</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import Endgame from './Endgame.vue';

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
    roundNumber: 0,
    questionType: "",
    hasAnswered: false
});
const questionTypeMapAttributes = {
    "title": "Titre de l'oeuvre",
    "artist": "Nom de l'artiste",
    "year": "Date de création"
}

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
        currentRoundInfos.value.questionType = data.questionType;
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

const submitAnswer = (artAnswerId) => {
    console.log("submitAnswer");
    currentRoundInfos.value = store.getters.currentRoundInfos;
    currentRoundInfos.value.hasAnswered = true;
    store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
    props.socketManager.submitAnswer(store.getters.currentRoomInfos.code, store.getters.user, artAnswerId);
}

const startNextRound = () => {
    loading.value = true;
    currentRoundInfos.value.hasAnswered = false;
    store.dispatch('saveCurrentRoundInfos', { currentRoundInfos: currentRoundInfos.value })
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


const isLoading = () => {
    return loading.value;
}


</script>

<style scoped>

.text-players {
    width: 10%;
    writing-mode: vertical-lr;
}
.left {
    float: left;
    width: 20%;
    margin-left: 5%;
}

.title {
    text-align: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 700;
}

.body-frame {
    margin-top: 2em;
}

.img img {
    width: auto;
    margin: auto;
    border: 4px solid white;
}

.art-frame {
    width: 40%;
    margin: auto;

}

.next button {
    margin: auto;
    margin-top: 2em;
    width: 10em;
    padding: 1em;
    background-color: purple;
    border-radius: 5px;
    margin-bottom: 2em;
    text-align: center;
}

.next button:hover {
    margin: auto;
    text-align: center;
    padding: 1em;
    margin-top: 2em;
    width: 10em;
    padding:1em;
    background-color: rgb(134, 34, 134);
    border-radius:5px;
    margin-bottom: 2em;
    text-align: center;
    color: white;
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
    margin: auto;
    margin-top: 2em;
    width: 7em;
    background-color: rgb(55, 40, 55);
    color: white;
    border-radius: 5px;
}

.response {
    margin: auto;
    width: 100%;
    padding-top: 1em;
}

.response button {
    width:48%;
    margin:1%;
    height: auto;
    border-radius: 1em;
    color: grey;
    font-size: large;
    font-weight: 700;
    background-color: white;
    transition: 1s;
}



.answer-button:hover {
    margin: 0.2em;
    width: 45%;
    border-radius: 1em;
    margin:1%;
    color: grey;
    font-size: large;
    font-weight: 700;
    background-color: lightsalmon;
    transition: 1s;
}

.answer-button:disabled,
.answer-button:disabled:hover {
    margin: 0.4em;
    background-color: #cccccc;
    /* Couleur de fond grise */
    color: #666666;
    /* Couleur de texte plus foncée */
    opacity: 0.5;
    /* Rend le bouton partiellement transparent */
    cursor: not-allowed;
    /* Change le curseur pour indiquer qu'il n'est pas cliquable */
}

.players {
    margin-left: 3em;
    background-color: white;
}

.players h2 {
    background-color: grey;
    text-align: center;
    color:white;
}

.player-card{
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

.loading-gif{
    height: 400px; 
    width: 800px; 
    margin: auto;
    overflow: hidden;
    object-fit: cover;
}
</style>