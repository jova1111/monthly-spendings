<template>
  <div @keyup.enter="submit">
    <div class="form-group">
        <label for="email">Email address:</label>
        <input v-autofocus v-model="user.email" type="email" placeholder="Email" class="form-control" required>
    </div>
    <div class="form-group">
        <label for="pwd">Password:</label>
        <input v-model="user.password" type="password" placeholder="Password" class="form-control" id="pwd" required>
    </div>
    <div v-bind:class="{ hidden: !error}" class="error">
      {{ this.error }}
      <br>
    </div>
    <input type="button" @click="submit" class="btn btn-primary" value="Submit">
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
  .hidden {
    visibility: hidden;
  }

  .error {
    margin-bottom: 1em;
    color: rgb(223, 75, 49);
  }
</style>
