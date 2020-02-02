<template>
  <div>
    <div class="form-group">
        <label for="email">Email address:</label>
        <input @keyup.enter="submit" v-autofocus v-model="user.email" type="email" placeholder="Email" class="form-control" required>
    </div>
    <div class="form-group">
        <label for="pwd">Password:</label>
        <input @keyup.enter="submit" v-model="user.password" type="password" placeholder="Password" class="form-control" id="pwd" required>
    </div>
    <div v-bind:class="{ hidden: !error}" class="error">
      {{ this.error }}
      <br>
    </div>
    <button @click="submit" class="btn btn-primary">Submit</button>
  </div>
</template>

<script>
  import { User } from '@/models/user';

  export default {
      name: 'UserForm',

      props: {
        error: String
      },

      data(){
          return {
              user: new User()
          }
      },

      methods: {
        submit() {
          this.$emit('submit', this.user);
        }
      }
  }
</script>

<style scoped>
  h1 {
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

  .hidden {
    visibility: hidden;
  }

  .error {
    margin-bottom: 1em;
    color: rgb(223, 75, 49);
  }
</style>
