<template>
  <div>
    <div class="popup-show">
      <div id="popupShow" class="modal fade" role="dialog" style="padding: 0 !important; overflow: hidden;">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="height: 750px;" role="document">
          <div class="modal-content">
            <div class="modal-header tab row">

              <div class="tabDiv col-xl-3 col-lg-4" :class="[tab ? 'active' : '']" @click="toggleTab1()">
                <eye-icon size="1.5x" class="custom-class"></eye-icon>
                <button class="btn btnTab">Просмотр проблемы</button>
              </div>
              <div class="tabDiv col-xl-3 col-lg-4" :class="[tab ? '' : 'active']" @click="toggleTab2()">
                <img src="@/assets/tasks.png" v-if="tab">
                <img src="@/assets/listGreen.png" v-else>
                <button class="btn btnTab">Добавить решение</button>
              </div>

              <div class="col" style="width: 100%;">
                <button type="button" id="close" class="close" data-dismiss="modal" style="font-size: 24px;">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>

            <div class="modal-header" v-if="tab">
              <div class="subtitle subtitle1">
                <h5 class="modal-title" @click="showEdit = !showEdit" v-if="!showEdit">{{val.name}}</h5>
                <div class="form-group" v-else>
                  <input autofocus @blur="editProblem()" @keyup.enter="onKey($event)" @focus="onFocusInput($event)"
                    ref="input" class="form-control" id="new-problem-title" v-model="val.name">
                  <div class="error" v-if="error">{{error}}</div>
                </div>
                <!-- <h6 v-if="progress !== ''">Прогресс решения {{progress}}%</h6>
                <h6 v-else>Прогресс решения 0%</h6>
                <div class="icons">
                  <img src="~@/assets/star.png">
                  <span>95</span>
                </div> -->
              </div>
            </div>

            <div class="modal-body" v-if="tab">
              <div>
                <div class="subtitle row subt">
                  <div class="col-5">
                    Решение в работе:
                  </div>
                  <div class="col-2">
                    Статус выполнения
                  </div>
                  <div class="col-2">
                    Срок исполнения
                  </div>
                  <div class="col-2">
                    Ответственный
                  </div>
                  <div style="width: 20px" class="col">
                  </div>
                </div>
                <div>

                  <ol>
                    <li v-for="(solution, idx) in solutions" :key="idx" id="list" class="row">
                      <div class="list-item col-5">
                        <div class="desc" ref="desc"><span>{{idx+1}}.{{solution.name}}</span>
                        </div>
                      </div>

                      <div class="select col-2" style="position: relative;" ref="select">
                        <ss-select v-model="solution.status" :options="statuses" track-by="name" search-by="name"
                          class="form-control" @change="changeStatus(solution.id, solution.status)"
                          disable-by="disabled" :class="[solution.status == 'Выполнено' ? 'green' : 'gray']"
                          id="ss-select" style="width: fit-content;">
                          <div
                            slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                            style="cursor: pointer; width: 100%;">
                            <ss-select-toggle style="width: 100%; padding: 13px;" id="select-toggle">
                              {{ $get(selectedOption, 'name') || `${solution.status ? solution.status : 'Выбрать'}`}}
                              <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
                            </ss-select-toggle>

                            <section v-show="isOpen" class="absolute border-l border-r min-w-full"
                              style="height: auto;">
                              <ss-select-option v-for="(option, index) in filteredOptions" :value="option"
                                :index="index" :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
                            </section>
                          </div>
                        </ss-select>
                      </div>

                      <div class="dateDiv col-2">
                        <input type="date" id="start" name="trip-start" class="date" v-model="solution.deadline"
                          onkeypress="return false" @change="changeDeadline(solution.deadline, solution.id)">
                      </div>

                      <div class="selectResponsible col-2">
                        <ss-select v-model="solution.executor_id" :options="allUsers" track-by="id" search-by="id"
                          @change="selectExecutor(solution.id, solution.executor_id)" disable-by="disabled"
                          id="ss-select">
                          <div
                            slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                            style="cursor: pointer;">
                            <ss-select-toggle class="pl-1 pr-4 py-1 flex items-center justify-between"
                              id="select-toggle">
                              <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
                              {{ $get(selectedOption, 'id') || `${allUsers.find(u => u.id == solution.executor_id) ? allUsers.find(u => u.id == solution.executor_id).name : 'Выбрать'}`}}
                            </ss-select-toggle>

                            <section v-show="isOpen" class="absolute border-l border-r min-w-full">
                              <!-- <div class="px-px" >
                              <ss-select-search-input class="w-full px-3 py-1" style="width: 238px; border: none; background-color: #F2F2F2;" placeholder="Впишите имя"></ss-select-search-input>
                            </div> -->

                              <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id"
                                :index="index" :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
                            </section>
                          </div>
                        </ss-select>
                      </div>

                      <div style="width: 20px" class="col">
                        <button type="button" class="close" id="remove" style="margin: auto;font-size: 20px;"
                          @click="removeFromWork(solution)" data-toggle="modal" data-target="#popupRemoveFromWOrk">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                    </li>
                  </ol>
                </div>

                <div class="tasks" v-if="solutions[0]">
                  <Tasks :val="solutions" />
                </div>
              </div>
            </div>
            <Solutions v-if="!tab" :openS="openSolutions" @closeSolutions="closeSolutions($event)" :val="val" />
          </div>
        </div>
      </div>
    </div>


    <Solutions v-if="openSolutions" :openS="openSolutions" @closeSolutions="closeSolutions($event)" :val="val" />
    <RemoveFromWork v-if="openRemoveFromWork" :openRemoveFromWork="openRemoveFromWork"
      @closeRemoveSolutions="closeRemoveSolutions($event)" :val="solutionIdRemove" />
    <DeleteTask v-if="openDeleteTask" :openDeleteT="openDeleteTask" @closeDeleteTask="closeDeleteTask($event)"
      :val="taskIdDelete" />
  </div>

