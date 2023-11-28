<template>
  <main>
    <div class="noroom" v-if="!hasCurrentRoom()">
    <div class="title">
      <h1>Bienvenue sur AMICULTIVATED, l'application pour tester vos connaissances en matière de peinture .</h1>
    </div>
    <div class="main-div"  >
      <div class="main-image">
        <img src="../assets/art.jpg">
      </div>
      <div class="main-game">
        <div class="error">
            <p id="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        </div>
        <div class="main-join">
          <h2>Entrez le code de la partie</h2>
          <input type="text" name="" id="" v-model="roomCode" placeholder="Ex: H68UYZ"/>
          <button @click="joinRoom()">Rejoindre la room</button>
        </div>
        <div class="main-create">
          <h2>ou</h2>
          <button  @click="createRoom()">Créer une room</button>
        </div>
      </div>
    </div>
  </div>
    <div class="leave-room" v-if="hasCurrentRoom()">
      <button class="full-button" @click="leaveRoom()">Quitter la Room</button>
      <p id="room-code">Votre code de Room est : {{ store.getters.currentRoomInfos.code }}</p>
    </div>
  </main>
</template>


<script setup>
import { ref } from 'vue'
import API from './../api/api.js'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';



const room = ref()
const roomCode = ref()
const store = useStore();
const api = new API(store);
const errorMessage = ref('')
const router = useRouter();


const hasCurrentRoom = () => {
    const hasCurrentRoom = store.getters.currentRoomInfos.code != "" 
    && store.getters.currentRoomInfos.code != '' 
    && store.getters.currentRoomInfos.code != null 
    && store.getters.currentRoomInfos.code != undefined;
    return hasCurrentRoom
}

const joinRoom = async () => {
    try {
        if(roomCode.value == "") throw new Error("Le code de la room ne peut pas être vide");
        let username = store.getters.user.username;
        await api.joinRoom(roomCode.value, username)
        router.push({ name: 'room', params: { roomCode: roomCode.value } });
    } catch (error) {
        errorMessage.value = "Erreur : " + error;
    }
}

const leaveRoom = async () => {
    try {
        let username = store.getters.user.username;
        await api.leaveRoom(username)
    } catch (error) {
        errorMessage.value = "Erreur : " + error;
    }
}

const createRoom = async () => {
    try {
        let username = store.getters.user.username;
        room.value = await api.createRoom(username);
        router.push({ name: 'room', params: { roomCode: room.value.code } });
    } catch (error) {
        console.error(error);
        errorMessage.value = "Erreur : " + error.response.data.message;
    }
}
</script>

<style scoped>
.error {
  color: red;
}
.title {
  margin: 0 auto;
  text-align: center;
  padding-bottom: 1em;
  font-weight: 900;
  width: 70%;
  font-size:xx-large;
}

.main {
  display: inline-block;
}

.games {
  width: 15%;
  float: left;
  color: black;
  padding: 1em;
  background: white;
  border-radius: 10px;
  margin-bottom: 5em;
  margin-left: 4em;

}
.games button {
  float: right;
  margin-left: 2em;
  padding: 10px;
  border-radius: 5px;
}

.games h2 {
  color: purple;
  font-size: large;
  font-weight: 600;
}

.games-li {
  margin-top: 2em;
}

.games-li button {
  background-color: greenyellow;
  font-weight: 900;
}
.main-div {
  width: 60%;
  height: 400px;
  object-fit: cover;
  display: flex;
  margin:auto;
  background: white;
  border-radius: 10px;
  margin-bottom: 5em;
}

.main-join {
  width: 50%;
}

.main-image {
  width: 50%;
}
.main-image img {
  /* The image used */
  border-radius: 10px 0px 0px 10px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-join {
  width: 100%;
}
h2 {
  margin: 10px;
  font-size: 2em;
  font-weight: bold;
  color: purple;
}

.main-join input {
  margin: 0 auto;
  margin-top: 3em;
  color: black;
  display: block;
  border: 1px solid black;
  border-radius: 0%;
  padding: 10px;
  width: 90%;
  font-weight: bold;
  text-transform: uppercase;
  padding-right:1em;
}

.main-join button {
  margin: 0 auto;
  background-color: purple;
  color: white;
  display: block;
  border: 1px solid black;
  border-radius: 0%;
  padding: 10px;
  width: 90%;
  font-weight: bold;
  text-transform: uppercase;
  padding-right:1em;
}

.main-create button {
  margin: 0 auto;
  background-color: purple;
  color: white;
  display: block;
  border: 1px solid black;
  border-radius: 0%;
  padding: 10px;
  width: 90%;
  font-weight: bold;
  text-transform: uppercase;
  padding-right:1em;
}

.main-create h2 {
  display: flex;
  justify-content: center;
}

</style>