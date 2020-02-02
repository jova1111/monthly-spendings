<template>
  <div>
    <h1>
      Choose to
      <router-link to="/login">log in</router-link>&nbsp;or
      <router-link to="/register">register.</router-link>
    </h1>
  </div>
</template>

<script>
  export default {
    name: 'HomePage'
  };
</script>

<style scoped>
  h1 {
    margin-top: 8%;
  }

  h1,
  h2 {
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
    color: #9898ff;
  }
</style>
