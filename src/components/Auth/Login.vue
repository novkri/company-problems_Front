<template>
  <div class="container">
    <form>
      <div class="form-group">
        <label for="username">Имя пользователя<span v-if="username.length >= 15 && username.length <= 20">{{$v.username.$params.maxLength.max - username.length}}</span></label> 
        <input type="text" class="form-control" id="username" v-model="username"
          :class="{ 'form-control--error': $v.username.$invalid, 'form-control--valid': username && !$v.username.$invalid}">
        <!-- <div class="errorAuth" v-if="errorU.name">{{errorU.name[0]}}</div> -->
        <div class="errorAuth" v-if="errorU.name">{{errorU.name[1]}} </div>
        <!--<div class="errorAuth" v-if="!$v.username.maxLength">username проблемы должно быть не более
          {{$v.username.$params.maxLength.max}} символов</div>
         <div class="errorAuth" v-if="!$v.username.minLength">username проблемы должно быть не менее
          {{$v.username.$params.minLength.min}} символов</div> -->
      </div>
      <div class="form-group">
        <label for="password">Пароль<span v-if="password.length >= 15 && password.length <= 20">{{$v.password.$params.maxLength.max - password.length}}</span></label>
        <input type="password" class="form-control" id="password" v-model="password" 
          :class="{ 'form-control--error': $v.password.$invalid, 'form-control--valid': username && !$v.password.$invalid}">
        <div class="errorAuth" v-if="errorU.password">{{errorU.password[0]}} {{errorU.password[1]}} </div>
        <!--<div class="errorAuth" v-if="!$v.password.maxLength">password проблемы должно быть не более
          {{$v.password.$params.maxLength.max}} символов</div>
         <div class="errorAuth" v-if="!$v.password.minLength">password проблемы должно быть не менее
          {{$v.password.$params.minLength.min}} символов</div> -->
      </div>
      <br>
      <div class="errorAuth" v-if="errorU.name" style="text-align: center;">{{errorU.name[0]}}</div>
      <div class="form-group">
        <router-link :to="{ name: 'Register' }">Регистрация</router-link>
      </div>
      <button type="submit" class="btn" @click.prevent="login">Войти</button>
    </form>
  </div>
</template>

<script>
// import {mapGetters} from 'vuex'
import {
    maxLength,
    minLength
  } from 'vuelidate/lib/validators'
  import {mapGetters} from 'vuex'

  export default {
    name: "Login",
    data: () => ({
      success: false,
      username: '',
      password: ''
      
    }),
    validations: {
      username: {
        minLength: minLength(4),
        maxLength: maxLength(20)
      },
      password: {
        minLength: minLength(8),
        maxLength: maxLength(20)
      },
    },
     computed: {
      ...mapGetters(['errorU']) 
    },
    watch: {
      errorU() {
      }
    },
    methods: {
      async login() {
          const formData = {
            name: this.username,
            password: this.password,
          }
          await this.$store.dispatch('login', formData).then(() => {
            if (!this.errorU) {
              this.$router.push('/problems')
            }
          })
      },
    }
  };
</script>

<style lang="scss" scoped>
  form {
    margin: 0;
    width: 100%;
  }

  .errorAuth {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #BDBDBD;
    margin-top: 10px;
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

  input, input:active {
    background-color: #F7F7F7;
    margin-bottom: 22px;
    border-radius: 12px;

    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F
  }

  .form-group {
    margin: 0 0 15px 0;
  }
  .form-control:active, .form-control:focus {
    background-color: #F7F7F7;
  } 
</style>