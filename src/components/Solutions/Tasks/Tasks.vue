<template>
  <div>
    <div class="header row">
      <div class="col-4">
        <span style="font-family: 'GothamPro-Medium'; color: #4f4f4f;">Задачи:</span>
      </div>
      <div class="subt col-3" style="justify-content: center;display: flex;"><span>Статус выполнения</span></div>
      <div class="subt col-2" style="display: flex;"><span style="text-align: center;">Срок
          исполнения</span></div>
      <div class="subt col-2" style="justify-content: center;display: flex;"><span>Исполнитель</span></div>
      <div style="width: 54px" class="col">
      </div>
    </div>

    <div class="container row">
      <ol>
        <li id="list" v-for="(task, idx) in tasks" :key="idx">
          <div class="task-title col-4"
            :class="[task.status == 'Выполнено' ? 'greenTitle' : task.status == 'В процессе' ? 'blueTitle' : '']">
            <div @click="onClickInput(task.id)" v-show="!editable">{{task.description}}</div>
            <input v-show="editable" class="form-control" v-model="task.description" :ref="'textarea_task' + task.id"
              @keyup.enter.prevent="event => {editTask(task.description, task.id, event)}" @focus="onFocusInput($event)"
              @blur="event => {onBlurInput(task.description, task.id, event)}" />
            <div class="hidden">
              <button class="input-btn" @mousedown="event => {editTask(task.description, task.id, event)}">
                <check-icon size="1x" class="custom-class"></check-icon>
              </button>
              <div @mousedown="event => onClear(event, task.id)">
                <button class="input-btn">
                  <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                </button>
              </div>
            </div>

          </div>

          <div class="select col-3" style="position: relative;" ref="select">
            <ss-select v-model="task.status" :options="statusesT" track-by="name" class="form-control"
              @change="changeStatusTask(task.id, task.status)" disable-by="disabled"
              :class="[task.status == 'Выполнено' ? 'green' : task.status == 'В процессе' ? 'blue' : 'gray']"
              id="ss-select" style="margin:auto; width: 87%;">
              <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                style="cursor: pointer; width: 100%;">
                <ss-select-toggle style="width: 100%; padding: 6px;" id="select-toggle">
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
              @click="onClickDate($event)" @change="changeDeadlineTask(task.deadline, task.id)" v-model="task.deadline">
          </div>

          <div class="selectResponsible col-2">
            <ss-select v-model="task.executor_id" :options="allUsersReduced" track-by="name" search-by="surname"
              @change="selectExecutorTask(task)" disable-by="disabled" id="ss-select" style="width: 100%;">
              <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                @click="onClickExecutor(selectedOption)" style="cursor: pointer; width: 100%;">
                <ss-select-toggle class="flex items-center justify-between" style="margin: auto;">
                  <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
                  {{ $get(selectedOption, 'name') ||  `${allUsersReduced.find(u => u.id == task.executor_id) ? allUsersReduced.find(u => u.id == task.executor_id).surname + ' ' 
                    + allUsersReduced.find(u => u.id == task.executor_id).name + ' ' 
                    + allUsersReduced.find(u => u.id == task.executor_id).father_name : 'Выбрать'}`}}
                </ss-select-toggle>

                <section v-show="isOpen" class="absolute border-l border-r min-w-full">
                  <div class="px-px">
                    <ss-select-search-input class="w-full px-3 py-2 search" placeholder="Впишите фамилию">
                    </ss-select-search-input>
                  </div>
                  <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id" :index="index"
                    :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.surname }} {{ option.name }} {{ option.father_name }}</ss-select-option>
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
      </ol>
    </div>
    <div>
      <div style="padding: 20px; cursor: pointer; width: fit-content;" v-if="addNotClicked"
        @click.prevent="displayInput">
        <!-- <plus-icon size="1.5x" class="custom-class" style="color: #92D2C3;">
        </plus-icon> -->
        <span style="margin-left: 16px; cursor: pointer;color: #92D2C3;font-family: 'GothamPro-Medium';font-size: 14px;
