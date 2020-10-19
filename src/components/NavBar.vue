<template>
  <nav class="navbar navbar-light" id="nav_main"
    :class="[this.$route.path === '/' || this.$route.path == '/groups' || this.$route.path == '/statistics' ? 'main' : '']">

    <!-- <div class="for_me" @click="allProblems">
      <router-link to="/" exact style="font-family: 'GothamPro-Medium';font-size: 16px;"><img src="@/assets/logo.png"
          alt="PSS Software">
      </router-link>
    </div> -->

    <div class="logo" >
      <router-link to="/my-problems" exact style="font-family: 'GothamPro-Medium';font-size: 16px;"><img src="@/assets/logo.png"
          alt="PSS Software">
      </router-link>
    </div>
    <div v-tooltip="currentGroupName.length > 30 ? currentGroupName : ''" class="group_selected"
      v-if="$route.path.split('-').includes('problems') || $route.path.split('-').includes('/problems')">
      Список проблем: {{currentGroupName}} <p></p>
    </div>
    <div v-show="$route.path == '/groups'" class="group_selected">
      Список подразделений <p></p>
    </div>
    <div v-show="$route.path == '/statistics'" class="group_selected">
      Статистика <p></p>
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
        :class="[this.$route.path == '/problems-archive' ? 'archive' : '' ]"
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
    mounted() {
      setTimeout(() => {
        var element = document.getElementById("nav_main");
        element.scrollIntoView({
          block: "start",
          inline: "start",
          behavior: "smooth"
        });
      })
    },
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
        this.statusProblem = ''
        this.time = ''
        this.importance = ''
        switch (this.$route.path) {
          case '/':
            this.$store.dispatch('changeStatusesProblem', [])
            this.$store.dispatch('changeCurrentGroupName', "Все")
            break;
          case '/my-problems':
            this.$store.dispatch('changeStatusesProblem', [

              {
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
          case "/group":
            this.$store.dispatch('changeCurrentGroupName', "Список подразделений")
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
          case "/problems-archive":
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
            to.params.id ? this.$store.dispatch('changeCurrentGroupName', this.groups.find(g => g.id == to.params.id)
              .name) : ''
            break;
        }
      }
    },

    methods: {
      async allProblems() {
        await this.$store.dispatch('getProblems')
      },
      async filterImportance(imp) {
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
    top: 72%;
    left: 88%;
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

    max-width: 390px;
    word-break: break-all;
    overflow-y: hidden;
    max-height: 27px;
  }


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
      align-self: center;
      padding-bottom: 4px;
    }
  }


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
      font-size: 16px;
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
    color: #fff !important;
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
  }

  section {
    padding: 0;
    position: absolute;
    max-height: 257px;
    top: 93%;
    left: -17%;
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

    #filterStatus {
      left: -37% !important;
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

    .footer {
      margin-top: 60px !important;
    }

  }



  @media (max-width: 500px) {

    .logo,
    .filter {
      display: none;
    }

    .arrow,
    .burger {
      display: flex;
    }

    .burger {
      display: block;
      position: relative;
      width: 30px;
      height: 21px;
      position: relative;
      z-index: 3;
    }

    .burger:before,
    .burger:after {
      content: '';
      background-color: #4F4F4F;
      position: absolute;
      width: 100%;
      height: 3px;
      left: 0;
      transition: all 0.3s ease 0s;
    }

    .burger span {
      position: absolute;
      background-color: #4F4F4F;
      left: 0;
      top: 9px;
      width: 100%;
      height: 3px;
      transition: all 0.3s ease 0s;
    }

    .burger:before {
      top: 0;
    }

    .burger:after {
      bottom: 0;
    }

    .burger.active:before {
      transform: rotate(45deg);
      top: 9px;
    }

    .burger.active:after {
      transform: rotate(-45deg);
      bottom: 9px;
    }

    .burger.active span {
      transform: scale(0);
    }

    .burger_menu {
      display: flex;
      position: fixed;
      top: -100%;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: aqua;
      padding: 70px 10px 20px 10px;
      transition: all 0.3s ease 0s;
    }

    .burger_menu.active {
      top: 0;
    }



    .navbar {
      justify-content: space-between !important;
    }
  }
</style>