<template >
    <div class="head" v-if="store.getters.loggedIn">
        <div class="icon">
            <a href="/"><img src="../assets/AMICULTIVATED.svg">  </a>
        </div>
        <div class="items">
            <ul>
                <li><a href="/profil">Profil</a></li>
                <li><a href="/leaderboard">Leaderboard</a></li>
            </ul>
        </div>
        <div class="logout">
            <button  @click="logout()">Se déconnecter</button>
        </div>
    </div>

</template>
  
  <script setup>
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';

  const store = useStore();
  const router = useRouter();
    const logout = () => {
        store.dispatch('logout')
        .then(() => {
            router.push({ name: 'login' });
        })
    }
  
  </script>


<style  scoped>
.head {
    width: 100%;
    background-color: transparent;
    padding-top: 3em;
    padding-left: 3em;
    padding-right: 3em;
    padding-bottom: 1em;
    top: 0;
    display: inline-block;
    display: flex;
}

.icon {
    width: 6em;
    position: right;
}

.items {
    display: inline-block;
    display: flex;
    align-items: center;
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



.logout button:hover {
    font-weight: bold;
    margin-left: 2em;
    color: white;
}

</style>