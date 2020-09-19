<template>
  <div>
    <!-- временные ссылки для навигации по компонентам -->
    <!-- <br>
    <router-link :to="{ name: 'Home', params: {page: 0} }">Переход к фиче "управление проблемами"</router-link>
    <br><br>
    <router-link :to="{ name: 'Login' }">Go to Login</router-link>
    <br><br>
    <router-link :to="{ name: 'Register' }">Go to Register</router-link> -->
    <Register />
  </div>
</template>

<script>
import Register from "@/components/Auth/Register"
export default {
  name: "Main",
  components: {
    Register
  }
}
</script>

<style>

</style>