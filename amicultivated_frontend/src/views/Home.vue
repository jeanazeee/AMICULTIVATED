<template>
  <main>
    <div class="title">
      <h1>Bienvenue sur AMICULTIVATED, l'application pour tester vos connaissances en matière de peinture .</h1>
    </div>
      <div class="main-div">
        <div class="main-image">
          <img src="../assets/art.jpg">
        </div>
        <div class="main-join">
          <h2>Entrez le code de la partie</h2>
          <input placeholder="Ex: H68UYZ"/>
          <button>Rejoindre la room</button>
        </div>
      </div>
  </main>
</template>


<script setup>

</script>

<style scoped>

.title {
  color: white;
  margin: 0 auto;
  text-align: center;
  padding: 1em;
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
.main-join h2 {
  margin: 10px;
  font-size: 3em;
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
  margin-top: 3em;
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
</style>