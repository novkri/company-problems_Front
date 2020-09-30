<template>
  <div class="row">
    <!-- <div class="modal-header" >
              <div class="subtitle subtitle1">
                <h5 class="modal-title" @click="showEdit = !showEdit" v-if="!showEdit">{{val.name}}</h5>
                <div class="form-group" v-else>
                  <input autofocus @blur="editProblem()" @keyup.enter="onKey($event)" @focus="onFocusInput($event)"
                    ref="input" class="form-control" id="new-problem-title" v-model="val.name">
                  <div class="error" v-if="error">{{error}}</div>
                </div>
              </div>
            </div> -->

    <div class="modal-body col-9">
      <div>
        <div class="subtitle row subt">
          <div class="col-5">

          </div>
          <div class="col-2" style="justify-content: center;display: flex;">
            <span>Статус выполнения</span>
          </div>
          <div class="col-2" style="justify-content: center;display: flex;">
            <span>Срок исполнения</span>
          </div>
          <div class="col-2" style="justify-content: center;display: flex;">
            <span>Ответственный</span>
          </div>
          <div style="width: 20px" class="col">

          </div>
        </div>
        <div>

          <ol>
            <li v-for="(solution, idx) in solutions" :key="idx" id="list" class="row">
              <!-- {{solution}} -->
              <div class="list-item col-5">
                <div class="desc" ref="desc">
                  <span>Решение: </span>
                  <!-- {{val.possible_solution}} -->
                  <div @click="onClickInput(val.id)" v-show="!editable && !solution.name">{{val.possible_solution}}
                  </div>
                  <div :ref="'sol-div'+val.id" @click="onClickInput(val.id)" v-show="!editable && solution.name">{{solution.name}}</div>
                  <input v-show="editable" class="form-control" :id="'textarea'+val.id" v-model="solution.name"
                    :ref="'textarea' + val.id" @keyup.enter="event => {editSolClick(solution.name, solution.id, event)}"
                    @focus="event => onFocusInput(event, val.id)" @blur="event => {onBlurInput(solution.name, solution.id, event)}" />
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

              <div class="select col-2" style="position: relative;" ref="select">
                <ss-select v-model="solution.status" :options="statuses" track-by="name" class="form-control"
                  @change="changeStatus(solution.id, solution.status)" disable-by="disabled"
                  :class="[solution.status == 'Выполнено' ? 'green' : 'gray']" id="ss-select" style="width: auto;">
                  <div
                    slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                    style="cursor: pointer; width: 100%;">
                    <ss-select-toggle id="select-toggle">
                      {{ $get(selectedOption, 'name') || `${solution.status ? solution.status : 'Выбрать'}`}}
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
                <input type="date" id="start" name="trip-start" class="date" v-model="solution.deadline"
                  onkeypress="return false" @change="changeDeadline(solution.deadline, solution.id)"
                  @click="onClickDate($event)">
              </div>

              <div class="selectResponsible col-2">
                <ss-select v-model="solution.executor_id" :options="allUsers" track-by="id" search-by="surname"
                  @change="selectExecutor(solution.id, solution.executor_id)" disable-by="disabled" id="ss-select">
                  <div
                    slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                    style="cursor: pointer;">
                    <ss-select-toggle class="flex items-center justify-between" id="select-toggle">
                      <award-icon size="1.5x" class="custom-class"></award-icon>
                      {{ $get(selectedOption, 'id') || `${allUsers.find(u => u.id == solution.executor_id) ? allUsers.find(u => u.id == solution.executor_id).surname + ' ' + allUsers.find(u => u.id == solution.executor_id).name[0] + '.' : 'Выбрать'}`}}
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
                              ]">{{ option.surname }} {{option.name[0]}}.</ss-select-option>
                    </section>
                  </div>
                </ss-select>
              </div>

              <div style="width: 20px" class="col">
                <button type="button" class="close" id="remove" @click="removeFromWork(solution)" data-toggle="modal"
                  data-target="#popupRemoveFromWOrk">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div class="col-3"></div>


    <RemoveFromWork v-if="openRemoveFromWork" :openRemoveFromWork="openRemoveFromWork"
      @closeRemoveSolutions="closeRemoveSolutions($event)" :val="solutionIdRemove" />
    <DeleteTask v-if="openDeleteTask" :openDeleteT="openDeleteTask" @closeDeleteTask="closeDeleteTask($event)"
      :val="taskIdDelete" />
  </div>

</template>

<script>
  import {
    // UserIcon,
    // EyeIcon,
    AwardIcon,
    ChevronDownIcon,
    PlusIcon,
    CheckIcon,
  } from 'vue-feather-icons'

  import {
    mapGetters
  } from 'vuex'

  // import Solutions from './AllSolutions'
  import RemoveFromWork from './RemoveFromWork'
  // import Tasks from './Tasks/Tasks'
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
      // UserIcon,
      // EyeIcon,
      AwardIcon,
      ChevronDownIcon,
      PlusIcon,
      CheckIcon,

      // Solutions,
      RemoveFromWork,
      // Tasks,
      DeleteTask,

      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      SsSelectSearchInput
    },
    computed: {
      ...mapGetters(['solutions', 'error', 'error404', 'allUsers', 'currentSolution', 'tasks']),
    },
    methods: {
      async selectExecutor(id, uid) {
        await this.$store.dispatch('changeExecutor', {
          id,
          uid
        })
      },
      async changeStatus(id, status) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('changeStatus', {
          status: status.name,
          id
        }).catch(() => {
            this.$store.commit('editStatus', {
              id,
              status: 'В процессе'
            })
          }

        )
      },

      onClickDate(event) {
        this.currentDate = event.target.value
        this.currentDateInput = event.target
      },

      async changeDeadline(deadline, id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('changeDeadline', {
          deadline,
          id
        }).catch(() => {
          this.$store.commit('editDeadline', {
            deadline: this.currentDate,
            id
          })
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

      onClickInput(id) {
        this.editable = true

        event.target.style.display = 'none'
        this.$nextTick(() => {
          this.$refs['textarea' + id][0].focus()
        })
      },

      onBlurInput(name, id, event) {
        this.editable = false
        console.log(event);

        if (name !== this.currentSolutionName) {
          this.$store.dispatch('editSolution', {
            id,
            name
          }) 
        }

          this.$refs['textarea' + id][0].style.display = 'none'
          this.$refs['sol-div' + id][0].style.display = 'flex'
          this.$refs['hidden' + id][0].classList.remove('flex')
       

      },
      onFocusInput(event, id) {
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
    // margin-left: 20px;

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
    // margin-top: 35px;
    // margin-left: 29px !important;
    // margin-left: 11px;
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
      // padding: 15px 49px 12px;
      padding: 0;
      border-radius: 9px;
      background-color: #F6F7F9;
      margin: 0 24px 16px 0;
      align-items: flex-start;
    }
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    // box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
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
    font-family: 'GothamPro-Medium';
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    width: 95%;

    span {
      font-family: "GothamPro";
      cursor: default;
    }

    input {
      background-color: #F6F7F9;
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

  .selectResponsible {
    display: flex;
    margin-left: 10px;

    #ss-select {
      // padding-left: 8px;
      align-items: center;
      display: flex;
      height: 36px;
      border-radius: 10px;
      padding-right: 0;
      width: fit-content;
    }

    #select-toggle {
      font-family: "GothamPro"
    }

    select {
      margin: 0;
      width: 100%;
      background-color: #f6f6f6;
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
      background-color: #F6F7F9;
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
    background-color: #F6F7F9;
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