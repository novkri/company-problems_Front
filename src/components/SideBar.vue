<template>
  <div class="sidebar col">

    <div class="links">
      <!-- <nav class="navbar navbar-light" v-if="isLoggedIn"> -->
      <div class="user">
        <span>{{userLoggedIn.surname}} {{userLoggedIn.name[0]+'.'}}
          {{userLoggedIn.father_name ? userLoggedIn.father_name[0]+'.' : ''}}</span>
        <div class="logout" @click="logout">
          <log-out-icon size="1.5x" class="custom-class"></log-out-icon>
        </div>
      </div>
      <!-- </nav> -->
      <div class="addProblem">
        <button type="button" class="btn btnMainAdd" @click="create" data-toggle="modal" data-target="#popupCreate">
          <span>Предложить проблему</span>
        </button>
      </div>


      <div class="main">
        <a>Списки проблем:</a>
        <a>-Предложенные мной</a>
        <a>-На рассмотрении</a>
        <a>-Для исполнения</a>
        <a>-По подразделениям <chevron-down-icon ref="linkIcon" @click="showLinks" size="1.5x" class="custom-class">
          </chevron-down-icon></a>
        <div class="links_groups">
          <a href="#" v-show="showGroups">
            <router-link to="/" exact>Все</router-link>
          </a>
          <a href="#" v-show="showGroups" v-for="(group, idx) in groups" :key="idx">{{group.name}}</a>
        </div>

      </div>




      <div class="info">
        <router-link to="/groups">Состав подразделений</router-link>
        <a href="#">Статистика</a>
        <a href="#">Архив проблем</a>
      </div>
    </div>

    <PopupCreate v-if="openCreate" @createProblem="createProblem(param = $event)" />
  </div>

</template>

<script>
  import {
    ChevronDownIcon,
    LogOutIcon
  } from 'vue-feather-icons'
  import {
    mapGetters
  } from 'vuex'
  import PopupCreate from '@/components/PopupProblems/Create'

  export default {
    name: 'sidebar',
    data: () => ({
      showGroups: false,
      openCreate: false
    }),
    components: {
      ChevronDownIcon,
      LogOutIcon,

      PopupCreate
    },
    computed: {
      ...mapGetters(['groups', 'user', 'problems', 'problemsUnderСonsideration']),
      isLoggedIn: function () {
        return this.$store.getters.isLoggedIn
      },
      userLoggedIn: function () {
        return JSON.parse(localStorage.getItem('user'))
      }
    },
    methods: {
      showLinks() {
        this.showGroups = !this.showGroups
        this.showGroups ? this.$refs['linkIcon'].classList.add('rotated') : this.$refs['linkIcon'].classList.remove(
          'rotated')
      },
      create() {
        this.openCreate = true
        this.$store.commit('setError', '')
      },

      logout() {
        this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/login')
          })
      },

      async underСonsideration() {
        // await this.$store.dispatch('getProblems')
        // this.$store.commit('sortProblems', 'На рассмотрении')
        // this.problems = this.problemsUnderСonsideration
        // this.$emit('filteredProblems', 'На рассмотрении')
        // console.log(this.problemsUnderСonsideration);
      },
      async onСhecking() {
        // await this.$store.dispatch('getProblems')
        // this.$store.commit('sortProblems', 'На проверке заказчика')
      },
      async allProblems() {
        // await this.$store.dispatch('getProblems')
        // this.$store.commit('sortProblems', '')
        // console.log(this.problems);
      },
    }
  }
</script>

<style lang="scss">
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #92D2C3;
    border-radius: 3px;
    height: 73px;
  }

  ::-webkit-scrollbar-track {
    background: #F2F2F2;
    border-left: 4px solid #F6F7F9;
    border-right: 4px solid #F6F7F9;
  }

  .links_groups {
    max-height: 166px;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    margin-bottom: 37px;
    direction: rtl;
    padding-left: 25px;

  }

  .btnMainAdd {
    padding: 13px 8px;
    border-radius: 12px;
    width: 213px;
    // height: 58px;
    background-color: transparent;
    color: #4EAD96;
    font-size: 16px;
    line-height: 17px;
    border: 2px solid #4EAD96;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'GothamPro-Medium';
    margin-bottom: 30px;
  }

  .btnMainAdd:hover {
    color: #fff;
    background-color: #4EAD96;
  }

  .body {
    display: flex;
  }

  .sidebar {
    max-width: 280px;
    background-color: #F6F7F9;
    padding: 0;
    // height: 100vh;

    // padding-left: 20px;
    // padding-right: 16px;

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
      // height: 80vh;
      justify-content: space-between;
      // padding-top: 60px;
      // padding-left: 30px;
      padding: 60px 26px 0;

      .user {
        position: relative;
        justify-content: space-between;
        align-items: center;
        display: flex;
        flex-direction: row;
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 65px;
        margin-left: -26px;

        span {
          font-family: 'GothamPro';
          font-size: 18px;
          line-height: 24px;
          letter-spacing: 0.15px;
          color: #4F4F4F;
          padding: 4px 13px;
          margin: auto;
        }
      }

      .logout {
        position: relative;
        width: 37.25px;
        height: 37.25px;
        background: #B9CBEF;
        border-radius: 50%;
        text-align: center;
        display: flex;
        cursor: pointer;
        z-index: 3;
        right: -2%;

        svg {
          margin: auto;
          justify-content: center;
          color: white;
        }
      }
    }

    .info,
    .main {
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

  .rotated {
    transform: rotate(180deg);
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

    &:focus,
    &:active {
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
    .sidebar {
      display: none;
    }

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