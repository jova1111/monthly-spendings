<template>
  <div v-if="!isLoading" class="container-fluid">
    <h3>Register</h3>
    <div class="centered">
      <user-form :error="error" @submit="register"></user-form>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
  import UserForm from '@/components/authentication/UserForm';
  import LoadingSpinner from '@/components/utils/LoadingSpinner';
  import userService from '@/services/user-service';
  import { User } from '@/models/user';

  export default {
    components: {
      'spinner': LoadingSpinner,
      'user-form': UserForm
    },

    name: 'RegisterPage',

    data(){
      return {
        error: '',
        isLoading: false
      }
    },

    methods: {
      register(user){
        this.isLoading = true;
        userService.register(user)
          .then(response => {
            return userService.login(user);
          })
          .then(response => {
            this.$router.push('/');
            this.$toasted.success('Successfully registered!');
            this.isLoading = false;
          })
          .catch(error => {
            this.error = error;
            this.isLoading = false;
          });
      }
    }
  }
</script>

<style scoped>
  .centered {
      position: fixed;
      left: 50%;
      transform: translate(-50%, 0%);
      width: 30%;
  }

  @media only screen and (max-width: 768px) {
   .centered {
      position: fixed;
      left: 50%;
      transform: translate(-50%, 0%);
      width: 80%;
    }
  }
</style>
