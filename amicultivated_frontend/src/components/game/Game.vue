<template>
    <div class="main-frame">
        <div class="title">
            <h2>Trouvez la réponse correct pour l'attribut Titre de l'oeuvre</h2>
        </div>
        <div class="body-frame">
            <div class="left">
                <div class="players">
                    <div class="player-card" v-for="player in props.roomInfos.players" :key="player.id">
                        {{ player }}
                    </div>
                </div>
                <div class="leave-room">
                    <button class="full-button" @click="leaveRoom()" >Quitter la Room</button>
                </div>
            </div>
            <div class="art-frame">
                <div class="img">
                    <img :src="currentRoundInfos.image">
                </div>
                <div class="response">
                    <button>1988</button>
                    <button>1988</button>
                    <button>1988</button>
                    <button>1988</button>
                </div>
                <div class="answers">
                        <button class="answer" v-for="answer in currentRoundInfos.answers" @click="submitAnswer(answer)">
                            {{ answer }}
                        </button>
                    </div>
            </div>
        </div>
        
    </div>

    <div class="leave-room">
        <button class="full-button" @click="leaveRoom()">Quitter la Room</button>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const emit = defineEmits(['leaveRoom']);
const loading = ref(false);
const props = defineProps({
    roomInfos: Object,
    socketManager: Object
});

const currentRoundInfos = ref({});



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

<style scoped>

.left {
    float: left;
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

.img {
    margin: auto;
    border: 4px solid white;
}

.art-frame {
    width:40%;
    margin: auto;
    
}

.next {
    margin: auto;
    margin-top: 2em;
    width: 10em;
    padding:1em;
    background-color: purple;
    border-radius:5px;
    margin-bottom: 5em;
    text-align: center;
}

.next:hover {
    margin: auto;
    text-align: center;
    padding:1em;
    margin-top: 2em;
    width: 10em;
    background-color: purple;
    color: white;
    border-radius:5px;
}
.leave-room {
    margin: auto;
    margin-top: 2em;
    width: 7em;
    background-color: purple;
    border-radius:5px;
    margin-bottom: 5em;
}

.leave-room:hover {
    margin: auto;
    margin-top: 2em;
    width: 7em;
    background-color: purple;
    color: white;
    border-radius: 5px;
}

.response {
    margin: auto;
    width: 100%;
    padding-top: 1em;
}

.response button {
    margin:0.4em;
    width:45%;
    height: auto;
    border-radius: 1em;
    color: grey;
    font-size: large;
    font-weight:700 ;
    background-color: white;
    transition: 1s;
}

.response button:hover {
    margin:0.2em;
    width:45%;
    border-radius: 1em;
    color: grey;
    font-size: large;
    font-weight:700 ;
    background-color: lightsalmon;
    transition: 1s;
}

.players{
    margin-left:3em ;
    background-color: white;
}

</style>