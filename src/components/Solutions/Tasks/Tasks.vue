<template>
  <div>
    <div class="header row">
      <div class="col-5" style="margin-right: -15px;margin-left: 20px">
        <img src="@/assets/tasks.png">
        Задачи:
      </div>
      <div class="subt col-2">Статус выполнения</div>
      <div class="subt col-2">Срок исполнения</div>
      <div class="subt col-2">Исполнитель</div>
      <div style="width: 54px" class="col">
      </div>
    </div>

    <div class="container row">
      <ol>
        <li id="list" v-for="(task, idx) in tasks" :key="idx">
          <div class="task-title col-5"
            :class="[task.status == 'Выполнено' ? 'greenTitle' : task.status == 'В процессе' ? 'blueTitle' : '']">
            <input class="form-control" @focus="onFocusInput($event)" @keyup.enter="event => onKey(event)"
              @blur="event => editTask(task, event)" v-model="task.description">
          </div>

          <div class="select col-2" style="position: relative;" ref="select">
            <ss-select v-model="task.status" :options="statusesT" track-by="name" search-by="name" class="form-control"
              @change="changeStatusTask(task.id, task.status)" disable-by="disabled"
              :class="[task.status == 'Выполнено' ? 'green' : task.status == 'В процессе' ? 'blue' : 'gray']"
              id="ss-select" style="width: fit-content;">
              <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                style="cursor: pointer; width: 100%;">
                <ss-select-toggle style="width: 100%; padding: 13px;" id="select-toggle">
                  {{ $get(selectedOption, 'name') || `${task.status}`}}
                  <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
                </ss-select-toggle>

                <section v-show="isOpen" class="absolute border-l border-r min-w-full" style="height: auto;">
                  <ss-select-option v-for="(option, index) in filteredOptions" :value="option" :index="index"
                    :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                    pointerIndex == index ? 'bg-light text-dark' : '',
                    $selected(option) ? 'bg-light text-dark' : '',
                    $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                  ]">{{ option.name }}</ss-select-option>
                </section>
              </div>
            </ss-select>
          </div>

          <div class="dateDiv col-2">
            <input type="date" id="start" name="trip-start" class="date" onkeypress="return false"
              @click="onClickDate($event)" @change="event => {changeDeadlineTask(task.deadline, task.id), event}"
              v-model="task.deadline">
          </div>

          <div class="selectResponsible col-2">
            <ss-select v-model="task.executor_id" :options="allUsers" track-by="name" search-by="name"
              @change="selectExecutorTask(task)" disable-by="disabled" id="ss-select"
              style="width: fit-content;">
              <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                @click="onClickExecutor(selectedOption)" style="cursor: pointer; width: 100%;">
                <ss-select-toggle class="pl-1 pr-4 py-1 flex items-center justify-between"
                  style="width: 100%; padding: 13px;">
                  <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
                  {{ $get(selectedOption, 'name') ||  `${allUsers.find(u => u.id == task.executor_id) ? allUsers.find(u => u.id == task.executor_id).name : 'Выбрать'}`}}
                </ss-select-toggle>

                <section v-show="isOpen" class="absolute border-l border-r min-w-full">
                  <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id" :index="index"
                    :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
                </section>
              </div>
            </ss-select>
          </div>

          <div style="width: 54px" id="close" class="col">
            <button type="button" class="close" id="remove" style="margin: auto;" @click="showDelete(task.id)"
              data-toggle="modal" data-target="#popupDeleteSolution">
              <trash-icon size="1x" class="custom-class"></trash-icon>
            </button>
          </div>
        </li>

        <li>
          <div v-if="addNotClicked">
            <plus-icon size="1.5x" class="custom-class" id="plus" @click.prevent="displayInput" style="color: #92D2C3;">
            </plus-icon>
            <span @click.prevent="displayInput" style="margin-left: 16px; cursor: pointer;">Добавить задачу</span>
          </div>

          <div v-else class="inputAdd">
            <div style="display: flex;">
              <input type="text" placeholder="Добавить задачу" class="addTask" @input="enableAddBtn" @keyup.enter="addTask"
                v-model="formInput.taskName">

              <div class="selectsInputAdd">
                <div class="dateDiv">
                  <input type="date" id="start" name="trip-start" class="date" onkeypress="return false"
                    v-model="formInput.deadline">
                </div>

                <div class="selectResponsible" style="background-color: #fff;">
                  <ss-select v-model="formInput.executor" :options="allUsers" track-by="name" search-by="name"
                    disable-by="disabled" id="ss-select" style="width: fit-content;">
                    <div
                      slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                      style="cursor: pointer; width: 100%;">

                      <ss-select-toggle class="pl-1 pr-4 py-1 flex items-center justify-between"
                        style="width: 100%; padding: 13px;" id="select-toggle">
                        <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
                        {{ $get(selectedOption, 'name') ||  `${allUsers.find(u => u.id == formInput.executor) ? allUsers.find(u => u.id == formInput.executor).surname + ' ' + allUsers.find(u => u.id == formInput.executor).name[0] + '.': 'Выбрать'}`}}
                      </ss-select-toggle>

                      <section v-show="isOpen" class="absolute border-l border-r min-w-full"
                        style="position: relative; width: 368px;">
                        <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id" :index="index"
                          :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.surname }} {{option.name[0]}}.</ss-select-option>
                      </section>
                    </div>
                  </ss-select>
                </div>
              </div>
            </div>
            <div class="error" v-if="error">{{error.description}}</div>
            <div class="error" v-if="error">{{error}}</div>
          </div>
        </li>
      </ol>

      <div type="submit" class="btnsAddTask" v-if="!addNotClicked">
        <button id="addBtn" class="btn btnPink" @click.prevent="addTask" :disabled="!enableAddBtntn">Добавить задачу</button>
        <span @click.prevent="addNotClicked = true">Отмена</span>
      </div>
    </div>

    <DeleteTask v-if="openDeleteTask" :openDeleteTask="openDeleteTask" @closeDeleteTask="closeDeleteTask($event)"
      :val="taskIdDelete" />
  </div>
