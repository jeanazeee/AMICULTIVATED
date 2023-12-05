<template>
    <div class="title">
        <h1>Bonjour, {{ store.getters.user.username  }}</h1>
    </div>
    <div class="profile-container">
        
  </div>
</template>

<script setup>

import {store} from './../../store/store.js'



</script>

<style  scoped>
.profile-container {
    width: 580px;
    height: 10em;
    display: flex;
    margin: auto;
    margin-top: 2em;
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
}

</style>