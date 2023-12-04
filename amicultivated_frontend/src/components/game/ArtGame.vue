<template>
    <div class="main-frame">
        <div class="title" >
            <h2>Trouvez la réponse correct pour l'attribut : {{ questionTypeMapAttributes[currentRoundInfos.questionType] }}
            </h2>
        </div>
        <div class="art-frame">
            <div class="img">
                <img :src="currentRoundInfos.image" oncontextmenu="return false;">
            </div>
            <div class="response">
                <div class="answer-button-container" v-for="artAnswer in currentRoundInfos.artAnswers">
                    <button class="answer-button" 
                    @click="submitAnswer(artAnswer.id)" :disabled="currentRoundInfos.hasAnswered">
                    <span v-if="currentRoundInfos.questionType == 'title'">{{ artAnswer.title }}</span>
                    <span v-if="currentRoundInfos.questionType == 'artist'">{{ artAnswer.artistName }}</span>
                    <span v-if="currentRoundInfos.questionType == 'year'">{{ artAnswer.completitionYear }}</span>
                </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const questionTypeMapAttributes = {
    "title": "Titre de l'oeuvre",
    "artist": "Nom de l'artiste",
    "year": "Date de création"
}

const props = defineProps({
    currentRoundInfos : Object,
});

const emit = defineEmits(['submitAnswer']);


const submitAnswer = (artAnswerId) => {
    emit('submitAnswer', artAnswerId);
}

</script>

<style scoped>


.title {
    text-align: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 700;
    margin-bottom: 1em;
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

.response {
    padding-top: 1em;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    gap: 10px;
}
.answer-button-container {
    margin: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: grey;
    font-size: large;
    font-weight: 700;
}
.answer-button {
    width: 100%;
    border-radius: 1em;
    background-color: white;
    transition: 1s;
}
.answer-button:hover {
    width: 90%;
    background-color: lightsalmon;
}

.answer-button:disabled,
.answer-button:disabled:hover {
    width: 100%;
    background-color: #cccccc;
    color: #666666;
    opacity: 0.5;
    cursor: not-allowed;
}
</style>