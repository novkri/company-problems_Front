<template>
  <div class="row container-row">
    
    <div class="modal-body">
      <div>
        <div class="subtitle row subt">
          <div class="col-4">
          </div>
          <div class="col-3" style="justify-content: center;display: flex;">
            <span style="text-align: center;">Статус выполнения</span>
          </div>
          <div class="col-3" style="justify-content: center;display: flex;">
            <span style="text-align: center;">Срок исполнения</span>
          </div>
          <div class="col-2" style="justify-content: center;display: flex;">
            <span>Ответственный</span>
          </div>

        </div>
        <div>
          <ol v-show="solutions">
            <li v-for="(solution, idx) in solutions" :key="idx" id="list" class="row">
              <div class="list-item col-4">
                <div class="desc" ref="desc">
                  <div style="width: 90%; cursor: pointer;" :ref="'sol-div'+val.id"
                    @click="onClickInput(val.id, solution.executor_id)" v-show="!editable" :style="[solution.name ? {} : 
                  { 'font-size': '16px', 'border-radius': '10px', 'padding': '6px 14px',
                    'margin-right': '-43px'} ]">
                    {{solution.name ? solution.name : "Введите решение..."}}</div>

                    <!-- :id="'textarea'+val.id" -->
                  <input v-show="editable" class="form-control" v-model="solution.name"
                    :ref="'textarea' + val.id" @keyup.enter="event => {editSolClick(solution.name, solution.id, event)}"
                    @focus="event => onFocusInput(event, val.id)"
                    @blur="event => {onBlurInput(solution.name, solution.id, event)}" />
                  <div class="hidden" :ref="'hidden'+val.id">
                    <button class="input-btn" @mousedown="event => {editSolClick(solution.name, solution.id, event)}">
                      <check-icon size="1x" class="custom-class"></check-icon>
                    </button>
                    <div @mousedown="event => onClear(event, solution.id)">
                      <button class="input-btn">
                        <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="select col-3" style="position: relative;" ref="select">
                <ss-select v-model="solution.status" :options="statuses" track-by="name" class="form-control"
                  @change="changeStatus(solution.id, solution.status, solution.executor_id)" disable-by="disabled"
                  :class="[solution.status == 'Выполнено' ? 'green' : 'blue']" id="ss-select"
                  style="width: 87%; margin: auto;">
                  <div @click="onClickStatus(solution.status)"
                    slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                    style="cursor: pointer; width: 100%;" >
                    <ss-select-toggle id="select-toggle">
                      {{ $get(selectedOption, 'name') || `${solution.status ? solution.status : 'Выбрать'}`}}
                      <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
                    </ss-select-toggle>

                    <section v-show="isOpen && user.is_admin || isOpen && solution.executor_id == currentUid"
                      class="absolute border-l border-r min-w-full" style="height: auto;left: 1%;">
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

              <div class="dateDiv col-3">
                <input type="date" id="start" name="trip-start" class="date" v-model="solution.deadline"
                  @change="changeDeadline(solution.executor_id, solution.deadline, solution.id)" @click="onClickDate($event)">
              </div>

              <div class="selectResponsible col-2">
                <ss-select v-model="solution.executor_id" :options="allUsersReduced" track-by="id" search-by="surname"
                  @change="selectExecutor(solution.id, solution.executor_id)" disable-by="disabled" id="ss-select">
                  <div
                    slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                    style="cursor: pointer; width: 100%;" @click="onClickExecutor(selectedOption)">
                    <ss-select-toggle class="flex items-center justify-between" id="select-toggle">
                      <award-icon size="1.5x" class="custom-class"></award-icon>
                      {{ $get(selectedOption, 'id') || `${allUsersReduced.find(u => u.id == solution.executor_id) ? allUsersReduced.find(u => u.id == solution.executor_id).surname + ' ' + allUsersReduced.find(u => u.id == solution.executor_id).name + allUsersReduced.find(u => u.id == solution.executor_id).father_name : 'Выбрать'}`}}
                    </ss-select-toggle>

                    <section v-show="isOpen && user.is_admin || isOpen && isLeader"
                      class="absolute border-l border-r min-w-full">
                      <div class="px-px">
                        <ss-select-search-input class="w-full px-3 py-2 search" placeholder="Впишите фамилию">
                        </ss-select-search-input>
                      </div>

                      <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id" :index="index"
                        :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.surname }} {{option.name}} {{ option.father_name }}</ss-select-option>
                    </section>
                  </div>
                </ss-select>
              </div>

            </li>
          </ol>
        </div>
      </div>
    </div>



    <RemoveFromWork v-if="openRemoveFromWork" :openRemoveFromWork="openRemoveFromWork"
      @closeRemoveSolutions="closeRemoveSolutions($event)" :val="solutionIdRemove" />
    <DeleteTask v-if="openDeleteTask" :openDeleteT="openDeleteTask" @closeDeleteTask="closeDeleteTask($event)"
      :val="taskIdDelete" />
  </div>