</template>

<script>
  import {
    UserIcon,
    PlusIcon,
    TrashIcon,
    ChevronDownIcon
  } from 'vue-feather-icons'
  import DeleteTask from './DeleteTask'
  import {
    mapGetters
  } from 'vuex'
  import {
    SsSelect,
    SsSelectToggle,
    SsSelectOption,
  } from 'ss-select'
  // SsSelectSearchInput

  export default {
    name: 'tasks',
    props: ['val'],
    data: () => ({
      openDeleteTask: false,


      addNotClicked: true,
      enableAddBtntn: false,
      inputActive: false,

      taskName: '',
      taskIdDelete: '',

      statusesT: [{
          name: "К исполнению"
        },
        {
          name: "В процессе"
        },
        {
          name: "Выполнено"
        }
      ],

      currentExecutor: '',
      currentTaskName: '',
      currentTaskInput: '',
      currentDate: '',
      currentDateInput: '',

      formInput: []
    }),
    components: {
      UserIcon,
      PlusIcon,
      TrashIcon,
      ChevronDownIcon,

      DeleteTask,
      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      // SsSelectSearchInput
    },

    computed: {
      ...mapGetters(['tasks', 'error', 'error404', 'allUsers', 'currentSolution', 'solutions']),
    },
    watch: {
      val: function (data) {
        console.log(data);
        // ??
      }
    },
    methods: {
      displayInput() {
        this.addNotClicked = false
        this.formInput = []
        this.$store.commit('setError', '')
      },

      enableAddBtn() {
        this.enableAddBtntn = true
        document.getElementById('addBtn').classList.remove('btnPink')
        document.getElementById('addBtn').classList.add('btnGren')
      },

      async addTask() {
        let solutionId = this.solutions[0].id
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('postTask', {
          solutionId: solutionId,
          params: this.formInput
        }).then(() => {
          if (!this.error) {
            this.formInput = []
            this.addNotClicked = true
          }
        })
      },

      async changeStatusTask(id, status) {
        await this.$store.dispatch('changeStatusTask', {
          status: status.name,
          id
        })
      },

      onClickDate(event) {
        this.currentDate = event.target.value
        this.currentDateInput = event.target
      },
      async changeDeadlineTask(deadline, id, event) {
        await this.$store.commit('setError404', '')
        console.log(event);
        await this.$store.dispatch('changeDeadlineTask', {
          deadline,
          id
        }).catch(() => {
          this.$store.dispatch('changeDeadlineTask', {
            description: this.currentDate,
            id
          })
        })
      },

      onClickExecutor(sol) {
        this.currentExecutor = sol
      },
      async selectExecutorTask(task) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('checkIfOk', {
          description: task.description,
          executor_id: task.executor_id,
          id: task.id
        }).then(() => {
          this.$store.dispatch('changeExecutorTask', {
            id: task.id,
            uid: task.executor_id
          })
        }).catch(() => {
          this.$store.commit('editExecutorTask', {
            id: task.id,
            executor_id: this.currentExecutor
          })
        })
      },

      onFocusInput(event) {
        this.currentTaskName = event.target.value
        this.currentTaskInput = event.target
        console.log(this.currentTaskName);
        console.log(this.currentTaskInput);
      },
      onKey(event) {
        event.target.blur()
      },
      async editTask(task, event) {
        console.log(event);
        if (task.description !== this.currentTaskName) {
          await this.$store.commit('setError404', '')
          await this.$store.dispatch('editTask', {
              description: task.description,
              id: task.id
          }).catch((e) => {
            console.log(e);
            console.log(this.currentTaskName);
            this.$store.commit('editTask', {
              description: this.currentTaskName,
              id: task.id
            })
          })
        }
      },

      showDelete(id) {
        this.$store.commit('setError404', '')
        this.openDeleteTask = true
        this.taskIdDelete = id
      },
      closeDeleteTask() {
        this.openDeleteTask = false
      },
    }
  }
