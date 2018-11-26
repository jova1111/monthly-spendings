<template>
    <div v-if="!isLoading" class="container-fluid">
        <div class="centerOnMiddle">
            <div>
                <form action="/login.php">
                    <div class="form-group">
                        <label for="email">Email address:</label>
                        <input @keyup.enter="login" v-model="user.email" type="email" placeholder="Email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="pwd">Password:</label>
                        <input @keyup.enter="login" v-model="user.password" type="password" placeholder="Password" class="form-control" id="pwd" required>
                    </div>
                    <button @click.prevent="login" class="btn btn-primary">Log in</button>
                </form>
            </div>
        </div>
    </div>
    <spinner v-else></spinner>
</template>
<script>
import authService from '../services/auth-service'
import {User} from '../models/user'
import LoadingSpinner from './LoadingSpinner'

export default {
    components: {
        'spinner': LoadingSpinner
    },
    name: 'Login',
    data(){
        return {
            user: new User(),
            isLoading: false
        }
    },
    methods: {
        login(){
            this.isLoading = true;
            authService.login(this.user)
                .then(response=>{
                    console.log(response);
                    this.$router.push('/');
                    this.isLoading = false;
                }).catch(error=>{
                    console.log(error);
                    this.isLoading = false;
                });
        } 
    },
}
</script>
<style scoped>
.centerOnMiddle{
    position: fixed;
    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, 0%);
}
h1{
  margin-top:8%;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
