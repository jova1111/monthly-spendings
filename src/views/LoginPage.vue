<template>
  <div v-if="!isLoading" class="container-fluid">
    <h3>Login</h3>
    <div class="centered">
      <user-form :error="error" @submit="login"></user-form>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
  import LoadingSpinner from '@/components/utils/LoadingSpinner';
  import UserForm from '@/components/authentication/UserForm';
  import userService from '@/services/user-service';

  export default {
    components: {
        'spinner': LoadingSpinner,
        'user-form': UserForm
    },

    name: 'LoginPage',

    data(){
      return {
          error: '',
          isLoading: false
      }
    },

    methods: {
      login(user) {
        this.isLoading = true;
        userService.login(user)
          .then(response => {
            this.$router.push('/');
          }).catch(error => {
            this.error = error;
            this.isLoading = false;
          });
      }
    },
  }
</script>

<style scoped>
  .centered {
      position: fixed;
      left: 50%;
      transform: translate(-50%, 0%);
  }
</style>
