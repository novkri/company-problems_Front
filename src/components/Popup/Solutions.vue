<template>
  <div class="popup-show">
    <div id="popupSol" tabindex="-1" class="modal fade">
      <div class="modal-dialog modal-dialog-centered" style="max-width:1500px;">
        <div class="modal-content" style="padding: 36px 300px;">
          <div class="modal-header" style="width: 130%;">
            <button type="button" id="close" class="close" @click="closeSolutions"  data-dismiss="modal" data-target="#popupSol">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">

            <h5 class="modal-title">Список решений</h5>
            <h6>Решения в работе</h6>
            <ul class="list-group">
              <li class="list-group-item" id="list" v-for="(sol, idx) in solutions" :key="idx">
                <input class="form-control" @keyup.enter="editSolClick(sol.name, sol.id)"
                  @blur="editSolClick(sol.name, sol.id)" v-model="sol.name"
                  :class="{ 'form-control--error': sol.name.length < 6 ||  sol.name.length > 100 || sol.name.length == 0 }">
                <div class="icons" ref="iconInWork">
                  <trash-icon size="1.5x" class="custom-class" id="remove" style="margin-left: 30px;" @click="showDelete(sol.id)"
                    data-toggle="modal" data-target="#popupDeleteSolution"></trash-icon>
                  <img src="~@/assets/checkd.png" @click="changeinWork(sol)" v-if="sol.in_work">
                  <check-icon size="1.5x" class="custom-class" style="color: #D0D0D0" v-else @click="changeinWork(sol)">
                  </check-icon>
                </div>
              </li>
            </ul>
            <h6>Остальные решения</h6>
            <ul class="list-group">
              <li class="list-group-item" id="list" v-for="(notinworksol, idx) in solutionsOther" :key="idx">
                <input class="form-control"
                  @keyup.enter="editSolClick(notinworksol.name, notinworksol.id)"
                  @blur="editSolClick(notinworksol.name, notinworksol.id)" v-model="notinworksol.name"
                  :class="{ 'form-control--error': notinworksol.name.length < 6 ||  notinworksol.name.length > 100 || notinworksol.name.length == 0 }">
                <div class="icons" ref="iconInWork">
                  <trash-icon size="1.5x" class="custom-class" id="remove" style="margin-left: 30px;"
                    @click="showDelete(notinworksol.id)" data-toggle="modal" data-target="#popupDeleteSolution">
                  </trash-icon>
                  <img src="~@/assets/checkd.png" @click="changeinWork(notinworksol)" v-if="notinworksol.in_work">
                  <check-icon size="1.5x" class="custom-class" style="color: #D0D0D0;" v-else
                    @click="changeinWork(notinworksol)"></check-icon>
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
          </div>
          <DeleteSolution v-if="showDeleteSol" :openDeleteS="showDeleteSol"
            @closeDeleteSolutions="closeDeleteSolutions($event)" :val="solutionIdDelete" />
        </div>
      </div>
    </div>
  </div>

</template>



<script>
  import DeleteSolution from './DeleteSolution'
  import {
    TrashIcon,
    CheckIcon
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
      formData: '',
      // progress: '',
      editBtn: false,
      solutionIdDelete: '',
      showDeleteSol: false,
      showClear: false

    }),
    components: {
      CheckIcon,
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
      async editSolClick(name, id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editSolution', {
          name,
          id
        })
        console.log(event.target);
        event.target.blur();
      },

      closeSolutions() {
        this.$emit('closeSolutions')
      },

      async changeinWork(obj) {
        obj.in_work = !obj.in_work
        await this.$store.dispatch('changeinWork', obj)

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
        console.log(id);
      },
      closeDeleteSolutions() {
        this.showDeleteSol = false
      },

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
  #list:hover #remove{ 
    display:block;
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
      // margin-top: 11px;
    }
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
    // max-width: 1096px;
    padding: 36px 30px 37px 62px;

  }


  .modal-body {
    padding: 0;

  }

  input:active,
  input:focus {
    border-bottom: 2px solid #92D2C3;
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
      // margin-right: 14px;
    }
  }

  .list-item {
    display: flex;
    flex-direction: column;
    width: 545px;
  }

  .desc {
    display: flex;
    flex-direction: row;
    width: fit-content;
  }

  .desc::after {
    content: url('~@/assets/Select.png');
    transition: all 1s ease 0s;
    cursor: pointer;
  }

  .clicked::after {
    transform: rotate(180deg);
    transition: all 1s ease 0s;
    cursor: pointer;
  }

  .tasks {
    margin-top: 27px;
    transition: all 1s ease 0s;
    list-style: none;
    display: none;

    li {
      display: list-item;
      margin-right: -116%;
      display: flex;
      justify-content: space-between;

      span {
        width: 60%;
        margin: 0;
      }
    }
  }

  .show {
    visibility: visible;
    display: flex;
    flex-direction: column;
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
    margin: -1rem -1rem -1rem auto;
    padding: 0;
  }


  .date,
  .date:focus {
    outline: none;
    border: none;
    position: relative;
    margin-left: 61px;
  }

  .icons {
    display: flex;
    flex-direction: row;
    // font-family: 'GothamPro';
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
    color: #6D6D6D;
    position: absolute;
    top: -2%;
    left: 63%;
  }

  .select {
    width: 158px;
    border-radius: 10px;

    padding: 0;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;

    select {
      width: 158px;
      appearance: none;
      // background: url('~@/assets/SelectWhite.png') no-repeat;
      // background: url('~@/assets/Select.png') no-repeat;
      // background-position: right 0.6em top 50%, 0 0;
      outline: 0;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
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
    background-color: #4EAD96;

    select {
      background: url('~@/assets/SelectWhite.png') no-repeat;
      background-position: right 0.4em top 50%, 0 0;
      color: #fff;
    }
  }

  .gray {
    background-color: #C4C4C4;

    select {
      background: url('~@/assets/Select.png') no-repeat;
      background-position: right 0.6em top 50%, 0 0;
      color: #2D453F;
    }
  }

  .form-control {
    border-radius: 10px;
    padding: 7px 13px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    background-color: #F7F7F7;
  }

  .form-control:active,
  .form-control:focus {
    background-color: #FFF;
  }


  .list-group-item {
    border-radius: 7px;
    width: 100%;
    height: 60px;
    background-color: #F7F7F7;
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
      background-color: #F0F0F0;

      input,
      input:hover {
        background-color: #F0F0F0 !important;
        cursor: pointer;
      }
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
</style>