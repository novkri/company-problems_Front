<template>
  <div class="modal-body">
    <div style="margin: 60px 41px 0 41px;">
      <h5 class="modal-title">Список решений</h5>
      <h6>Решения в работе</h6>
      <ul class="list-group">
        <li class="list-group-item" id="list" v-for="(sol, idx) in solutions" :key="idx">
          <input class="form-control col-9" v-model="sol.name" @keyup.enter="event => {onKey(event)}"
             @focus="onFocusInput($event)" @blur="editSolClick(sol.name, sol.id)"
            :class="{ 'form-control--error': sol.name.length < 6 ||  sol.name.length > 100 || sol.name.length == 0}">
          <div class="icons col-3" ref="iconInWork">
            <div class="select col-8" style="position: relative;" ref="select" :class="[sol.in_work ? 'green' : 'gray']">
              <select v-model="sol.in_work" class="form-control" @change="event => {changeinWork(sol, event)}">
                <option value="true">
                  В работе</option>
                <option value="false">
                  Не в работе</option>
              </select>
            </div>
                      <!-- <div class="select col-8" style="position: relative;" ref="select">
                        <ss-select v-model="sol.in_work" :options="statuses" track-by="name" search-by="name"
                          class="form-control" @change="event => {changeinWork(sol, event)}"
                          disable-by="disabled" :class="[sol.in_work  ? 'green' : 'gray']"
                          id="ss-select" style="width: 198px; ">
                          <div
                            slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                            style="cursor: pointer; width: 100%;">
                            <ss-select-toggle style="width: 100%; padding: 13px;" id="select-toggle">
                              {{ $get(selectedOption, 'name') || `${sol.in_work ? 'В работе' : 'Не в работе'}`}}
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
                      </div> -->
            <div style="width: 50px;" class="col-4">
              <button type="button" class="close" id="remove" style="margin:  0 30px 0 0;" @click="showDelete(sol.id)"
                data-toggle="modal" data-target="#popupDeleteSolution">
                <trash-icon size="1x" class="custom-class"></trash-icon>
              </button>
            </div>
          </div>
        </li>
      </ul>
      <h6>Прочие решения</h6>
      <ul class="list-group">
        <li class="list-group-item" id="list" v-for="(notinworksol, idx) in solutionsOther" :key="idx">
          <!--  @blur="editSolClick(notinworksol.name, notinworksol.id)"  -->
          <input class="form-control col-9" @keyup.enter="event => {onKey(event)}"
           v-model="notinworksol.name" @blur="editSolClick(notinworksol.name, notinworksol.id)"
            @focus="onFocusInput($event)"
            :class="{ 'form-control--error': notinworksol.name.length < 6 ||  notinworksol.name.length > 100 || notinworksol.name.length == 0}">
          <div class="icons col-3" ref="iconInWork">
            <div class="select col-8" style="position: relative;" ref="select"
              :class="[notinworksol.in_work ? 'green' : 'gray']">
              <select v-model="notinworksol.in_work" class="form-control" @change="event => {changeinWork(notinworksol, event)}">
                <option value="true">
                  В работе</option>
                <option value="false">
                  Не в работе</option>
              </select>
            </div>
            <!-- <div class="select col-8" style="position: relative;" ref="select">
                        <ss-select v-model="notinworksol.in_work" :options="statuses" track-by="name" search-by="name"
                          class="form-control" @change="event => {changeinWork(notinworksol, event)}"
                          disable-by="disabled" :class="[notinworksol.in_work  ? 'green' : 'gray']"
                          id="ss-select" style="width: 198px; ">
                          <div
                            slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                            style="cursor: pointer; width: 100%;">
                            <ss-select-toggle style="width: 100%; padding: 13px;" id="select-toggle">
                              {{ $get(selectedOption, 'name') || `${notinworksol.in_work ? 'В работе' : 'Не в работе'}`}}
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
                      </div> -->


            <div style="width: 50px;" class="col-4">
              <button type="button" class="close" id="remove" style="margin: 0 30px 0 0;" @click="showDelete(notinworksol.id)"
                data-toggle="modal" data-target="#popupDeleteSolution">
                <trash-icon size="1x" class="custom-class"></trash-icon>
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div class="footer">
        <h6>Добавить решение</h6>
        <div class="new-solution">
          <form class="form-group" @submit.prevent="addSolution(val)">
            <div class="input-group">
              <input type="text" v-model="solutionName" class="form-control form-control--valid"
                placeholder="Предложите ваше решение..." @focus="onFocus" @blur="showClear = false">
              <div class="input-group-append" v-if="showClear" @click="onClear">
                <span class="input-group-text">&times;</span>
              </div>
            </div>
            <div class="error" v-if="error">{{error}}</div>
          </form>
          <button type="submit" class="btn btnMain" style="height: 35px; width: 35px; border-radius: 50px;"
            @click="addSolution(val)">
            <img src="@/assets/Vector.png" alt="send">
          </button>
        </div>
      </div>

      <DeleteSolution v-if="showDeleteSol" :openDeleteS="showDeleteSol"
        @closeDeleteSolutions="closeDeleteSolutions($event)" :val="solutionIdDelete" />
    </div>

  </div>
