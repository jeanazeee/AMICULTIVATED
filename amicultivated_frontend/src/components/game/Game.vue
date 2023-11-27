<template>
    <div class="main-frame">
        <div class="title">
            <h2>Trouvez la réponse correct pour l'attribut Titre de l'oeuvre</h2>
        </div>
        <div class="body-frame">
            <div class="players">
                <div class="player-card" v-for="player in props.roomInfos.players" :key="player.id">
                    {{ player }}
                </div>
            </div>
            <div class="art-frame">
                <div class="img">
                    <img src="./../../assets/art.jpg">
                </div>
                <div class="response">
                   <div class="rowonebutton">
                    <button>1988</button>
                    <button>1988</button>
                   </div> 
                   <div class="rowtwobutton">
                    <button>1988</button>
                    <button>1988</button>
                   </div> 
                </div>
            </div>
        </div>
    </div>

    <div class="leave-room">
        <button class="full-button" @click="leaveRoom()" >Quitter la Room</button>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const emit = defineEmits(['leaveRoom']);

const props = defineProps({
    roomInfos: Object
});

const leaveRoom = async () => {
    emit('leaveRoom')
}

</script>

<style scoped>

.players {
    background-color: aliceblue;
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
    width: 40%;
    margin: auto;
    border: 4px solid white;
}

.leave-room {
    margin: auto;
    margin-top: 2em;
    width: 7em;
    background-color: purple;
    border-radius:5px;
}

.leave-room:hover {
    margin: auto;
    margin-top: 2em;
    width: 7em;
    background-color: purple;
    color: white;
    border-radius:5px;
}
.response {
    margin: auto;
    width: 100%;
}
.rowonebutton {

}
</style>