line-height: 24px;letter-spacing: 0.15px;">+ Добавить задачу</span>
      </div>

      <div v-else class="inputAdd" style="padding: 0 14px;">
        <div style="display: flex; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
          <input type="text" placeholder="Добавить задачу" ref="addTaskInput" class="addTask" @input="enableAddBtn"
            @keyup.enter="addTask" v-model="formInput.taskName">

          <div class="selectsInputAdd">
            <div class="dateDiv">
              <input type="date" id="start" name="trip-start" class="date" onkeypress="return false"
                v-model="formInput.deadline">
            </div>

            <div class="selectResponsible" style="background-color: #fff;">
              <ss-select v-model="formInput.executor" :options="allUsersReduced" track-by="name" search-by="name"
                disable-by="disabled" id="ss-select" style="width: fit-content; position: relative;">
                <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                  style="cursor: pointer; width: 100%;">

                  <ss-select-toggle class="pl-1 pr-4 py-0 flex items-center justify-between"
                    style="width: 100%; padding: 13px; font-family: 'GothamPro';" id="select-toggle">
                    <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
                    {{ $get(selectedOption, 'name') ||  `${allUsersReduced.find(u => u.id == formInput.executor) ? allUsersReduced.find(u => u.id == formInput.executor).surname + ' ' 
                    + allUsersReduced.find(u => u.id == formInput.executor).name + ' ' 
                    + allUsersReduced.find(u => u.id == formInput.executor).father_name : 'Выбрать'}`}}
                  </ss-select-toggle>

                  <section v-show="isOpen" class="absolute border-l border-r min-w-full"
                    style="top: 126%; right: -25%; width: fit-content;">
                    <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id" :index="index"
                      :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.surname }} {{ option.name }} {{ option.father_name }}</ss-select-option>
                  </section>
                </div>
              </ss-select>
            </div>
          </div>
        </div>
        <div class="error" v-if="error">{{error.description}}</div>
        <div class="error" v-if="error">{{error}}</div>
      </div>


      <div type="submit" class="btnsAddTask" v-if="!addNotClicked">
        <button id="addBtn" class="btn btnPink" @click.prevent="addTask" :disabled="!enableAddBtntn">Добавить
          задачу</button>
        <span @click.prevent="addNotClicked = true">Отменить</span>
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
    CheckIcon,
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
    SsSelectSearchInput
  } from 'ss-select'


  export default {
    name: 'tasks',
    props: ['val'],
    data: () => ({
      openDeleteTask: false,
      editable: false,
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
      CheckIcon,
      TrashIcon,
      ChevronDownIcon,

      DeleteTask,
      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      SsSelectSearchInput
    },

    computed: {
      ...mapGetters(['tasks', 'error', 'error404', 'allUsers', 'allUsersReduced', 'currentSolution', 'solutions']),
    },

    methods: {
      displayInput() {
        this.addNotClicked = false
        this.formInput = []
        this.$store.commit('setError', '')
        this.$nextTick(() => {
          this.$refs['addTaskInput'].focus()
        })
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
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('changeStatusTask', {
          status: status.name,
          id
        })
      },

      onClickDate(event) {
        this.currentDate = event.target.value
        this.currentDateInput = event.target
      },
      async changeDeadlineTask(deadline, id) {
        await this.$store.commit('setError404', '')
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


      // onFocusInput(event) {
      //   this.currentTaskName = event.target.value
      //   this.currentTaskInput = event.target
      // },
      // onKey(event) {
      //   event.target.blur()
      // },
      onClickInput(id) {
        this.editable = true
        this.$nextTick(() => {
          this.$refs['textarea_task' + id][0].focus()
        })
      },

      async onBlurInput(name, id, event) {
        this.editable = false
        event.path[0].nextElementSibling.classList.remove('flex')
        // this.$store.commit('editTask', {
        //   description: this.currentTaskName,
        //   id
        // })
        if (name !== this.currentTaskName) {
          await this.$store.commit('setError404', '')
          await this.$store.dispatch('editTask', {
            description: name,
            id: id
          }).catch(() => {
            this.$store.commit('editTask', {
              description: this.currentTaskName,
              id
            })
          })
        }

      },
      onFocusInput(event) {
        this.currentTaskName = event.target.value
        this.currentTaskInput = event.target

        // console.log(this.currentTaskName, this.currentTaskInput);
        event.path[0].nextElementSibling.classList.add('flex')
      },

      onClear(event, id) {
        event.preventDefault()
        this.$refs['textarea_task' + id][0].value = this.currentTaskName
      },

      editTask(task, id) {
        console.log(task, id);
        // if (task.description !== this.currentTaskName) {
        //   await this.$store.commit('setError404', '')
        //   await this.$store.dispatch('editTask', {
        //     description: task,
        //     id: id
        //   }).catch(() => {
        //     this.$store.commit('editTask', {
        //       description: this.currentTaskName,
        //       id: task.id
        //     })
        //   })
        // }
        this.currentTaskInput.blur()
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
    border-left: 4px solid #fff;
    border-right: 4px solid #fff;
  }

  .input-btn {
    border: none;
    width: auto;
    height: 32px;
    margin-left: 8px;
    background-color: #e2e2e2;
    border-radius: 8px;

    svg {
      color: #4F4F4F;
      vertical-align: text-top;
    }
  }

  .hidden {
    display: flex;
    visibility: hidden;
    flex-direction: row;
  }

  .flex {
    display: flex;
    visibility: visible;
  }

  #closeIcon {
    transform: rotate(45deg);
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
    // padding-top: 30px;
    align-items: center;
    max-width: inherit;
    width: -webkit-fill-available;
    padding-left: 26px;
    font-style: normal;
    font-weight: normal;
    background-color: #fff;

    div {
      font-family: 'GothamPro';
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #828282;
      font-size: 14px;
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
    background-color: #fff;

    ol {
      // max-height: 300px;
      max-height: 182px;
      // min-height: 189px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }

  ol {
    padding: 0;
    padding-left: 26px;
    width: 100%;
    // padding-right: 42px;
    margin-bottom: 0;
  }

  li {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    padding-top: 18px;
    padding-left: 10px;
    border-bottom: 1px solid #DEDEDE;
    border-left: 2px solid #DEDEDE;
  }

  li:last-child {
    border-bottom: none;
  }

  div {
    padding: 0 2px;
  }

  svg {
    color: #4F4F4F;
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

  #list .selectResponsible:hover~#close {
    display: none !important;
  }

  .selectResponsible {
    display: flex;
    padding-left: 10px;

    #ss-select {
      padding-left: 8px;
      align-items: center;
      display: flex;
      // height: 36px;
      border-radius: 10px;
      text-align: center;
      padding-right: 0;
      width: fit-content;

      overflow: hidden;
      height: 30px;
    }

    #ss-select:hover {
      overflow: visible;
      width: fit-content;
      background-color: #e5e9f1;

      >div {
        max-height: 27px;
        min-width: max-content;
      }
    }

    select {
      margin: 0;
      width: 142px;
      background-color: #f6f6f6;
    }

    section {
      right: -32%;
    }
  }


  .search {
    outline: none;
    border: none;
    background-color: #F7F7F7;
    border-radius: 8px;
  }

  .cursor-pointer {
    border-radius: 8px;
  }


  .selectResponsible:focus,
  .selectResponsible:active {
    color: #fff;
    outline: none;
    max-height: 27px;
    min-width: max-content;

    #ss-select {
      background-color: #4EAD96;
      overflow: visible;
      width: fit-content;
    }

    svg {
      color: #fff !important;
    }

    #iconUser {
      color: #fff;
    }
  }



  .subt1 {
    flex: 0 0 42.666667%;
    max-width: 42.666667%;
  }

  .date {
    // width: 200px;
    // margin-left: -17px;
    border: none;
    position: relative;
    height: 81%;
    color: #828282;
    padding-left: 28px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-radius: 10px;
    // width: 168px;
    width: 100%;
    background-color: #fff;
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
    background: url('~@/assets/calendar.png');
    background-size: 80%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    left: -15%;
    top: 25%;
  }

  input[class="date"]:focus::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendarW.png');
    background-size: 80%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    left: -15%;
    top: 25%;
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
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;

    #select-toggle {
      color: #fff !important;
      font-family: 'GothamPro-Medium' !important;
    }

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
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;

    #select-toggle {
      color: #fff !important;
      font-family: 'GothamPro-Medium' !important;
    }

    svg {
      color: #fff;
    }

  }

  .task-title {
    display: flex;
    font-size: 16px;
    line-height: 24px;
    font-family: 'GothamPro';
    letter-spacing: 0.15px;
    position: relative;

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

  .inputAdd {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .addTask {
    border: none;
    background-color: #fff;
    color: #828282;
    // margin-left: -16px;
    outline: none;


    border-radius: 9px 0 0 9px;
    padding: 10px 0 10px 50px;
    color: #4F4F4F;
    caret-color: #4EAD96;
    width: 42%;
    border-right: 1px solid #EEEEEE;
  }

  .selectsInputAdd {
    background-color: #fff;
    outline: none;
    display: flex;
    justify-content: space-evenly;

    border-radius: 0 9px 9px 0;
    padding: 10px 0 10px 56px;
    width: 58%;
    align-items: flex-start;
  }


  .btnsAddTask {
    padding-left: 50px;
    // background-color: #F6F7F9;
    width: 100%;
    padding-top: 19px;
    cursor: default;

    span {
      font-family: 'GothamPro';
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #4F4F4F;
      padding-bottom: 3px;
      cursor: pointer;
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
    cursor: pointer;
  }

  .btnPink {
    background: #ffbdbd;
  }

  .btnGren {
    background: #92D2C3;
  }

  #close {
    display: flex;
    justify-content: center;
  }

  #select-toggle {
    font-family: 'GothamPro';
    margin: auto;
    text-align: center;
    color: #4F4F4F;
  }




  @media (max-width: 1500px) {


    // .selectsInputAdd {
    //   padding-left: 60px;
    // }
  }

  @media (max-width: 1300px) {
    * {
      font-size: 13px !important;
    }

    .header {
      div {
        font-size: 12px !important;
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
      background: url('~@/assets/calendar.png');
      background-size: 80%;
      background-repeat: no-repeat;
      cursor: pointer;
      color: #828282;
      position: absolute;
      top: -5%;
      left: -95%;
      // width: 100%;
      // height: 100%;
    }

    input[class="date"]:focus::-webkit-calendar-picker-indicator {
      background: url('~@/assets/calendarW.png');
      background-size: 80%;
      background-repeat: no-repeat;
      cursor: pointer;
      position: absolute;
      left: -95%;
      // width: 100%;
      // height: 100%;
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