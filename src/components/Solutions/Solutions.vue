<template>
  <!-- <div class="popup-show">
    <div id="popupSol" tabindex="-1" class="modal fade" role="dialog">
      <div class="modal-dialog modal-dialog-scrollable" role="document" style="width: 90vw"> -->
        <!-- <div class="modal-content" style="padding: 36px 300px;min-height: 348px;"> -->
          <!-- <div> -->
          <!-- <div class="modal-header tab">
              <button class="btn btnTab" @click="openShow = false">Просмотр проблемы</button>
              <button class="btn btnTab" @click="openShow = true">Добавить решение</button>
            </div> -->
          <!-- <div class="modal-header" style="width: 130%;">
            <button type="button" id="close" class="close" @click="closeSolutions" data-dismiss="modal"
              data-target="#popupSol">
              <span aria-hidden="true">&times;</span>
            </button>
          </div> -->


          <div class="modal-body">
            <h5 class="modal-title">Список решений</h5>
            <h6>Решения в работе</h6>
            <ul class="list-group">
              <li class="list-group-item" id="list" v-for="(sol, idx) in solutions" :key="idx">
                <input class="form-control" @keyup.enter="editSolClick(sol.name, sol.id)"
                  @blur="editSolClick(sol.name, sol.id)" v-model="sol.name" @focus="onFocusInput($event)"
                  :class="{ 'form-control--error': sol.name.length < 6 ||  sol.name.length > 100 || sol.name.length == 0}">

                <div class="icons" ref="iconInWork">
                  <div class="select" style="position: relative;" ref="select"
                    :class="[sol.in_work ? 'green' : 'gray']">
                    <select v-model="sol.in_work" class="form-control" @change="changeinWork(sol)">
                      <option value="true">
                        В работе</option>
                      <option value="false">
                        Не в работе</option>
                    </select>
                  </div>
                  <div style="width: 50px;">
                    <button type="button" class="close" id="remove" style="margin: auto;" @click="showDelete(sol.id)"
                      data-toggle="modal" data-target="#popupDeleteSolution">
                      <trash-icon size="1x" class="custom-class"></trash-icon>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
            <h6>Остальные решения</h6>
            <ul class="list-group">
              <li class="list-group-item" id="list" v-for="(notinworksol, idx) in solutionsOther" :key="idx">
                <input class="form-control" @keyup.enter="editSolClick(notinworksol.name, notinworksol.id)"
                  @blur="editSolClick(notinworksol.name, notinworksol.id)" v-model="notinworksol.name"
                  @focus="onFocusInput($event)"
                  :class="{ 'form-control--error': notinworksol.name.length < 6 ||  notinworksol.name.length > 100 || notinworksol.name.length == 0}">
                <div class="icons" ref="iconInWork">

                  <div class="select" style="position: relative;" ref="select"
                    :class="[notinworksol.in_work ? 'green' : 'gray']">
                    <select v-model="notinworksol.in_work" class="form-control" @change="changeinWork(notinworksol)">
                      <option value="true">
                        В работе</option>
                      <option value="false">
                        Не в работе</option>
                    </select>
                  </div>

                  <div style="width: 50px;">
                    <button type="button" class="close" id="remove" style="margin: auto;"
                      @click="showDelete(notinworksol.id)" data-toggle="modal" data-target="#popupDeleteSolution">
                      <trash-icon size="1x" class="custom-class"></trash-icon>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
            <br>

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
            <DeleteSolution v-if="showDeleteSol" :openDeleteS="showDeleteSol"
            @closeDeleteSolutions="closeDeleteSolutions($event)" :val="solutionIdDelete" />
          <!-- <DeleteTask v-if="openDeleteTask" :openDeleteT="openDeleteTask" @closeDeleteTask="closeDeleteTask($event)"
            :val="taskIdDelete" /> -->
          </div>
          <!-- <DeleteSolution v-if="showDeleteSol" :openDeleteS="showDeleteSol"
            @closeDeleteSolutions="closeDeleteSolutions($event)" :val="solutionIdDelete" />
          <DeleteTask v-if="openDeleteTask" :openDeleteT="openDeleteTask" @closeDeleteTask="closeDeleteTask($event)"
            :val="taskIdDelete" /> -->
        <!-- </div> -->
      <!-- </div>
    </div>
  </div> -->
</template>



<script>
  import DeleteSolution from './DeleteSolution'
  import {
    TrashIcon
  } from 'vue-feather-icons'
  import {
    mapGetters
  } from 'vuex'

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
    }),
    components: {
      TrashIcon,
      DeleteSolution,
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

      async changeinWork(obj) {
        await this.$store.dispatch('changeinWork', {
          id: obj.id,
          in_work: obj.in_work === "true" ? true : false
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
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #000000;
    font-family: 'Roboto';
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

    h6 {
      font-family: 'GothamPro-Medium';
      font-style: normal;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #2D453F;
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
  }

  .modal-body {
    padding: 0;
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
    background-color: #F7F7F7;
  }


  .list-group-item {
    border-radius: 7px;
    width: 100%;
    height: 60px;
    background-color: #F6F6F6;
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
</style>