</template>

<script>
  import {
    AwardIcon,
    ChevronDownIcon,
    PlusIcon,
    CheckIcon,
  } from 'vue-feather-icons'

  import {
    mapGetters
  } from 'vuex'

  import RemoveFromWork from './RemoveFromWork'
  import DeleteTask from './Tasks/DeleteTask'

  import {
    SsSelect,
    SsSelectToggle,
    SsSelectOption,
    SsSelectSearchInput
  } from 'ss-select'



  export default {
    name: 'popup',
    props: ['open', 'val'],
    data: () => ({
      openSolutions: false,
      showTasks: false,
      showEdit: false,
      openRemoveFromWork: false,
      openDeleteTask: false,
      editable: false,
      noSolutionInWork: true,

      solutionName: '',
      solutionIdRemove: '',
      problemName: '',
      taskIdDelete: '',
      currentDate: '',
      currentDateInput: '',

      currentSolutionInput: '',
      currentSolutionName: '',
      currentSolStatus: '',
      currentSolInput: '',
      currentExecutorSol: '',

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
    }),
    components: {
      AwardIcon,
      ChevronDownIcon,
      PlusIcon,
      CheckIcon,

      RemoveFromWork,
      DeleteTask,

      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      SsSelectSearchInput
    },
    computed: {
      ...mapGetters(['solutions', 'error', 'error404', 'allUsersReduced', 'currentSolution', 'tasks', 'currentUid',
        'user', 'isLeader'
      ]),
    },
    methods: {
      onClickExecutor(sol) {
        this.currentExecutorSol = sol
      },

      async selectExecutor(id, uid) {
        this.$store.commit('setError404', '')
        if (this.isLeader || this.user.is_admin) {
          await this.$store.dispatch('changeExecutor', {
            id,
            uid
          }).catch(() => {
            this.$store.commit('editExecutor', {
              id,
              executor_id: this.currentExecutorSol
            })
          })
        } else {
          this.$store.commit('setError404', 'У вас недостаточно прав')
          this.$store.commit('editExecutor', {
            id,
            executor_id: this.currentExecutorSol
          })
        }
      },

      onClickStatus(status) {
        this.currentSolStatus = status
      },

      async changeStatus(id, status, executor_id) {
        await this.$store.commit('setError404', '')

        if (executor_id == this.currentUid || this.user.is_admin) {
          await this.$store.dispatch('changeStatus', {
            status: status.name,
            id
          }).catch(() => {
            this.$store.commit('editStatus', {
              id,
              status: 'В процессе'
            })
          })
        } else {
          this.$store.commit('setError404', 'У вас недостаточно прав')
          this.$store.commit('editStatus', {
            status: this.currentSolStatus,
            id
          })
        }
      },

      onClickDate(event) {
        this.currentDate = event.target.value
        this.currentDateInput = event.target
      },

      async changeDeadline(executor_id, deadline, id) {
        await this.$store.commit('setError404', '')
        if (executor_id == this.currentUid || this.user.is_admin) {
          await this.$store.dispatch('changeDeadline', {
            deadline,
            id
          }).catch(() => {
            this.$store.commit('editDeadline', {
              deadline: this.currentDate,
              id
            })
          })
        } else {
          this.$store.commit('setError404', 'У вас недостаточно прав')
          this.$store.commit('editDeadline', {
              deadline: this.currentDate,
              id
            })
        }
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

      onClickInput(id, executor_id) {
        if (executor_id == this.currentUid || this.user.is_admin || this.isLeader) {
          this.editable = true

          event.target.style.display = 'none'
          this.$nextTick(() => {
            this.$refs['textarea' + id][0].focus()
          })
        }
      },

      async onBlurInputPossible(name, id) {
        this.noSolutionInWork = false
        this.$store.commit('setError404', '')
        if (name !== this.currentSolutionName) {
          await this.$store.dispatch('editSolution', {
              id,
              name
            }).then(() => {
              this.$refs['textarea-no-solution' + id][0].style.display = 'none'
              this.noSolutionInWork = true
            })
            .catch(() => {
              this.$store.commit('editSolutionOther', {
                name: this.currentSolutionName,
                id
              })
            })
        }

        this.$refs['sol-div-no-solution' + id][0].style.display = 'initial'
        this.$refs['hidden' + id][0].classList.remove('flex')


      },
      async onBlurInput(name, id) {
        this.editable = false
        this.noSolutionInWork = false
        this.$store.commit('setError404', '')
        if (name !== this.currentSolutionName) {
          await this.$store.dispatch('editSolution', {
            id,
            name
          }).catch(() => {
            this.$store.commit('editSolutionOther', {
              name: this.currentSolutionName,
              id
            })
          })
        }

        this.$refs['textarea' + id][0].style.display = 'none'
        this.$refs['sol-div' + id][0].style.display = 'initial'
        this.$refs['hidden' + id][0].classList.remove('flex')
      },
      onFocusInput(event, id) {
        this.noSolutionInWork = true
        this.currentSolutionName = event.target.value
        this.currentSolutionInput = event.target

        this.$refs['hidden' + id][0].classList.add('flex')
      },

      onClear(event, id) {
        event.preventDefault()

        this.$store.commit('editSolutionOther', {
          name: this.currentSolutionName,
          id
        })
      },

      async editSolClick(name, id) {
        this.editable = false

        if (name !== this.currentSolutionName) {
          await this.$store.commit('editSolutionOther', {
            name,
            id
          })
        }

        event.target.blur()
      },
    }
  }
</script>

<style scoped lang="scss">
  .row {
    margin-right: 0;
    margin-left: 0;
    width: 100%;

    div {
      padding: 0;
    }
  }


  svg {
    color: #4f4f4f;
    cursor: pointer;
    margin: 0 -1px 0 0;
  }

  #remove {
    display: none;
    margin: auto;

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
    width: 100%;

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
    margin-right: 20px;
    margin-left: 20px;
    max-width: -webkit-fill-available;
    max-width: -moz-available;
  }

  ol {
    margin-top: 10px;
    line-height: 24px;
    color: #2D453F;
    margin-bottom: 0;
    padding: 0;
    font-size: 16px;
    font-family: 'GothamPro';
    letter-spacing: 0.15px;
    color: #828282;

    li {
      align-items: center;
      padding: 0;
      border-radius: 9px;
      background-color: #fff;
      margin: 0 24px 16px 0;
    }
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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
    align-items: center;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    width: 100%;
    padding-right: 8px;


    span {
      font-family: "GothamPro";
      color: #4F4F4F;
      cursor: default;
    }

    input {
      background-color: #F2F5FA;
      padding-top: 0;
      padding-bottom: 0;
      cursor: pointer;
      overflow: hidden;
      resize: vertical;
    }
  }

  .tasks {
    margin: -20px 0px 40px 20px;
    width: 97%;
    border-radius: 9px;
  }

  #list .selectResponsible:hover~#close {
    display: none !important;
  }

  .selectResponsible {
    display: flex;

    #ss-select {
      align-items: center;
      display: flex;
      border-radius: 10px;
      padding-right: 0;
      width: fit-content;
      height: 30px;
      overflow: hidden;
      width: max-content !important;
    }

    #ss-select:hover {
      overflow: visible;
      width: max-content !important;
      background-color: #F2F5FA;

      >div {
        max-height: 30px;
        min-width: max-content;
        padding-right: 10px;
      }
    }

    #select-toggle {
      font-family: 'GothamPro';
      color: #4F4F4F;
      max-height: 25px;
    }

    select {
      margin: 0;
      width: 100%;
      background-color: #f6f6f6;
    }

    section {
      left: -56% !important;
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

  .selectResponsible:hover {
    #ss-select {
      background-color: #F2F5FA;
    }
  }

  .selectResponsible:focus,
  .selectResponsible:active {
    color: #fff;
    outline: none;
    max-height: 27px;

    #ss-select {
      background-color: #4EAD96;
      overflow: visible;
      width: fit-content;
    }

    #select-toggle {
      color: #fff;
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

  .close {
    margin: 1rem 1rem 1rem auto;
    padding: 0;
    font-size: 20px;
  }

  .dateDiv {
    justify-content: center;
    display: flex;
  }

  .date {
    outline: none;
    width: fit-content;
    border: none;
    position: relative;
    color: #4f4f4f;
    padding-left: 28px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-radius: 10px;
    background-color: #fff;
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
    background: url('~@/assets/calendar.png') left;
    background-size: 80%;
    background-repeat: no-repeat;
    cursor: pointer;
    color: #828282;
    position: absolute;
    top: 20%;
    left: -14%;
  }

  input[class="date"]:focus::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendarW.png') left;
    background-size: 80%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    left: -14%;
    top: 20%;
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

  .blue {
    background-color: #AEDAF2 !important;
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

    &:hover {
      background-color: #fff;

      input {
        background-color: #fff;
      }
    }
  }

  input:active,
  input:focus {
    background-color: #f0f0f0;
  }

  #select-toggle {
    font-family: 'GothamPro-Medium';
    font-size: 16px;
    line-height: 24px;
    width: fit-content;
    margin: auto;
    letter-spacing: 0.15px;
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

  .container-row {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #fff;
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

      .middle-icons_text span {
        font-size: 10px !important;
      }
    }

    .subtitle1 {
      margin-top: 30px;
    }

    .subt div {
      font-size: 13px;
    }
  }

  @media (max-width: 1200px) {
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
    }
  }

  @media (max-width: 1100px) {
    .subt div {
      font-size: 12px;
    }
  }

  @media (max-width: 500px) {
    .tasks {
      width: 85% !important;
    }
  }
</style>