</template>

<script>
  //  import flatPickr from 'vue-flatpickr-component';
  //   import 'flatpickr/dist/flatpickr.css';
  //   import { Russian } from "flatpickr/dist/l10n/ru.js"

  import {
    UserIcon,
    EyeIcon,
    ChevronDownIcon
  } from 'vue-feather-icons'

  import {
    mapGetters
  } from 'vuex'

  import Solutions from './Solutions'
  import RemoveFromWork from './RemoveFromWork'
  import Tasks from './Tasks/Tasks'
  import DeleteTask from './Tasks/DeleteTask'
  import {
    SsSelect,
    SsSelectToggle,
    SsSelectOption,
  } from 'ss-select'
  // SsSelectSearchInput


  export default {
    name: 'popup',
    props: ['open', 'val', 'tab'],
    data: () => ({
      openSolutions: false,
      showTasks: false,
      showEdit: false,
      openRemoveFromWork: false,
      openDeleteTask: false,


      solutionName: '',
      solutionIdRemove: '',
      problemName: '',
      taskIdDelete: '',

      progress: '',
      btnRemove: false,
      selected: false,

      obj: '',

      statuses: [{
          name: "В процессе"
        },
        {
          name: "Выполнено"
        }
      ],
      // config: {

      //     altInput: true,
      //     altFormat: 'd.m.Y',

      //     dateFormat: 'Y-m-d',
      //     locale: Russian // locale for this instance only          
      //   }, 
    }),
    components: {
      UserIcon,
      EyeIcon,
      ChevronDownIcon,

      Solutions,
      RemoveFromWork,
      Tasks,
      DeleteTask,

      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      // SsSelectSearchInput

      // flatPickr
    },
    computed: {
      ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404', 'allUsers', 'currentSolution', 'tasks']),
    },
    methods: {
      onFocusInput(event) {
        this.problemName = event.target.value
      },
      onKey(event) {
        event.target.blur()
      },

      async editProblem() {
        await this.$store.dispatch('checkIfExists', {
            id: this.val.id
          })
          .then(async () => {
            if (this.val.name !== this.problemName) {
              await this.$store.dispatch('editProblem', {
                id: this.val.id,
                name: this.val.name
              }).then(() => this.showEdit = false)
              // .catch((e) => console.log(e))
            } else {
              this.showEdit = false
            }
          })
      },

      async selectExecutor(id, uid) {
        await this.$store.dispatch('changeExecutor', {
          id,
          uid
        })
      },
      async changeStatus(id, status) {
        await this.$store.dispatch('changeStatus', {
          status: status.name,
          id
        })
      },
      async changeDeadline(deadline, id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('changeDeadline', {
          deadline,
          id
        })
      },

      async removeFromWork(obj) {
        this.solutionIdRemove = obj.id
        this.openRemoveFromWork = true
      },


      showSolutions() {
        this.openSolutions = true
      },
      closeSolutions() {
        this.openSolutions = false
      },
      toggleTab1() {
        this.$emit('changeTab', true)
      },
      toggleTab2() {
        this.$emit('changeTab', false)
      },

    }
  }
