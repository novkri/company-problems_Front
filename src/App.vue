<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar navbar-light bg-light" v-if="isLoggedIn" style="height: 78px;">
        <span style="margin: 0 55px;">Вы вошли как: {{user.surname}} {{user.name}}
          {{user.father_name}}</span>
        <log-in-icon @click="logout" size="1.5x" class="custom-class"></log-in-icon>
      </nav>
    </div>

    <router-view />

  </div>
</template>

<script>
  import {
    LogInIcon
  } from 'vue-feather-icons'
    import {
    mapGetters
  } from 'vuex'

  export default {
    components: {
      LogInIcon
    },
    computed: {
       ...mapGetters(['user']),
      isLoggedIn: function () {
        return this.$store.getters.isLoggedIn
      },
      userLoggedIn: function () {
        return JSON.parse(localStorage.getItem('user'))
      }
    },

    methods: {
      logout: function () {
        this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/login')
          })
      }
    },
  }
</script>

<style lang="scss">


  #remove {
    display: none;

    span {
      margin: 0;
      color: #848484;
      font-size: 26px;
    }
  }

  #list:hover #remove {
    display: flex;
  }


  #app {
    font-family: 'GothamPro', sans-serif;
    font-size: 18px;
    line-height: 17px;
    font-weight: 500;
    letter-spacing: 0.15px;
  }

  .navbar {
    justify-content: flex-end;
    padding: .5rem 3rem;
  }

  .container {
    width: 436px;
    margin: 50px;
    padding: 0;
    margin: 50px auto 0;
  }

  .btn-and-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
  }

  a {
    margin: 0;
    font-size: 18px;
    line-height: 17px;
    font-family: 'GothamPro-Medium';
    color: #92D2C3;
    cursor: pointer;
  }

  a:hover {
    color: #92D2C3;
  }

  button:focus,
  .btn:focus {
    outline: none;
    box-shadow: none;
  }

  .btnMain:hover,
  .btn-secondary:hover {
    background-color: #76DFC7 !important;
  }


  p {
    word-break: break-all;
    margin: 0;
  }

  .btnMain:active,
  .btn-secondary:active {
    background-color: #4EAD96 !important;
  }

  .btn-secondary:not(:disabled):not(.disabled):active:focus {
    box-shadow: none;
  }

  .form-control {
    border: transparent;
    border-bottom: none;
    border-radius: 6px;
    background-color: #FAFAFA;
    color: #2D453F;
    margin-bottom: 3px;
    caret-color: #92D2C3;

    &:focus, &:active {
      box-shadow: none;
      border-bottom: none;

    }
  }

  .form-control--valid {
    border: transparent;
    border-radius: 6px;
    background-color: #FAFAFA;
    color: #2D453F;
    caret-color: #92D2C3;
    border-bottom: 2px solid #92D2C3 !important;


    &:focus {
      box-shadow: none;
      border-bottom: 2px solid #92D2C3;
    }
   
  }

  .error {
    color: red;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.15px;
  }

  form {
    margin-right: 30px;
    width: 85%;
  }


  .form-control--error {
    border: transparent;
    border-radius: 6px;
    background-color: #FAFAFA;
    color: #2D453F;
    caret-color: #FF8585;
    border-bottom: 2px solid #FF8585 !important;

    &:focus {
      box-shadow: none;
      border-bottom: 2px solid #FF8585;
    }
  }

  select:focus {
    outline: none;
  }

  body {

    overflow-x: hidden !important;
    /* Hide horizontal scrollbar */
  }

  // @media (max-width: 1440px) {
  //   html {
  //     display: flex;
  //     flex-wrap: inherit;
  //   }
  // }
  // @media (max-width: 1600px) {
  //   * {
  //     font-size: 15px;
  //   }
  // }
    #ss-select {
    align-items: center;
    display: flex;
    height: 36px;
    border-radius: 10px;
    display: flex;
    padding: 0;
        width: fit-content;
  }
    section {
          width: fit-content;
    padding: 22px;
    // width: 250px;
        width: 215px;
    position: absolute;
    max-height: 257px;
    // right: -19%;
    top: 102%;

    border-radius: 10px;
    box-shadow: 0px 4px 16px rgba(54, 44, 117, 0.08);
    background-color: white;
    color: #828282;
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 10000;
  }






  @media (max-width: 1300px) {
    * {
      font-size: 13px;
    }

    .form-control {
        font-size: 14px !important;
      }
      .footer {
        margin-top: 60px !important;
      }

  }

</style>