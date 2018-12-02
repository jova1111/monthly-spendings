<template>
  <div id="app">
    <button v-if="isLoggedIn" @click.prevent="logOut" class="btn btn-primary move-to-top-right">Log out</button>
    <div>
      <router-link to="/"><img src="./assets/logo.png"></router-link>
      <router-view/>
    </div>
    
  </div>
</template>

<script>
import authService from '@/services/auth-service'
import VueRouter from 'vue-router'

export default {
  name: 'App',
  data()
    {
        return {
           isLoggedIn: false,
        }
    },
  methods: {
    logOut(){
      localStorage.removeItem('AuthenticationToken');
      this.$router.push('/');
    },
  },
  mounted(){
    this.isLoggedInData=authService.isLoggedIn();
  },
  watch: {
        '$route' (to, from) {
            this.isLoggedIn=authService.isLoggedIn();
        }
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2%;
}
.move-to-top-right {
  margin:0%;
  position: absolute;
  left:98%;
    /* bring your own prefixes */
    transform: translate(-100%, 0%);
}
</style>
