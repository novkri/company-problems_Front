<template>
  <div id="nav">
    <div class="dropdown">
      <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Меню
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
        <div class="links">
          <div class="main">
            <ul>
              <li>Списки проблем:</li>
              <li>-Предложенные мной</li>
              <li>-На рассмотрении</li>
              <li>-Для исполнения</li>
              <li>-По подразделениям</li>
            </ul>

            <router-link to="/" exact>Проблемы</router-link>
            <ul>
              <li>
                <router-link to="/" exact>Все</router-link>
              </li>
              <li v-for="(group, idx) in groups" :key="idx">
                {{group.name}}
              </li>
            </ul>
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
    </div>
    <nav class="navbar navbar-light">
      <!-- <div class="user">
        <span>Вы вошли как: {{userLoggedIn.surname}} {{userLoggedIn.name}}
          {{userLoggedIn.father_name}}</span>
      </div>
      <div class="logout" @click="logout">
        <log-out-icon size="1.5x" class="custom-class"></log-out-icon>
      </div> -->
      <div class="logo">
        logo
      </div>
      <div v-if="$route.matched.some(({ name }) => name === 'Problems')">
        Список проблем: (отдел)
      </div>
      <div class="filter" v-if="$route.matched.some(({ name }) => name === 'Problems')">
        <span>Срочность/важность:</span>
        <div class="select" style="position: relative;" ref="select">
          <ss-select v-model="importance" :options="statusesImportance" track-by="name" class="form-control"
            @change="filterImportance(importance)" disable-by="disabled" id="ss-select" style="width: fit-content;">
            <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
              style="cursor: pointer; width: 100%;">
              <ss-select-toggle style="width: 100%; padding: 13px;" id="select-toggle">
                {{ $get(selectedOption, 'name') || `${importance ? importance : 'Выбрать'}`}}
                <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
              </ss-select-toggle>

              <section v-show="isOpen" class="absolute border-l border-r min-w-full" style="height: auto;">
                <ss-select-option v-for="(option, index) in filteredOptions" :value="option" :index="index" :key="index"
                  class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
              </section>
            </div>
          </ss-select>
        </div>
      </div>
      <div class="filter" v-if="$route.matched.some(({ name }) => name === 'Problems')">
        <span>Срок исполнения:</span>
        <div class="select" style="position: relative;" ref="select">
          <ss-select v-model="time" :options="statusesTime" track-by="name" class="form-control"
            @change="filterTime(time)" disable-by="disabled" :class="[importance == 'Выполнено' ? 'green' : 'gray']"
            id="ss-select" style="width: fit-content;">
            <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
              style="cursor: pointer; width: 100%;">
              <ss-select-toggle style="width: 100%; padding: 13px;" id="select-toggle">
                {{ $get(selectedOption, 'name') || `${time ? time : 'Выбрать'}`}}
                <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
              </ss-select-toggle>

              <section v-show="isOpen" class="absolute border-l border-r min-w-full" style="height: auto;">
                <ss-select-option v-for="(option, index) in filteredOptions" :value="option" :index="index" :key="index"
                  class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
              </section>
            </div>
          </ss-select>
        </div>
      </div>
      <div class="filter" v-if="$route.matched.some(({ name }) => name === 'Problems')">
        <span>Статус:</span>
                  <ss-select v-model="statusProblem" :options="statusesProblem" track-by="name" class="form-control"
            @change="filterProblemStatus(statusProblem)" disable-by="disabled" :class="[importance == 'Выполнено' ? 'green' : 'gray']"
            id="ss-select" style="width: fit-content;">
            <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
              style="cursor: pointer; width: 100%;">
              <ss-select-toggle style="width: 100%; padding: 13px;" id="select-toggle">
                {{ $get(selectedOption, 'name') || `${statusProblem ? statusProblem : 'Выбрать'}`}}
                <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
              </ss-select-toggle>

              <section v-show="isOpen" class="absolute border-l border-r min-w-full" style="height: auto;">
                <ss-select-option v-for="(option, index) in filteredOptions" :value="option" :index="index" :key="index"
                  class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
              </section>
            </div>
          </ss-select>
      </div>
    </nav>
  </div>
</template>

