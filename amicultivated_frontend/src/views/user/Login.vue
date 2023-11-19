<template>
    <div class="form-container">
        <div class="form-front">
            <div class="error">
                <p id="error-message" v-if="errorMessage">{{ errorMessage }}</p>
            </div>
            <p class="title">Login</p>
            <div class="form">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" placeholder="" v-model="username">
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="" v-model="password">

                </div>
                <button class="sign" @click="login()">Create account</button>
            </div>
            <br>
            <div class="line"></div>
            <p class="signup">Don't have an account?
                <router-link :to="{ name: 'signup' }">Sign Up</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { sha256 } from 'js-sha256'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';


const username = ref('')
const password = ref('')
const router = useRouter();
const errorMessage = ref('');

const store = useStore();
const login = () => {
    const hashedPassword = sha256(password.value);
    store.dispatch('login', { username: username.value, password: hashedPassword })
        .then(() => {
            router.push({ name: 'home' });
        })
        .catch((error) => {
            errorMessage.value = "Erreur d'authentification : " + error.response.data.message;
        });
}

</script>

<style  scoped>
.form-container {
    width: 580px;
    height: 580px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
}

.form {
    margin-right: 1.75rem;
    margin-left: 1.75rem;
    margin-top: 1.5rem;
}

.input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
}

.input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: rgba(17, 24, 39, 1);
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
}

.input-group input:focus {
    border-color: rgba(167, 139, 250);
}

.signup a {
    color: rgba(243, 244, 246, 1);
    text-decoration: none;
    font-size: 14px;
}

.signup a:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
}

.sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    margin-top: 2rem;
}

.sign:hover {
    cursor: pointer;
    background-color: rgb(126, 71, 255);
}


.signup {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
    padding-top: 1rem;
}


.line {
    height: 1px;
    background-color: rgba(55, 65, 81, 1);
}

.error{
    color: red;
    text-align: center;
    padding-bottom: 1rem;
}
</style>