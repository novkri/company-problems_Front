<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar navbar-light" v-if="isLoggedIn">
        <div class="user">
          <span>Вы вошли как: {{userLoggedIn.surname}} {{userLoggedIn.name}}
            {{userLoggedIn.father_name}}</span>
        </div>
        <div class="logout" @click="logout">
          <log-out-icon size="1.5x" class="custom-class"></log-out-icon>
        </div>
      </nav>
    </div>

    <div class="body" >
      <div class="sidebar col" v-if="isLoggedIn">
        <div class="links">
          <div class="main">
            <router-link to="/problems">Проблемы</router-link>
          </div>
          <div class="groups">
            <a href="#">Проекты</a>
            <a href="#">Отделы</a>
            <a href="#">Команды</a>
          </div>
          <div class="info">
            <router-link to="/groups">Список подразделений</router-link>
            <a href="#">Статистика</a>
          </div>
          <div class="footer">
            <a href="#">Помощь</a>
            <a href="#">Выйти из системы</a>
          </div>
        </div>
        
      </div>
      <div class="col">
        <router-view />
      </div>
    </div>
    

  </div>
</template>

<script>
  import {
    LogOutIcon 
  } from 'vue-feather-icons'
    import {
    mapGetters
  } from 'vuex'

  export default {
    components: {
      LogOutIcon 
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
.body {
  display: flex;
}
.sidebar {
  max-width: 280px;
  background-color: #F6F7F9;
  padding: 0;

  a {
    margin-bottom: 17px;
    font-family: 'GothamPro';
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
  }
  a:hover {
    color: #4F4F4F;
  }
.router-link-active {
    font-family: 'GothamPro-Medium';
  }
  .links {
    display: flex;
    flex-direction: column;
    height: 77vh;
    justify-content: space-between;
    padding-top: 60px;
    padding-left: 30px;
    // padding: 60px 30px 0;
  }
  
  
  .groups {
    padding-left: 13px;
  }
  .groups, .info, .footer {
    display: flex;
    flex-direction: column;
  }
}
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
    padding: 0rem 3rem;
    position: relative;
    height: 70px;
    background-color: #C1CFEC;

    .user {
      position: relative;
          top: 50%;
      padding: 6px 25px;
      background-color: #fff;
      border-radius: 5px;
      height: 36px;
      margin-right: -10px;
      span {
        font-family: 'GothamPro';
        font-size: 18px;
        line-height: 24px;
        letter-spacing: 0.15px;
        color: #4F4F4F;
      }
    }
    .logout {
      position: relative;
          top: 50%;
      width: 59px;
      height: 59px;
      background: #B3C3E4;
      border-radius: 50%;
      text-align: center;
      display: flex;
      cursor: pointer;
      z-index: 3;
      svg {
        margin: auto;
        justify-content: center;
        color: white;
      }
    }
  }

  // option {
  //   width: max-content;
  // }

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
    width: max-content;
    padding: 22px;
    // width: 250px;
        // width: 215px;
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
    .navbar .user span, .sidebar a {
      font-size: 14px;
    }

    .form-control {
        font-size: 14px !important;
      }
      .footer {
        margin-top: 60px !important;
      }

  }

</style>