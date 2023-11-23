<template>
    <div class="head">
        <div class="icon">
            <a href="/"><img src="../assets/logo.svg">  </a>
        </div>
        <div class="items">
            <ul>
                <li><a href="/CreationPartie">Créer une partie</a></li>
                <li><a href="/profil">Profil</a></li>
                <li><a href="/Leaderboard">Leaderboard</a></li>
            </ul>
        </div>
        <div class="button">
            <input type="button" value="Se déconnecter">
        </div>
    </div>

</template>
  
  <script setup>
  
  </script>


<style  scoped>
.head {
    width: 100%;
    background-color: transparent;
    padding: 3em;
    top: 0;
    display: inline-block;
    display: flex;
}

.icon {
    width: 2em;
    height: 2em;
    position: right;
}

.items {
    display: inline-block;
    display: flex;
    width: 100%;
    position: right;
}

ul {
    display: inline-flex;
}

li {
    font-weight: bold;
    margin-left: 2em;
}
li:hover {
    font-weight: bold;
    margin-left: 2em;
    color: white;
}

.button {
    box-shadow: black 2em;
    background-color: grey;
    padding: 1em;
}

</style>