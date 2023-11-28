<template>
    <div class="title">
        <h1>Fin de la partie, {{ store.getters.username  }}</h1>
        <h3>Tu es classé 5 / 10 !</h3>
    </div>
    <div class="profile-container">
        <div class="player-card">
            <div class="player-info">
                <p class="name">hello</p>
                <p class="score">100</p>  
            </div>
        </div>
    </div>
    <div class="home">
        <button @click="home()" >Manche suivante</button>
    </div>
</template>

<script setup>

import {store} from './../../store/store.js'



</script>

<style  scoped>
.profile-container {
    width: fit-content;
    display: flex;
    margin: auto;
    background: rgb(17, 24, 39);
    background: radial-gradient(circle, rgba(17, 24, 39, 1) 0%, rgba(21, 31, 54, 1) 100%);
    border-radius: 0.75rem;

}

.form-front {
    width: 480px;
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
}

.title {
    text-align: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 700;
    margin-bottom: 2em;
}

.title h3{
    margin-top: 3em;
    font-size: 1.5rem;
}

.player-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: 3s;
}

.player-info {
    width: 20em;
    display: flex;
    justify-content: space-between;
}

.name {
    padding: 2em;
    width: 50%;
}

.score {
    padding: 2em;
    margin: auto;
}
.home {
    margin: auto;
    margin-top: 2em;
    width: 10em;
    padding:1em;
    background-color: white;
    border-radius:5px;
    margin-bottom: 2em;
    text-align: center;
    color: black;
}



</style>