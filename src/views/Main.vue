<template>
  <div>
    <!-- временные ссылки для навигации по компонентам -->
    <br>
    <router-link :to="{ name: 'Home', params: {page: 0} }">Переход к фиче "управление проблемами"</router-link>
    <br><br>
    <router-link :to="{ name: 'Login' }">Go to Login</router-link>
    <br><br>
    <router-link :to="{ name: 'Register' }">Go to Register</router-link>
  </div>
</template>

<script>
export default {
  name: "Main"
}
</script>

<style>

</style>