</script>

<style scoped lang="scss">
  .tab {
    height: 51px !important;
    padding: 0 !important;
    display: flex;
    flex-direction: row !important;
    justify-content: flex-start !important;
    // background-color: #F2F2F2;
    border-radius: 12px;
    margin-left: -42px;
    // width: 42%;

    .btnTab {
      width: fit-content;
      border-radius: 12px;
      background-color: #F2F2F2;
      margin: 0;
      color: #828282;
      font-family: 'GothamPro';
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
      height: 100%;
      margin-left: 17px;

    }

  }

  .tabDiv {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 50%;
    align-items: center;
    justify-content: center;
    background-color: #F2F2F2;
    cursor: pointer;
    border-radius: 12px 12px 0px 0px;

    img {
      height: fit-content;
      cursor: pointer;
    }

  }

  .active {
    background-color: #fff !important;
    border-radius: 12px 12px 0 0px;

    .btnTab {
      background-color: #fff;
      color: #4EAD96;
      font-family: 'GothamPro-Medium';

    }

    svg {
      color: #4EAD96;
    }
  }


.tabDiv::before {
    content: '';
    display: block;
    position: absolute;
    top: 0; left: 0;
    width: 70%;
    height: 100%;
    border-style: solid;
    border-color: #eee;
    border-width: 0px 0px 0px 2px;;
    border-radius: 12px 0 0 0;

    background-color: inherit;
    z-index: -1;
}
.tabDiv::after {
    content: '';
    display: block;
    position: absolute;
    top: 0; right: 0;
    width: 70%;
    height: 100%;
    border-style: solid;
    border-color: #eee;
    border-width: 0px 2px 0px 0;
    border-radius: 0 12px 0 0;

    background-color: inherit;
    z-index: -1;
}
.tabDiv.active {

    z-index: 10;
}
.tab.active::before,
.tab.active::after {
    background-color: #fff;
    border-bottom-color: #fff;
}
// .tab:not([class='active']):hover::before,
// .tab:not([class='active']):hover::after {
//     background-color: #efefef; 
// }



  div {
    padding: 0;
  }

  svg {
    color: #AFAFAF;
    cursor: pointer;
    margin: 0 -1px 0 0;
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

  .modal-header {
    border: none;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
  }

  .modal-title {
    border: none;
    padding: 0;
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-size: 24px;
    line-height: 24px;
    color: #2D453F;
    justify-content: center;
    text-align: center;
    margin-bottom: 26px;
    padding: 15px;
    cursor: pointer;

    h6 {
      font-family: 'GothamPro-Medium';
      font-style: normal;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #2D453F;
    }
  }

  .subtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #333333;
    font-style: normal;
    font-weight: normal;
    width: 97%;
    margin-left: 20px;

    h6 {
      font-family: 'GothamPro';
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 13px;
      text-align: justify;
      color: #2D453F;
      margin-top: 11px;
    }

    h5 {
      line-break: anywhere;
    }
  }

  .subtitle1 {
    border-bottom: 2px solid #E2E2E2;
    background-color: #fff;
    margin-top: 59px;
  }

  .subt {
    margin-bottom: 35px;
    margin-top: 35px;
    // margin-left: 29px !important;
    margin-left: 29px;

    div {
      font-family: 'GothamPro';
      font-style: normal;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #828282;
    }
  }

  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 0px 30px 37px 42px;
    height: 100%;
  }

  .modal-body {
    padding: 0;
  }

  // #ss-select {
  //   align-items: center;
  //   display: flex;
  //   height: 36px;
  //   border-radius: 10px;
  //   display: flex;
  //   padding: 0;
  //       width: fit-content;
  // }

  ol {
    margin-top: 30px;
    line-height: 24px;
    color: #2D453F;
    margin-bottom: 0;
    padding: 0;
    font-size: 16px;
    font-family: 'GothamPro';
    letter-spacing: 0.15px;
    color: #828282;
    margin-left: 10px;

    li {
      padding: 15px 49px 12px;
      border-radius: 9px;
      background-color: #FFF;
      margin: 0 24px 16px 0;
      align-items: flex-start;
    }
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    position: relative;

    span {
      width: fit-content;
      margin-right: 14px;
    }
  }

  .list-item {
    display: flex;
    flex-direction: column;
  }

  .desc {
    display: flex;
    flex-direction: row;
    width: fit-content;
    cursor: pointer;
    margin-right: 57px;
    font-family: 'GothamPro-Medium';
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    width: 420px;
  }

  .tasks {
    margin: -20px 0px 40px 20px;
    width: 97%;
    border-radius: 9px;
  }

  .selectResponsible {
    display: flex;
    padding-left: 10px;

    #ss-select {
      padding-left: 8px;
      align-items: center;
      display: flex;
      height: 36px;
      border-radius: 10px;
      padding-right: 0;
      width: fit-content;
    }

    select {
      margin: 0;
      width: 100%;
      background-color: #f6f6f6;
    }


  }

  .selectResponsible:hover {
    #ss-select {
      background-color: #F6F6F6;
    }
  }

  .selectResponsible:focus,
  .selectResponsible:active {
    color: #fff;
    outline: none;

    #ss-select {
      background-color: #4EAD96;
    }

    svg {
      color: #fff !important;
    }

    #iconUser {
      color: #fff;
    }
  }

  #new-problem-title {
    border: none;
    // border-bottom: 2px solid #92D2C3;
    border-radius: 6px;
    background-color: #F0F0F0;
    color: #2D453F;
    margin: 0 10px;
    font-size: 22px;
    font-family: "GothamPro-Medium";
  }


  .btn {
    padding: 0;
    border-radius: 12px;
    width: 335px;
    height: 50px;
    background: #92D2C3;
    color: #fff;
    margin: 0 auto;

    font-size: 18px;
    line-height: 17px;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'GothamPro-Medium';
  }

  @media (min-width: 576px) {
    .modal-dialog {
      max-width: inherit;
      margin: 1.75rem auto;
    }
  }

  .close {
    margin: 1rem 1rem 1rem auto;
    padding: 0;
  }


  .date {
    outline: none;
    width: 200px;
    border: none;
    position: relative;
    color: #828282;
    padding-left: 48px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-radius: 10px;
    width: 168px;
  }

  .date:hover {
    background-color: #f6f6f6;
  }

  .date:focus {
    background-color: #4EAD96;
    color: white;
  }

  .icons {
    display: flex;
    flex-direction: row;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 11px;
    color: #000000;
    text-align: center;
    cursor: pointer;

    img {
      margin: 0 10px;
    }
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendar.png') 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    color: #828282;
    position: absolute;
    top: 20%;
    left: -5%;
    // width: 100%;

  }

  input[class="date"]:focus::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendarW.png') 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    left: -5%;
    // width: 100%;
    top: 20%;
    // width: auto;
  }

  select {
    appearance: none;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    height: fit-content;
  }

  .select {
    border-radius: 10px;
    height: 36px;

    padding: 0;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    letter-spacing: 0.15px;
    color: #828282;

    option {
      background-color: #E0E0E0;
      color: #2D453F;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
      border-radius: 10px;
      outline: none;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
      border: none;
    }
  }

  .green {
    background-color: #4EAD96 !important;
    width: 180px;
    color: #fff;

    svg {
      color: #fff;
    }
  }

  .gray {
    background-color: #E0E0E0 !important;
    width: 180px;
    color: #2D453F;

    svg {
      color: #2D453F;
    }
  }

  .blue {
    background-color: #AEDAF2 !important;
    width: 180px;
    color: #fff;

    svg {
      color: #fff;
    }
  }

  .form-control {
    border-radius: 10px;
    padding: 7px 13px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    background-color: #F6F6F6;
  }

  .list-group-item {
    margin-right: 15px;
    border-radius: 7px;
    width: 100%;
    height: 60px;
    background-color: #F0F0F0;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #2D453F;
    border: none;
    margin: 6.5px 0;
    justify-content: space-between;
    display: flex;
    align-items: center;
    padding: 18px auto 18px 32px;

    &:last-child {
      margin-bottom: 43px;
    }
  }

  .addNewTask {
    display: flex;
    margin: 0 22px;
  }


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

  :focus {
    outline: none;
  }




  .modal-dialog {
    width: 1500px;
  }



  @media (max-width: 1600px) {
    .modal-dialog {
      width: 90vw;
    }
  }

  @media (max-width: 1300px) {
    * {
      font-size: 13px;
    }

    .tab .btnTab,
    .modal-title {
      font-size: 14px;
    }

    .subtitle1 {
      margin-top: 30px;
    }

    .subt div {
      // div {
      font-size: 13px;
      // }
    }
  }

  @media (max-width: 1200px) {

    // * {
    //   font-size: 13px;
    // }
    input[type="date"]::-webkit-calendar-picker-indicator {
      background: url('~@/assets/calendar.png') 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      color: #828282;
      position: absolute;
      top: -5%;
      left: -95%;
      width: 100%;
      height: 100%;
    }

    input[class="date"]:focus::-webkit-calendar-picker-indicator {
      background: url('~@/assets/calendarW.png') 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      position: absolute;
      left: -95%;
      width: 100%;
      height: 100%;
      top: -5%;
    }




    .subt {
      margin-left: 10px;

      div {
        font-size: 13px;
      }

    }

    #list {
      padding: 15px;
    }

    #select-toggle {
      padding: 0;
      font-size: 13px;
    }

    li {
      display: flex;
      flex-direction: initial;

      // .close {
      //   order: 2;
      //   width: 100%;
      // }

      // .select {
      //   order: 3;
      // }

      // .dateDiv {
      //   order: 4;
      // }

      // .selectResponsible {
      //   order: 5;
      // }

      // .list-item {
      //   order: 1;
      // }
    }

    // .list-item {
    //   flex: 0 1;
    //   max-width: initial;
    //   min-width: fit-content;
    // }

    // .desc {
    //   width: 100%;
    // }
  }

  @media (max-width: 1100px) {
    .subt div {
      // div {
      font-size: 12px;
      // }
    }
  }

  @media (max-width: 500px) {
    .tasks {
      width: 85% !important;
    }

  }
</style>