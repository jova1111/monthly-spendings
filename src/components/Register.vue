<template>
    <div class="container-fluid">
        <div class="centerOnMiddle">
            <div>
                <form>
                    <div class="form-group">
                        <label for="email">Email address:</label>
                        <input v-autofocus @keyup.enter="register" v-model="user.email" type="email" placeholder="Email" class="form-control" required>
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label>Username</label>
                        <input @keyup.enter="register" v-model="user.username" type="text" class="form-control" placeholder="Username">
                    </div>
                    <div class="form-group">
                        <label for="pwd">Password:</label>
                        <input @keyup.enter="register" v-model="user.password" type="password" placeholder="Password" class="form-control">
                    </div>
                    <div class="form-group">
                        <input @keyup.enter="register" v-model="user.password_confirmation" type="password" placeholder="Confirm password" class="form-control">
                    </div>
                    <button @click.prevent="register" class="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import authService from '../services/auth-service'
import {User} from '../models/user'
import { requestUrl } from '../constants/const'
export default {
    name: 'Register',
    data(){
        return {
            user: new User()
        }
    },
    methods: {
        register(){
            authService.register(this.user)
                .then(response => { 
                    this.$router.push('/login');
                }).catch(error => {
                });
        }  
    }
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
