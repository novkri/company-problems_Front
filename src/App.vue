<template>
  <div id="app">
    <div id="nav">
    </div>

    <router-view />
    
  </div>
</template>

<style lang="scss">
  #app {
    font-family: 'GothamPro', sans-serif;
    font-size: 18px;
    line-height: 17px;
    font-weight: 500;
    letter-spacing: 0.15px;
  }
  .container {
    width: 293px;
    margin: 50px;
    padding: 0;
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
  .form-control:focus {
    box-shadow: none;
  }
  .form-control {
    border: transparent;
    border-bottom: 2px solid #92D2C3;
    border-radius: 6px;
    background-color: #FAFAFA;
    color: #2D453F;
    margin-bottom: 3px;
    caret-color: #92D2C3;
  }

  .error {
    font-size: 12px;
    color: red;
  }

  form {
    margin-right: 30px;
    width: 85%;
  }

  .form-control--error {
    border: 1px solid red;
    border-bottom: 2px solid red;
  }

  //   a {
  //     font-weight: bold;
  //     color: #2c3e50;

  //     &.router-link-exact-active {
  //       color: #42b983;
  //     }
  //   }
  // }
</style>