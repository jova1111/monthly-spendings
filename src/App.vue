<template>
  <div id="app">
    <button
      v-if="isLoggedIn"
      @click.prevent="logOut"
      class="btn btn-primary move-to-top-right"
    >Log out</button>
    <div>
      <router-link to="/">
        <img src="./assets/logo.png" />
      </router-link>
      <router-view />
    </div>
  </div>
</template>

<script>
  import userService from '@/services/user-service';
  import VueRouter from 'vue-router';

  export default {
    name: 'App',

    data() {
      return {
        isLoggedIn: false
      };
    },

    methods: {
      logOut() {
        userService.logout();
        this.$router.push('/');
      }
    },

    mounted() {
      this.isLoggedIn = userService.isLoggedIn();
    },

    watch: {
      $route(to, from) {
        this.isLoggedIn = userService.isLoggedIn();
      }
    }
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 2%;
    margin-bottom: 2%;
  }

  .move-to-top-right {
    margin: 0%;
    position: absolute;
    left: 98%;
    transform: translate(-100%, 0%);
  }

  .table {
    margin-bottom: 0;
  }

  .transactions {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  .transactions td,
  .transactions th {
    border: 2px solid rgb(202, 202, 202);
    padding: 8px;
  }

  .transactions tr:nth-child(odd) {
    background-color: rgb(240, 240, 255);
  }

  .transactions tr:nth-child(even) {
    background-color: rgb(222, 222, 255);
  }

  .transactions tr:first-child {
    background-color: rgb(124, 124, 225);
  }

  .transactions tr:hover {
    background-color: rgb(190, 190, 255);
  }

  .table-header:hover {
    background-color: rgb(100, 100, 200) !important;
    cursor: pointer;
  }

  .table-header {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: rgb(124, 124, 225);
    color: white;
  }

  .violet {
    background-color: rgb(124, 124, 225);
    color: white;
    border: 1px solid gray;
  }

  .red {
    color: red;
  }

  .green {
    color: green;
  }

  .hidden {
    display: hidden
  }

  @media only screen and (max-width: 400px) {
    .transactions td,
    .transactions th {
      padding: 1px;
    }
  }
</style>