</script>

<style scoped lang="scss">
  .subt1 {
    flex: 0 0 42.666667%;
    max-width: 42.666667%;
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

  .form-control {
    padding: 7px 13px;
  }

  .header {
    margin: 0;
    padding-top: 30px;
    max-width: inherit;
    width: -webkit-fill-available;
    padding-left: 26px;
    font-style: normal;
    font-weight: normal;
    background-color: #F6F7F9;

    div {
      font-family: 'GothamPro';
      font-style: normal;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #828282;
    }
  }

  .container {
    margin: 0;
    padding-top: 12px;
    max-width: inherit;
    width: -webkit-fill-available;
    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    font-style: normal;
    font-weight: normal;
    background-color: #F6F7F9;
  }

  ol {
    padding: 0;
    padding-left: 60px;
    width: 100%;
    padding-right: 42px;
    margin-bottom: 0;
  }

  li {
    display: flex;
    align-items: center;
    padding-bottom: 18px;
    padding-top: 18px;
    border-bottom: 1px solid #DEDEDE;
  }

  li:last-child {
    border-bottom: none;
  }

  div {
    padding: 0;
  }

  svg {
    color: #AFAFAF;
    cursor: pointer;
    margin: 0 -1px 0 0;
  }



  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 36px 30px 37px 62px;
  }

  .modal-body {
    padding: 0;
  }



  // option {
  //   background-color: #F6F6F6;
  //   color: #2D453F;
  //   font-size: 18px;
  //   line-height: 24px;
  //   letter-spacing: 0.15px;
  //   border-radius: 10px;
  //   font-size: 18px;
  //   line-height: 24px;
  //   letter-spacing: 0.15px;
  // }

  .selectResponsible {
    display: flex;
    background-color: #F6F6F6;
    padding-left: 10px;


    #ss-select {
      padding-left: 8px;
      align-items: center;
      display: flex;
      height: 36px;
      background-color: #F6F7F9;
      border-radius: 10px;
      text-align: center;
      padding-right: 0;
      width: fit-content;
    }

    select {
      margin: 0;
      width: 142px;
      background-color: #f6f6f6;
    }
  }

  .selectResponsible:hover {
    #ss-select {
      background-color: #e5e9f1;
    }
  }

  .selectResponsible:focus,
  .selectResponsible:active {
    color: #fff;

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



  .date {
    width: 200px;
    border: none;
    position: relative;
    height: 81%;
    color: #828282;
    padding-left: 48px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-radius: 10px;
    width: 168px;
    background-color: #F6F7F9;
  }

  .date:hover {
    background-color: #e5e9f1;
  }

  .date:focus {
    background-color: #4EAD96;
    color: white;
    outline: none;
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

  input[class="date"]::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendar.png') 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    left: -95%;
    width: 100%;
    top: 20%;
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
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    height: fit-content;
    border-radius: 10px;
  }

  .select {
    border-radius: 10px;
    height: 36px;
    width: 166px;
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
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
    }
  }

  #ss-select {
    border-radius: 10px;
    padding: 0;
    width: fit-content;
    align-items: center;
    display: flex;

  }

  .green {
    background-color: #4EAD96 !important;
    width: 180px;
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    font-family: 'GothamPro-Medium' !important;
    letter-spacing: 0.15px;

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
    font-size: 16px;
    line-height: 24px;
    font-family: 'GothamPro-Medium' !important;
    letter-spacing: 0.15px;

    svg {
      color: #fff;
    }

  }

  .task-title {
    display: flex;
    font-size: 16px;
    line-height: 24px;
    font-family: 'GothamPro-Medium';
    letter-spacing: 0.15px;


    input {
      padding: 6px;
      border-radius: 10px;
      width: fit-content;
      background-color: #F6F6F6;
    }

    input:hover {
      cursor: pointer;
    }

    input:focus,
    input:active {
      background-color: #fff;
    }
  }


  .task-title::before {
    content: '';
    position: relative;
    top: 14px;
    right: 2%;
    display: inline-block;
    width: 8px;
    height: 8px;
    -moz-border-radius: 7.5px;
    -webkit-border-radius: 7.5px;
    border-radius: 7.5px;
    background-color: #BDBDBD;

  }

  .greenTitle::before {
    background-color: #4EAD96;
  }

  .blueTitle::before {
    background-color: #AEDAF2;
  }

  .inputAdd {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .addTask {
    border: none;
    background-color: #fff;
    color: #828282;
    margin-left: -16px;
    outline: none;

    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 9px 0 0 9px;
    padding: 10px 0 10px 50px;
    color: #4F4F4F;
    caret-color: #4EAD96;
    width: 43%;
    border-right: 1px solid #EEEEEE;
  }

  .selectsInputAdd {
    background-color: #fff;
    outline: none;
    display: flex;
    justify-content: space-evenly;
    box-shadow: 9px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0 9px 9px 0;
    padding: 10px 0 10px 153px;
    width: 57%;
    align-items: flex-start;
  }


  .btnsAddTask {
    padding-left: 50px;
    background-color: #fff;
    width: 100%;
    padding-top: 19px;

    span {
      font-family: 'GothamPro';
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #4F4F4F;
      padding-bottom: 3px;
    }

    span:hover {
      border-bottom: 1px solid #000;
    }
  }

  .btn {
    margin-right: 17px;
    border-radius: 9px;
    width: 182px;
    padding: 11px 18px;

    font-family: 'GothamPro-Medium';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #FFFFFF;
  }

  .btnPink {
    background: #FFD3D3;
  }

  .btnGren {
    background: #92D2C3;
  }





  @media (max-width: 1400px) {
    #select-toggle {
      font-size: 14px;
    }

    .selectsInputAdd {
      padding-left: 60px;
    }
  }

  @media (max-width: 1300px) {
    * {
      font-size: 13px;
    }

    .header {
      div {
        font-size: 12px;
      }

    }

  }

  @media (max-width: 1200px) {



    #list {
      display: flex;
      flex-direction: initial;
      font-size: 13px;
      // flex-wrap: wrap;
      // justify-content: space-between;

      // div {
      //   margin-bottom: 30px;
      // }

      // #close {
      //   order: 2;

      //   margin-left: -48px;

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

      .task-title {
        font-size: 13px;
        //   order: 1;
        //   margin-right: 109px;
      }
    }

    // .task-title {
    //   flex: 0 1;
    //   min-width: fit-content;
    // }

    // .selectsInputAdd {
    //   display: none;
    // }
    #select-toggle {
      // padding: 0;
      padding: 3px !important;
      font-size: 13px;
    }

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

    ol {
      padding-left: 31px;
      padding-right: 6px;
    }

    .header {
      padding-left: 0;
    }

    .selectsInputAdd {
      // border-radius: 9px;
      // width: 100%;
      // padding: 0;
      padding-left: 0;
      padding-right: 0;
      justify-content: space-evenly;
    }
  }



  @media (max-width: 500px) {
    .header {
      display: none;
    }

    .task-title,
    .select,
    .selectResponsible,
    .date {
      margin-right: 0 !important;
      margin-left: 0 !important;
    }

    button {
      width: 85%;
    }

    .subtitle {
      width: 85%;
    }
  }
</style>