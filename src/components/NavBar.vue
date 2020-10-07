<template>
  <!-- <div id="nav">
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
    </div> -->
  <nav class="navbar navbar-light" :class="[this.$route.path === '/' ? 'main' : '']">
    <div class="logo" @click="allProblems">
      <router-link to="/" exact style="font-family: 'GothamPro-Medium';font-size: 16px;"><img src="@/assets/logo.png"
          alt="PSS Software">
      </router-link>
    </div>
    <div v-tooltip="currentGroupName" class="group_selected"
      v-if="$route.path.split('-').includes('problems') || $route.path.split('-').includes('/problems')">
      Список проблем: {{currentGroupName}} <p></p>
    </div>
    <div class="filter"
      v-if="$route.path.split('-').includes('problems') || $route.path.split('-').includes('/problems')"
      v-show="this.$route.path !== '/'">
      <span>Срочность/важность:</span>
      <div class="select" style="position: relative;" ref="select">
        <ss-select v-model="importance" :options="statusesImportance" track-by="name" class="form-control"
          @change="filterImportance(importance)" disable-by="disabled" id="ss-select" style="width: fit-content;">
          <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
            style="cursor: pointer; width: 100%;">
            <ss-select-toggle style="width: 100%;" id="select-toggle">
              {{ $get(selectedOption, 'name') || `${importance ? importance : 'Выбрать'}`}}
              <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
            </ss-select-toggle>

            <section v-show="isOpen" class="absolute border-l border-r min-w-full" style="height: auto;">
              <ss-select-option v-for="(option, index) in filteredOptions" :value="option" :index="index" :key="index"
                class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'selected' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
            </section>
          </div>
        </ss-select>
      </div>
    </div>

    <div class="filter"
      v-if="$route.path.split('-').includes('problems') || $route.path.split('-').includes('/problems')"
      v-show="this.$route.path !== '/'">
      <span>Срок исполнения:</span>
      <div class="select" style="position: relative;" ref="select">
        <ss-select v-model="time" :options="statusesTime" track-by="name" class="form-control"
          @change="filterTime(time)" disable-by="disabled" :class="[importance == 'Выполнено' ? 'green' : 'gray']"
          id="ss-select" style="width: fit-content;">
          <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
            style="cursor: pointer; width: 100%;">
            <ss-select-toggle style="width: 100%;" id="select-toggle">
              {{ $get(selectedOption, 'name') || `${time ? time : 'Выбрать'}`}}
              <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
            </ss-select-toggle>

            <section v-show="isOpen" class="absolute border-l border-r min-w-full" style="height: auto;">
              <ss-select-option v-for="(option, index) in filteredOptions" :value="option" :index="index" :key="index"
                class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'selected' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
            </section>
          </div>
        </ss-select>
      </div>
    </div>
    <div class="filter"
      v-if="$route.path.split('-').includes('problems') || $route.path.split('-').includes('/problems')"
      v-show="this.$route.path !== '/group-problems' && this.$route.path !== '/'">
      <span>Статус:</span>
      <ss-select v-model="statusProblem" :options="statusesProblem" track-by="name" class="form-control"
        :class="[this.$route.path == '/problems-user-archive' ? 'archive' : '' ]"
        @change="filterProblemStatus(statusProblem)" disable-by="disabled" id="ss-select" style="width: fit-content;">
        <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
          style="cursor: pointer; width: 100%;">
          <ss-select-toggle style="width: 100%;" id="select-toggle">
            {{ $get(selectedOption, 'name') || `${statusProblem ? statusProblem : 'Выбрать'}`}}
            <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
          </ss-select-toggle>

          <section v-show="isOpen" class="absolute border-l border-r min-w-full" style="height: auto;"
            id="filterStatus">
            <ss-select-option v-for="(option, index) in filteredOptions" :value="option" :index="index" :key="index"
              class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'selected' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
          </section>
        </div>
      </ss-select>
    </div>
  </nav>
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
      importance: '',
      time: '',
      statusProblem: '',

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
    }),
    components: {
      ChevronDownIcon,

      SsSelect,
      SsSelectToggle,
      SsSelectOption
    },
    computed: {
      ...mapGetters(['groups', 'currentGroupName', 'statusesProblem']),
    },
    watch: {
      $route(to) {
        // console.log(to, from);
        this.statusProblem = ''
        this.time = ''
        this.importance = ''
        switch (this.$route.path) {
          case '/':
            this.$store.dispatch('changeStatusesProblem', [])
            this.$store.dispatch('changeCurrentGroupName', "Все")
            break;
          case '/my-problems':
            this.$store.dispatch('changeStatusesProblem', [{
                name: "На рассмотрении"
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
            ])
            this.$store.dispatch('changeCurrentGroupName', "Предложенные мной")
            break;
          case "/problems-for-execution":

            this.$store.dispatch('changeStatusesProblem', [{
                name: "В работе"
              },
              {
                name: "На проверке заказчика"
              },
              {
                name: "Все"
              },
            ])
            this.$store.dispatch('changeCurrentGroupName', "Для исполнения")
            break;
          case "/group-problems":
            this.$store.dispatch('changeStatusesProblem', [])
            this.$store.dispatch('changeCurrentGroupName', "На рассмотрении")
            break;
          case "/problems-of-all-groups":
            this.$store.dispatch('changeStatusesProblem', [{
                name: "В работе"
              },
              {
                name: "На проверке заказчика"
              },
              {
                name: "Все"
              },
            ])
            this.$store.dispatch('changeCurrentGroupName', "Все")
            break;
          case "/problems-user-archive":
            this.$store.dispatch('changeStatusesProblem', [{
                name: "Решена"
              },
              {
                name: "Удалена"
              },

              {
                name: "Все"
              },
            ])
            this.$store.dispatch('changeCurrentGroupName', "Архив")
            break;
          default:
            this.$store.dispatch('changeStatusesProblem', [{
                name: "В работе"
              },
              {
                name: "На проверке заказчика"
              },
              {
                name: "Все"
              },
            ])
            this.$store.dispatch('changeCurrentGroupName', this.groups.find(g => g.id == to.params.id).name)
            break;
        }
      }
    },

    methods: {
      async allProblems() {
        await this.$store.dispatch('getProblems')
      },
      async filterImportance(imp) {
        // console.log(this.$route.path);
        switch (imp.name) {
          case "Только важные":
            this.$store.dispatch('filterImportance', {
              path: this.$route.path,
              urgency: '',
              importance: 'Важная',
              deadline: '',
              status: ''
            })
            break;
          case "Только срочные":
            this.$store.dispatch('filterImportance', {
              path: this.$route.path,
              urgency: 'Срочная',
              importance: '',
              deadline: '',
              status: ''
            })
            break;
          case "Важные и срочные":
            this.$store.dispatch('filterImportance', {
              path: this.$route.path,
              urgency: 'Срочная',
              importance: 'Важная',
              deadline: '',
              status: ''
            })
            break;
          case "Остальные":
            this.$store.dispatch('filterImportance', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: ''
            })
            break;
          case "Все":
            this.$store.dispatch('filterImportance', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: ''
            })
            break;
        }
      },

      async filterTime(time) {
        switch (time.name) {
          case "Текущий квартал":
            this.$store.dispatch('filterTime', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: 'Текущий квартал',
              status: ''
            })
            break;

          case "Остальные":
            this.$store.dispatch('filterTime', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: 'Остальные',
              status: ''
            })
            break;
          case "Все":
            this.$store.dispatch('filterTime', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: ''
            })
            break;
        }
      },

      async filterProblemStatus(status) {
        switch (status.name) {
          case "Решена":
            this.$store.dispatch('filterProblemStatus', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: 'Решена'
            })
            break;
          case "Удалена":
            this.$store.dispatch('filterProblemStatus', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: 'Удалена'
            })
            break;
          case "На рассмотрении":
            this.$store.dispatch('filterProblemStatus', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: 'На рассмотрении'
            })
            break;
          case "В работе":
            this.$store.dispatch('filterProblemStatus', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: 'В работе'
            })
            break;
          case "На проверке заказчика":
            this.$store.dispatch('filterProblemStatus', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: 'На проверке заказчика'
            })
            break;
          case "Все":
            this.$store.dispatch('filterProblemStatus', {
              path: this.$route.path,
              urgency: '',
              importance: '',
              deadline: '',
              status: ''
            })
            break;
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .selected {
    background-color: #92D2C3;
    color: #fff;

  }

  #filterStatus {
    top: 69%;
    left: 80%;
  }

  .archive {
    #filterStatus {
      top: 69%;
      left: 86%;
    }
  }

  .group_selected {
    align-self: center;
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 24px;
    text-align: justify;
    letter-spacing: 0.15px;
    color: #4F4F4F;

    max-width: 340px;
    word-break: break-all;
    overflow-y: hidden;
    max-height: 27px;
  }

  // .v-tooltip-open {
  //   color: #4F4F4F;
  //   background-color: #fff;
  // }

  // .group_selected:hover {
  //   overflow: visible;
  //   width: fit-content;
  //   height: fit-content;
  // }

  .logo {
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #60749F;
  }

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

  // .filter:last-child {
  //   margin-top: 10px;
  // }

  nav {
    background-color: #fff;
    display: flex;
    flex-direction: row;
    max-height: 70px;
    min-height: 70px;
    height: fit-content;
    box-shadow: 0px 4px 8px rgba(31, 23, 83, 0.15);
    position: relative !important;
    padding: 21px 26px 22px 25px;
    z-index: 2;

    div {
      font-family: 'GothamPro';
      font-size: 14px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.15px;
      color: #4F4F4F;
    }
  }

  .navbar {
    width: 100%;
    display: flex;
    justify-content: space-between !important;
    align-items: flex-start;
  }

  .main {
    justify-content: flex-start !important;

    .logo {
      padding-right: 55px;
    }
  }


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
    height: fit-content;
    border-radius: 10px;
    display: flex;
    padding: 0;
    width: fit-content;
    background-color: #F2F5FA;

    #select-toggle {
      padding: 1px 16px 2px 24px;
    }

    // ::-webkit-scrollbar {
    //   width: 10px;
    // }

    // ::-webkit-scrollbar-thumb {
    //   background: #92D2C3;
    //   border-radius: 3px;
    //   height: 73px;
    // }

    // ::-webkit-scrollbar-track {
    //   background: #F2F2F2;
    //   border-left: 4px solid white;
    //   border-right: 4px solid white;
    // }

  }

  section {
    // width: max-content;
    // padding: 22px;
    padding: 0;
    position: absolute;
    max-height: 257px;
    top: 102%;
    width: 193px;

    border-radius: 10px;
    box-shadow: 0px 4px 16px rgba(54, 44, 117, 0.08);
    background-color: white;
    color: #828282;
    height: 400px;
    overflow: hidden;
    z-index: 10000;
  }



  @media (max-width: 1500px) {
    * {
      font-size: 14px !important;
    }
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