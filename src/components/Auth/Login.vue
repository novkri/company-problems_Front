<template>
  <div class="container">
    <form>
      <div class="form-group">
        <label for="username">Имя пользователя<span>4</span></label> 
        <input type="text" class="form-control" id="username" v-model="userData.username">
        <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
      </div>
      <div class="form-group">
        <label for="password">Пароль<span>0</span></label>
        <input type="password" class="form-control" id="password" v-model="userData.password">
      </div>
      <div class="form-group">
        <router-link :to="{ name: 'Register' }">Регистрация</router-link>
      </div>
      <button type="submit" class="btn" @click="login">Войти</button>
    </form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
  export default {
    name: "Login",
    data: () => ({
      success: false,
      userData: {
        username: '',
        password: ''
      }
    }),
    computed: {
      ...mapGetters(['users', 'errorU'])
    },
    async mounted() {
      await this.$store.dispatch('getUsers')
    },
    methods: {
      login() {

      }
    }
  };
</script>

<style lang="scss" scoped>
  form {
    margin: 0;
    width: 100%;
  }

  a {
    display: flex;
    justify-content: center;
    color: #828282;
    margin: 26px 0 62px;
  }

  .container {
    width: 344px;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #828282;
  }
  
  label {
    display: flex;
    justify-content: space-between;
    margin: 0 7px 9px 18px;
  }

  .btn {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    padding: 0;
    border-radius: 12px;
    width: 109px;
    height: 51px;
    background: #92D2C3;
    color: #fff;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 17px;
  }

  input {
    background-color: #F7F7F7;
    border-bottom: none;
    margin-bottom: 22px;
    border-radius: 12px;
  }

  .form-group {
    margin: 0;
  }
</style>