<script>
  import {
    SsSelect,
    SsSelectToggle,
    SsSelectOption
  } from 'ss-select'

  import {
    ChevronDownIcon,
  } from 'vue-feather-icons'

  import {
    mapGetters
  } from 'vuex'


  export default {
    data: () => ({
      statusesImportance: [{
          name: "Только важные"
        },
        {
          name: "Только срочные"
        },
        {
          name: "Важные и срочные"
        },
        {
          name: "Остальные"
        },
        {
          name: "Все"
        }
      ],
      statusesTime: [{
          name: "Текущий квартал"
        },
        {
          name: "Остальные"
        },
        {
          name: "Все"
        },
      ],
            statusesProblem: [{
          name: "на рассмотрении"
        },
        {
          name: "В работе"
        },
        {
          name: "На проверке заказчика"
        },
        {
          name: "Все"
        },
      ]
    }),
    components: {
      ChevronDownIcon,

      SsSelect,
      SsSelectToggle,
      SsSelectOption
    },
    computed: {
      ...mapGetters(['groups']),
      //   isLoggedIn: function () {
      //     return this.$store.getters.isLoggedIn
      //   },
      //   userLoggedIn: function () {
      //     return JSON.parse(localStorage.getItem('user'))
      //   }
    },
    // mounted() {
    //   console.log(this.$route);
    // }

    // methods: {
    //   logout: function () {
    //     this.$store.dispatch('logout')
    //       .then(() => {
    //         this.$router.push('/login')
    //       })
    //   }
    // },
  }
</script>

<style lang="scss">
  .body {
    display: flex;
  }

  .filter {
    display: flex;
    align-items: center;

    span {
      padding-right: 5px;
    }
  }

  #nav {
    background-color: #fff;
    display: flex;
    flex-direction: row;
    height: 70px;
    box-shadow: 0px 4px 8px rgba(31, 23, 83, 0.15);
    position: relative !important;
    padding: 21px 26px 22px 25px;
    z-index: 2;
  }

  .navbar {
    width: 100%;
    display: flex;
    justify-content: space-between !important;
  }

  //   justify-content: flex-end;
  //   padding: 0rem 3rem;
  //   position: relative;
  //   height: 70px;

  //   .user {
  //     position: relative;
  //     top: 50%;
  //     padding: 6px 25px;
  //     background-color: #fff;
  //     border-radius: 5px;
  //     height: 36px;
  //     margin-right: -10px;

  //     span {
  //       font-family: 'GothamPro';
  //       font-size: 18px;
  //       line-height: 24px;
  //       letter-spacing: 0.15px;
  //       color: #4F4F4F;
  //     }
  //   }

  //   .logout {
  //     position: relative;
  //     top: 50%;
  //     width: 59px;
  //     height: 59px;
  //     background: #B3C3E4;
  //     border-radius: 50%;
  //     text-align: center;
  //     display: flex;
  //     cursor: pointer;
  //     z-index: 3;

  //     svg {
  //       margin: auto;
  //       justify-content: center;
  //       color: white;
  //     }
  //   }
  // }

  .dropdown {
    display: none;
    align-self: flex-end;
  }

  .btn-info,
  .btn-info:active {
    color: #000;
    font-family: 'GothamPro-Medium';
    background-color: #B3C3E4;
    border: none;
  }

  .dropdown-menu {
    background-color: #EBEBEB;
    width: max-content;
  }

  .links {
    padding: 25px;

    div {
      display: flex;
      flex-direction: column;
    }

    ul {
      padding: 0;
      list-style-type: none;

      li {
        margin-bottom: 6px;
      }
    }

    a {
      font-family: 'GothamPro';
      color: #000;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0.15px;
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


  body {

    overflow-x: hidden !important;
  }

  #ss-select {
    align-items: center;
    display: flex;
    height: 36px;
    border-radius: 10px;
    display: flex;
    padding: 0;
    width: fit-content;

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
      border-left: 4px solid white;
      border-right: 4px solid white;
    }

  }

  section {
    width: max-content;
    padding: 22px;
    position: absolute;
    max-height: 257px;
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
    .dropdown {
      display: flex;
    }

    * {
      font-size: 13px;
    }

    .navbar .user span,
    .sidebar a {
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

<style>

</style>