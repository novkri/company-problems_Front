<template>
  <div class="container" >
    <form v-if="!success">
      <div class="form-group">
        <label for="username">Имя пользователя</label> 
        <input type="text" class="form-control" id="username">
        <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
      </div>
      <div class="form-group">
        <label for="password">Пароль</label>
        <div class="input-group" id="show_hide_password">
          <input type="password" class="form-control" id="password">
          <span tabindex="100" title="Click here to show/hide password" class="add-on input-group-addon" style="cursor: pointer;"><img src="@/assets/password/eye.png" alt=""></span>
        </div>
      </div>
      <div class="form-group">
        <label for="password">Повторите пароль</label>
        <div class="input-group" id="show_hide_password">
          <input type="password" class="form-control" id="password" data-toggle="password">
          <span tabindex="100" title="Click here to show/hide password" class="add-on input-group-addon" style="cursor: pointer;"><img src="@/assets/password/eye.png" alt=""></span>
        </div>
      </div>
      <div class="form-group">
        <label for="email">Электронная почта</label>
        <input type="email" class="form-control" id="email">
      </div>
      <button type="submit" class="btn" @click="register">Зарегистрироваться</button>
    </form>

    <div v-else class="successfully">
      <span>Вы успешно зарегистрированы</span>
      <img src="@/assets/thumbs-up.png">
      <button type="button" class="btn" @click="goToLogin">
        На страницу авторизации
      </button> 
    </div>
  </div>



</template>

<script>
  // import {mapGetters} from 'vuex'

  export default {
    name: "Register",
    data: () => ({
      success: false
    }),
    // computed: {
    //   ...mapGetters(['users', 'errorU'])
    // },
    // async mounted() {
    //   await this.$store.dispatch('getUsers')
    // },
    methods: {
      goToLogin() {
        this.$router.push('/login')
      },
      register() {
        console.log('register');
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
    width: 401px;
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
    width: 245px;
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
    margin-top: 135px;
  }

  input {
    background-color: #F7F7F7;
    // border-bottom: none;
    margin-bottom: 22px;
    border-radius: 12px;
  }
  label {
    margin: 0 7px 12px 18px;
  }
  .add-on {
    background-color: #F7F7F7;
    border-radius: 0 12px 12px 0;
    border-bottom: 2px solid #92D2C3;
    img {
      margin: 7px 25px;
    }
  }

  .form-group {
    margin: 0;
    margin-bottom: 56px;
  }

  .successfully {
    font-family: 'Roboto';
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #2D453F;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: auto;
    align-items: center;
    img {
      width: fit-content;
      padding-top: 27px;
      padding-bottom: 33px;
    }
    .btn {
      margin: 0;
      width: 294px;
    }
  }
</style>