</template>



<script>
  import DeleteSolution from './DeleteSolution'
  import {
    TrashIcon,
    // ChevronDownIcon
  } from 'vue-feather-icons'
  import {
    mapGetters
  } from 'vuex'
  //   import {
  //   SsSelect,
  //   SsSelectToggle,
  //   SsSelectOption,
  // } from 'ss-select'

  export default {
    name: 'popup',
    props: ['open', 'val', 'openSolutions'],
    data: () => ({
      openS: true,
      showTasks: false,
      solutionName: '',
      solutionIdDelete: '',
      showDeleteSol: false,
      showClear: false,
      currentSolutionInput: '',
      currentSolutionName: '',
      // openDeleteTask: false

      currentSolStatus: '',
      currentSolInput: '',

      statuses: [{
          name: "В работе"
        },
        {
          name: "Не в работе"
        }
      ],
    }),
    components: {
      TrashIcon,
      DeleteSolution,
      // ChevronDownIcon,

      //       SsSelect,
      // SsSelectToggle,
      // SsSelectOption,
    },
    computed: {
      ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404', 'allUsers']),
    },
    methods: {
      onFocus() {
        this.showClear = true
      },
      onClear() {
        this.solutionName = ''
      },
      onFocusInput(event) {
        this.currentSolutionName = event.target.value
        this.currentSolutionInput = event.target
      },
      onKey(event) {event.target.blur()},

      async editSolClick(name, id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editSolution', {
            name,
            id
          })
          .then(() => {})
          .catch(() => {
            this.$store.dispatch('editSolution', {
              name: this.currentSolutionName,
              id
            })
          })
      },

      closeSolutions() {
        this.$emit('closeSolutions')
      },

      async changeinWork(obj, event) {
        console.log(event);
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('checkAmountSolInWork').then(() => {
          this.$store.dispatch('changeinWork', {
          id: obj.id,
          in_work: obj.in_work === "true" ? true : false
        }).then(r => {
          this.$store.dispatch('getTasks', r.data.id)
        })
        })
        .catch(() => {
          event.target.value = false
          event.path[1].classList.remove('green')
          event.path[1].classList.add('gray')

          this.$store.dispatch('changeinWork', {
          id: obj.id,
          in_work: obj.in_work === "true" ? true : false
        })
        obj.in_work = false
        })

        
      },

      async addSolution(obj) {
        await this.$store.dispatch('postSolution', {
          problemId: obj.id,
          name: this.solutionName
        }).then(() => {
          if (!this.error) {
            this.solutionName = ''
          }
        })
      },

      showDelete(id) {
        this.showDeleteSol = true
        this.solutionIdDelete = id
      },
      closeDeleteSolutions() {
        this.showDeleteSol = false
      }
    }
  }
