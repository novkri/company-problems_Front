<template>
  <div>

    <div class="popup-show">
      <div id="popupShow" class="modal fade" role="dialog" style="padding: 0 !important; overflow: hidden;">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="width: 90vw" role="document">
          <div class="modal-content">
            <div class="modal-header tab">
              <div class="tabDiv" :class="[openShow ? 'active' : '']" @click="toggleTab">
                <eye-icon size="1.5x" class="custom-class"></eye-icon>
                <button class="btn btnTab">Просмотр проблемы</button>
              </div>
              <div class="tabDiv" :class="[openShow ? '' : 'active']" @click="toggleTab">
                <img src="@/assets/tasks.png">
                <button class="btn btnTab">Добавить решение</button>
              </div>

            </div>

            <!-- <div v-if="openShow"> -->
            <div class="modal-header" v-if="openShow">
              <div style="width: 100%;">
                <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div class="subtitle subtitle1">
                <h5 class="modal-title">{{val.name}}</h5>
                <!-- <h6 v-if="progress !== ''">Прогресс решения {{progress}}%</h6>
                <h6 v-else>Прогресс решения 0%</h6>
                <div class="icons">
                  <img src="~@/assets/star.png">
                  <span>95</span>
                </div> -->
              </div>
            </div>
            <div class="modal-header" style="width: 130%;" v-else>
              <button type="button" id="close" class="close" @click="closeSolutions" data-dismiss="modal"
                data-target="#popupSol">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body" v-if="openShow">
              <!-- <div class="subtitle subtitle1" >
                <h5 class="modal-title">{{val.name}}</h5> -->
              <!-- <h6 v-if="progress !== ''">Прогресс решения {{progress}}%</h6>
                <h6 v-else>Прогресс решения 0%</h6>
                <div class="icons">
                  <img src="~@/assets/star.png">
                  <span>95</span>
                </div> -->
              <!-- </div> -->

              <div>
                <div class="subtitle row subt">
                  <div class="col-5">
                    Решения в работе:
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
                        <!-- <select v-model="solution.status" class="form-control"
                          :class="[solution.status == 'Выполнено' ? 'green' : solution.status == 'К исполнению' ? 'blue' : 'gray']"
                          @change="changeStatus(solution.id, solution.status)">
                          <option value="В процессе">
                            В процессе</option>
                          <option value="Выполнено">
                            Выполнено</option>
           
                        </select> -->
                        <ss-select v-model="solution.status" :options="statuses" track-by="name" search-by="name"
                          class="form-control" @change="changeStatus(solution.id, solution.status)"
                          disable-by="disabled" :class="[solution.status == 'Выполнено' ? 'green' : 'gray']"
                          id="ss-select">
                          <div
                            slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }">
                            <ss-select-toggle>
                              {{ $get(selectedOption, 'name') || `${solution.status ? solution.status : 'Выбрать'}`}}

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
                        <ss-select v-model="solution.executor_id" :options="allUsers" track-by="name" search-by="name"
                          @change="selectExecutor(solution.id, solution.executor_id)" disable-by="disabled"
                          id="ss-select">
                          <div
                            slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }">
                            <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
                            <ss-select-toggle class="px-3 py-1 flex items-center justify-between">
                              {{ $get(selectedOption, 'name') || `${allUsers.find(u => u.id == solution.executor_id) ? allUsers.find(u => u.id == solution.executor_id).name : 'Выбрать'}`}}

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
                        <button type="button" class="close" id="remove" style="margin: auto;"
                          @click="removeFromWork(solution)" data-toggle="modal" data-target="#popupRemoveFromWOrk">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>

                    </li>
                  </ol>
                </div>

                <div class="tasks" v-if="currentSolution">
                  <Tasks :val="solutions" />
                </div>

                <button type="button" class="btn btnMain" @click="showSolutions(val)" data-toggle="modal"
                  data-target="#popupSol" data-dismiss="modal"><span>Посмотреть/Добавить решение</span></button>
              </div>
            </div>
            <Solutions v-if="!openShow" :openS="openSolutions" @closeSolutions="closeSolutions($event)" :val="val" />
            <!-- </div> -->

            <!-- <Solutions v-if="!openShow" :openS="openSolutions" @closeSolutions="closeSolutions($event)" :val="val" /> -->
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
  import {
    UserIcon,
    EyeIcon
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
    props: ['open', 'val'],
    data: () => ({
      openShow: true,
      openSolutions: false,
      showTasks: false,
      solutionName: '',
      progress: '',
      openRemoveFromWork: false,
      solutionIdRemove: '',
      btnRemove: false,
      openDeleteTask: false,
      taskIdDelete: '',
      selected: false,

      obj: '',

      statuses: [{
          name: "В процессе"
        },
        {
          name: "Выполнено"
        }
      ]
    }),
    components: {
      UserIcon,
      EyeIcon,


      Solutions,
      RemoveFromWork,
      Tasks,
      DeleteTask,

      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      // SsSelectSearchInput
    },
    // async mounted() {
    //   await this.$store.dispatch('getTasks', this.solutions[0].id)
    //   console.log(this.solutions[0].id);

    //   //передавать айди решения
    // },

    computed: {
      ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404', 'allUsers', 'currentSolution']),
    },
    methods: {
      toggleTab() {
        this.openShow = !this.openShow
        // event.target.classList.add('active')
        // event.target.previousSibling.classList.remove('active')
        console.log(event);
      },
      async selectExecutor(id, uid) {
        await this.$store.dispatch('changeExecutor', {
          id,
          uid
        })
      },
      async changeStatus(id, status) {
        console.log(id, status);
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


      showSolutions() {
        this.openSolutions = true
      },
      closeSolutions() {
        this.openSolutions = false
      },

      async removeFromWork(obj) {
        this.solutionIdRemove = obj.id
        this.openRemoveFromWork = true
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
    background-color: #F2F2F2;
    // width: fit-content;
    border-radius: 12px;
    margin-left: -42px;
    width: 42%;

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
    // width: 339px;
        width: 50%;
    align-items: center;
    justify-content: center;

    img {
      height: fit-content;
      cursor: pointer;
    }
    // svg {}
  }

  .active {
    background-color: #fff;
border-radius: 12px 12px 0 0px;
    // border-radius: 12px 12px 0 12px;
    .btnTab {
      background-color: #fff;
      color: #4EAD96;
      font-family: 'GothamPro-Medium';
    }
    svg {
      color: #4EAD96;
    }
  }

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
    // margin-bottom: 35px;
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
  }

  .subt {
    margin-bottom: 35px;
    margin-top: 35px;
    margin-left: 29px !important;
  }

  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 0px 30px 37px 42px;
  }

  .modal-body {
    padding: 0;
  }

  #ss-select {
    // padding-left: 8px;
    // width: 128px;
    align-items: center;
    display: flex;
    height: 36px;
    // background-color: #F6F6F6;
    border-radius: 10px;
    display: flex;
  }

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
    // margin-right: -10px;

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
    // margin: -20px 0px 40px 13px;
    width: 97%;
    border-radius: 9px;
  }

  .selectResponsible {
    display: flex;

    // margin: 0 10px;
    // margin-right: 84px;

    padding-left: 10px;
    // padding-bottom: 5px;
    // padding-top: 5px;


    #ss-select {
      padding-left: 8px;
      // width: 128px;
      align-items: center;
      display: flex;
      height: 36px;
      // background-color: #F6F6F6;
      border-radius: 10px;
    }

    select {
      // background: url('~@/assets/Select.png') no-repeat;
      // background-position: right 0.5em top 46%, 0 0;
      margin: 0;
      width: 100%;
      background-color: #f6f6f6;
    }


  }

  .selectResponsible:hover {
    // background-color: #E5E9F1;

    #ss-select {
      // background-color: #E5E9F1;
      background-color: #F6F6F6;
    }
  }

  .selectResponsible:focus,
  .selectResponsible:active {
    // background-color: #4EAD96;
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
    margin: -1rem 0rem 1rem auto;
    padding: 0;
  }


  .date {
    outline: none;
    width: 200px;
    border: none;
    position: relative;
    color: #828282;
    // background-color: #F6F6F6;
    padding-left: 48px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-radius: 10px;
    width: 168px;
    // background-color: #f6f6f6;
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
    left: -95%;
    width: 100%;
  }

  input[class="date"]:focus::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendarW.png') 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    left: -95%;
    width: 100%;
    top: 20%;
  }

  select {
    appearance: none;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    height: fit-content;
    // margin-right: 30px;
    // width: 156px;
  }

  .select {
    // width: 156px;
    border-radius: 10px;
    height: 36px;

    padding: 0;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    // margin-right: 30px;
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
    background: url('~@/assets/SelectWhite.png') no-repeat;
    background-position: right 0.6em top 46%, 0 0;
    color: #fff;
  }

  .gray {
    background-color: #E0E0E0 !important;
    width: 180px;
    background: url('~@/assets/Select.png') no-repeat;
    background-position: right 0.6em top 46%, 0 0;
    color: #2D453F;
  }

  .blue {
    background-color: #AEDAF2 !important;
    width: 180px;
    background: url('~@/assets/SelectWhite.png') no-repeat;
    background-position: right 0.6em top 50%, 0 0;
    color: #fff;
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

  section {
    // box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: 22px;
    width: 250px;
    // position: relative;
    position: absolute;
    max-height: 257px;
    // right: 4%;
    // ?????????
    right: -19%;
    top: 102%;

    border-radius: 10px;
    box-shadow: 0px 4px 16px rgba(54, 44, 117, 0.08);
    background-color: white;
    color: #828282;
    height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 100;
  }

  .stf-select_opened .stf-select__options {
    z-index: 100000000000000 !important;
  }







  @media (max-width: 1200px) {
    .subt {
      display: none;
    }

    li {
      display: flex;
      flex-direction: initial;


      div {
        margin-bottom: 20px;
      }

      .close {
        order: 2;
        width: 100%;
      }

      .select {
        order: 3;
      }

      .dateDiv {
        order: 4;
      }

      .selectResponsible {
        order: 5;
      }

      .list-item {
        order: 1;
      }
    }

    .list-item {
      flex: 0 1;
      max-width: initial;
      min-width: fit-content;
    }

    .desc {
      width: 100%;
    }
  }

  @media (max-width: 500px) {
    .tasks {
      width: 85% !important;
    }

  }
</style>