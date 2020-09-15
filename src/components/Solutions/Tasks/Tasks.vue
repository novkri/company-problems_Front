<template>
  <div>
    <div class="header row">
      <div class="col-5">
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
            :class="[task.status == 'Выполнено' ? 'greenTitle' : task.status == 'К исполнению' ? 'blueTitle' : '']">
            <input class="form-control" @keyup.enter="editTask(task.description, task.id)"
              @blur="editTask(task.description, task.id)" v-model="task.description">

          </div>
          <div class="select col-2" style="position: relative;" ref="select">
            <select class="form-control" v-model="task.status" @change="changeStatusTask(task.status, task.id)"
              :class="[task.status == 'Выполнено' ? 'green' :  task.status == 'К исполнению' ? 'blue' : 'gray']">
              <option value="К исполнению" default>
                К исполнению</option>
              <option value="В процессе">
                В процессе</option>
              <option value="Выполнено">
                Выполнено</option>
            </select>
          </div>
          <div class="dateDiv col-2">
            <input type="date" id="start" name="trip-start" class="date" onkeypress="return false"
              @change="changeDeadlineTask(task.deadline, task.id)" v-model="task.deadline">
          </div>


          <div class="selectResponsible col-2">
            <ss-select v-model="task.executor_id" :options="allUsers" track-by="name" search-by="name"
              @change="selectExecutorTask(task.id, task.executor_id)" disable-by="disabled" id="ss-select">
              <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }">
                <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
                <ss-select-toggle class="px-3 py-1 flex items-center justify-between">
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
            <span @click.prevent="displayInput" style="margin-left: 16px">Добавить задачу</span>
          </div>

          <div v-else class="inputAdd">
            <div style="display: flex;">
              <input type="text" placeholder="Добавить задачу" class="addTask" @input="enableB" @keyup.enter="addTask"
                v-model="taskName" :class="{ 'form-control--error': taskName.length >= 150 || taskName.length == 0}">
              <div class="selectsInputAdd">
                <div class="dateDiv">
                  <input type="date" id="start" name="trip-start" class="date" onkeypress="return false"
                    v-model="deadline">
                </div>
                <div class="selectResponsible">
                  <user-icon size="1.5x" class="custom-class" style="margin: 0 10px 0 0"></user-icon>
                  <select class="form-control" style="height: fit-content; padding: 0;" v-model="executor">
                    <option default>
                      Выбрать
                    </option>
                    <option v-for="(u, i) in allUsers" :key="i" :value="u.id">
                      {{u.name.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w).join(' ')}}
                    </option>
                  </select>
                </div>

              </div>
            </div>
            <div class="error" v-if="error">{{error.description}}</div>
            <div class="error" v-if="error">{{error}}</div>

          </div>



        </li>
      </ol>
      <!-- в addtask передать решение -->
      <div type="submit" class="btnsAddTask" v-if="!addNotClicked">
        <button id="addBtn" class="btn btnPink" @click.prevent="addTask" :disabled="!enableBtn">Добавить задачу</button>
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
    TrashIcon
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
      addNotClicked: true,
      enableBtn: false,
      taskName: '',
      executor: null,
      status: 'К исполнению',
      deadline: '',
      openDeleteTask: false,
      taskIdDelete: '',
      inputActive: false
    }),
    components: {
      UserIcon,
      PlusIcon,
      TrashIcon,
      DeleteTask,
      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      // SsSelectSearchInput
    },

    computed: {
      ...mapGetters(['tasks', 'error', 'error404', 'allUsers', 'currentSolution']),
    },
    methods: {

      enableB() {
        this.enableBtn = true
        document.getElementById('addBtn').classList.remove('btnPink')
        document.getElementById('addBtn').classList.add('btnGren')
      },
      async addTask() {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('postTask', {
          solutionId: this.currentSolution,
          description: this.taskName,
          // executor_id: this.executor,
          status: this.status,
          deadline: this.deadline
        }).then(() => {
          if (!this.error) {
            this.$store.commit('setError', '')
            this.taskName = ''
            this.addNotClicked = true
          }
        })
      },
      displayInput() {
        this.addNotClicked = false
        this.$store.commit('setError', '')
      },
      async changeStatusTask(status, id) {
        await this.$store.dispatch('changeStatusTask', {
          status,
          id
        })
      },
      async changeDeadlineTask(deadline, id) {
        console.log(deadline, id);
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('changeDeadlineTask', {
          deadline,
          id
        })
      },

      async selectExecutorTask(uid, id) {
        // let uid = event.target.value
        await this.$store.dispatch('changeExecutorTask', {
          id,
          uid
        })
      },
      async editTask(description, id) {
        console.log(description, id);
        await this.$store.dispatch('editTask', {
          description,
          id
        })
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
    // padding-left: 42px;
    padding-left: 26px;
    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #333333;
    font-style: normal;
    font-weight: normal;
    background-color: #F6F6F6;
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



  option {
    background-color: #F6F6F6;
    color: #2D453F;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    border-radius: 10px;
    // outline: none;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
  }

  .selectResponsible {
    display: flex;
    background-color: #F6F6F6;
    padding-left: 10px;

    #ss-select {
      padding-left: 8px;
      // width: 128px;
      align-items: center;
      display: flex;
      height: 36px;
      background-color: #F6F7F9;
      border-radius: 10px;
    }

    select {
      // background: url('~@/assets/Select.png') no-repeat;
      // background-position: right 0.5em top 46%, 0 0;
      margin: 0;
      width: 142px;
      background-color: #f6f6f6;
    }
  }

  .selectResponsible:hover {
    // background-color: #E5E9F1;

    #ss-select {
      // background-color: #E5E9F1;
      background-color: #e5e9f1;
    }
  }

  .selectResponsible:focus,
  .selectResponsible:active {
    // background-color: #4EAD96;
    color: #fff;
    // outline: none;

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
    z-index: 1000000000000;
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
    // outline: none;
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
    // margin: 0 20px;
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
    // outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    height: fit-content;
    // margin-right: 30px;
    // width: 163px;
    // width: 166px !important;
    border-radius: 10px;
  }

  .select {
    // margin-right: 30px;
    border-radius: 10px;
    height: 36px;
    // width: 180px;
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
      // outline: none;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
    }
  }

  .green {
    background-color: #4EAD96 !important;
    width: 180px;
    background: url('~@/assets/SelectWhite.png') no-repeat;
    background-position: right 0.6em top 50%, 0 0;
    color: #fff;
  }

  .gray {
    background-color: #E0E0E0 !important;
    width: 180px;
    background: url('~@/assets/Select.png') no-repeat;
    background-position: right 0.6em top 50%, 0 0;
    color: #2D453F;
  }

  .blue {
    background-color: #AEDAF2 !important;
    width: 180px;
    background: url('~@/assets/SelectWhite.png') no-repeat;
    background-position: right 0.6em top 50%, 0 0;
    color: #fff;
  }

  .task-title {
    display: flex;

    input {
      padding: 6px;
      border-radius: 10px;
      width: fit-content;
      background-color: #F6F6F6;
    }

    input:hover {
      // background-color: #fff;
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
    justify-content: space-around;
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

  // @media (min-width: 700px) {
  //    .subt1 {
  //       flex: 0 0 33.333333%;
  //     max-width: 33.333333%;
  //     }
  // }


  // @media (min-width: 1200px) {
  //    .subt1 {
  //       flex: 0 0 40.666667%;
  //     max-width: 40.666667%;
  //     }
  // }

  @media (max-width: 1200px) {

    .subt {
      display: none;
    }

    #list {
      display: flex;
      flex-direction: initial;
      flex-wrap: wrap;
      justify-content: space-between;

      div {
        margin-bottom: 30px;
      }

      #close {
        order: 2;

        margin-left: -48px;

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

      .task-title {
        order: 1;
        margin-right: 109px;
      }
    }

    .task-title {
      flex: 0 1;
      min-width: fit-content;
    }

    .selectsInputAdd {
      display: none;
    }

    .addTask {
      border-radius: 9px;
      width: 100%;
    }
  }

  //   @media (min-width: 1500px) {
  //    .subt1 {
  //       flex: 0 0 42.666667%;
  //     max-width: 42.666667%;
  //     }
  // }

  //   @media (min-width: 1800px) {
  //   .subt1 {
  //     flex: 0 0 48%;
  //     max-width: 48%;
  //   }
  // }

  @media (max-width: 500px) {
    .header {
      display: none;
    }

    // .subt1 {
    //   flex: 1;
    // }
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