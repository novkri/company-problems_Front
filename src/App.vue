<template>
  <div id="app">
    <div id="nav">
      <nav class="navbar navbar-light bg-light" v-if="isLoggedIn">
        <a class="navbar-brand">Navbar</a>
        <span>{{userLoggedIn}} (имя здесь для разработки)</span>
        <span><a @click="logout">Logout</a></span>
      </nav>
    </div>

    <router-view />
    
  </div>
</template>

<script>
  export default {
    computed : {
      isLoggedIn : function(){ 
        return this.$store.getters.isLoggedIn},
      userLoggedIn : function(){ 
        // console.log(localStorage.getItem('user'));
      return localStorage.getItem('user')}
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
  #app {
    font-family: 'GothamPro', sans-serif;
    font-size: 18px;
    line-height: 17px;
    font-weight: 500;
    letter-spacing: 0.15px;
  }
  .container {
    width: 436px;
    margin: 50px;
    padding: 0;
    margin: 50px auto 0;
  }
  a {
    cursor: pointer;
  }

  button:focus, .btn:focus {
    outline: none;
    box-shadow: none;
  }
  .btnMain:hover {
    background-color: #76DFC7 !important;
  }
  .btn-secondary:hover {
    background-color: #d5d5d5 !important;
  }
  
  
  p {
    word-break: break-all;
    margin: 0;
  }

  .btnMain:active {
    background-color: #4EAD96 !important;
  }
  .btn-secondary:active {
      background-color: #545b62 !important;
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
    &:focus {
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
    border-bottom: 2px solid #92D2C3;
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
    border-bottom: 2px solid #FF8585;
    &:focus {
      box-shadow: none;
      border-bottom: 2px solid #FF8585;
    }
  }
</style>