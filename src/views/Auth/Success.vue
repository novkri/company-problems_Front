<template>
  <div class="container">
    <div class="successfully">
      <span>Вы успешно зарегистрированы</span>
      <thumbs-up-icon size="3x" class="custom-class" style="color: #92D2C3; margin: 73px 0;"></thumbs-up-icon>
      <button type="button" class="btn" @click="goToLogin">
        На страницу авторизации
      </button>
    </div>
  </div>

</template>

<script>
  import {
    ThumbsUpIcon
  } from 'vue-feather-icons'
  export default {
    name: 'success',
    components: {
      ThumbsUpIcon
    },
    methods: {
      goToLogin() {
        this.$router.push('/login')
      }
    }
  }
</script>

<style lang="scss" scoped>
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
    margin-top: 40px;
    justify-content: center;
  }

  .container {
    width: 615px;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    height: auto;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #828282;
    flex-direction: column;
    height: 100vh;
  }

  .successfully {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: auto;
    align-items: center;

    span {
      font-family: 'GothamPro-Medium';
      font-size: 24px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #2D453F;
    }

    .btn {
      max-height: 45px;
      margin: 0;
      width: 294px;
    }
  }

  button:focus,
  button:active,
  button {
    outline: none;
  }
</style>