</script>

<style scoped lang="scss">
  svg {
    color: #AFAFAF;
    cursor: pointer;
    margin: 0 10px;
  }

  #remove {
    display: none;
  }

  #list:hover #remove {
    display: flex;
    width: 50px;
    height: 36px;
    align-items: center;
  }

    h6 {
      font-family: 'GothamPro';
      font-style: normal;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #828282;
    }

  .modal-header {
    border: none;
    justify-content: space-between;
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
    margin-bottom: 20px;


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

  .subtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 'GothamPro-Medium';
    margin-bottom: 35px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #2D453F;
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
  }

  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 36px 30px 37px 62px;
    height: 100%;
  }

  .modal-body {
    padding: 0;
  }

  .footer {
    margin-top: 53px;
    background-color: #F6F7F9;
    border-radius: 20px;

    h6 {
      padding: 31px 90px;
    }

    .new-solution {
      justify-content: space-between;
      padding: 18px 56px 70px 56px;
    }

    form {
      width: 100% !important;
    }
  }

  input:active,
  input:focus {
    border-bottom: 2px solid #92D2C3;
    background-color: #FFF;
  }

  ol {
    margin-top: 30px;
    margin-bottom: 20px;
    line-height: 24px;
    color: #2D453F;
    margin-bottom: 30px;
    padding: 0;

    li {
      padding: 0 0 10px 0;
    }
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    span {
      width: fit-content;
    }
  }

  .list-item {
    display: flex;
    flex-direction: column;
    width: 545px;
  }

  .btn {
    padding: 0;
    border-radius: 12px;
    width: 335px;
    height: 50px;
    background: #92D2C3;
    color: #fff;
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
    margin: -1rem -1rem -1rem auto;
    padding: 0;
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

  .form {
    width: 100%;
  }

  .form-control {
    border-radius: 10px;
    padding: 7px 13px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    cursor: pointer;
    background-color: #F6F7F9;
  }

  input:active,
  input:focus {
    background-color: #fff !important;
  }


  .list-group-item {
    border-radius: 7px;
    width: 100%;
    height: 60px;
    background-color: #F6F7F9;
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
    cursor: pointer;

    &:last-child {
      margin-bottom: 43px;
    }

    &:hover {
      background-color: #f0f0f0;

      input {
        background-color: #f0f0f0;
      }
    }
  }


  .select {
    width: 158px;
    border-radius: 10px;
    height: 36px;

    padding: 0;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    margin: 0 30px;
    letter-spacing: 0.15px;
    color: #828282;

    select {
      padding-bottom: 0;
      width: 158px;
      appearance: none;
      outline: 0;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      height: fit-content;
    }

    option {
      background-color: #C4C4C4;
      color: #2D453F;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
      border-radius: 10px;
      outline: none;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
    }
  }

  .green {
    background-color: #4EAD96 !important;

    select {
      background: url('~@/assets/SelectWhite.png') no-repeat;
      background-position: right 0.6em top 111%, 0 0;
      color: #fff;
    }
  }

  .gray {
    background-color: #ebebeb !important;

    select {
      background: url('~@/assets/Select.png') no-repeat;
      background-position: right 0.4em top 111%, 0 0;
      color: #2D453F;
    }
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


  .new-solution {
    display: flex;
  }

  .input-group-text {
    border: none;
    cursor: pointer;
    background-color: #FFF;
    border-radius: 6px;
    border-bottom: 2px solid #92D2C3;
  }




  @media (max-width: 780px) {
    .modal-content {
      padding: 20px;
    }

  }

  @media (max-width: 500px) {

    .subt1 {
      flex: 1;
    }
  }
  @media (max-width: 1200px) {
     .modal-title, h6 {
      //  div {
         font-size: 16px;
      //  }
      .form-control {
        font-size: 14px !important;
      }
      
    }
  }
</style>