<template>
  <div class="popup-show">
    <div class="modal fade" id="popupShow" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered" :style="{'width': openSolutions ? '1434px' : '1212px'}">
        <div class="modal-content" v-if="!openSolutions">
          <div class="modal-header">
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="subtitle">
              <h5 class="modal-title">{{val.name}}</h5>
              <!-- <h6 v-if="progress !== ''">Прогресс решения {{progress}}%</h6>
              <h6 v-else>Прогресс решения 0%</h6>
              <div class="icons">
                <img src="~@/assets/star.png">
                <span>95</span>
              </div> -->

            </div>

            <div>
              <div class="subtitle"><span style="width: 44%;">Решения в работе:</span> <span>Статус выполнения</span>
                <span>Срок исполнения</span> <span>Ответственный</span></div>
              <ol>
                <li v-for="(solution, idx) in solutions" :key="idx">
                  <div class="list-item">
                    <div class="desc" ref="desc" @click="displayTasks($event)"><span>{{idx+1}}.{{solution.name}}</span>
                    </div>
                    <!--  v-if="showTasks" -->
                    <ul class="tasks" ref="hiddenList">
                      <li>
                        <span>Задача1</span>
                        <div class="select gray" style="position: relative;" ref="select">
                          <select v-model="solution.status" class="form-control" @change="changeStatus($event)">
                            <!-- :style="{'background-color': solution.status == 'Выполнено' ? '#4EAD96' : '#C4C4C4', 'color': solution.status == 'Выполнено' ? '#fff' : '#2D453F' }" -->
                            <option value="В работе">
                              В работе</option>
                            <option value="Выполнено">
                              Выполнено</option>
                          </select>
                        </div>
                        <input type="date" id="start" name="trip-start" class="date" v-model="solution.formData">
                        <div class="selectResponsible">
                          <!-- v-model="solution.status" -->
                          <select class="form-control" style="height: fit-content; padding: 0;">
                            <option value="0">
                              Человек1 Ч. Ч.</option>
                            <option value="1">
                              Человек2</option>
                          </select>
                        </div>
                        <!-- <button type="button" class="close" style="margin: 0 -1rem -1rem auto;"
                          @click="solution.in_work = false">
                          <span aria-hidden="true">&times;</span>
                        </button> -->
                        <!-- <div class="icons"> -->
                        <!-- @click="deleteP(problem.id, problem.name)" data-toggle="modal" data-target="#popupDelete" -->
                        <trash-icon size="1.5x" class="custom-class"
                          @click="deleteTask(task.id)"></trash-icon>
                        <!-- </div> -->
                      </li>

                      <li>
                        <!-- v-model="name" -->
                        <input type="text" class="form-control" placeholder="+ Добавить задачу...">
                        <div class="addNewTask">
                          <input type="date" id="start" name="trip-start" class="date">
                          <div class="selectResponsible">
                            <select class="form-control" style="height: fit-content; padding: 0;">
                              <option selected disabled>Выбрать</option>
                              <option value="0">
                                Человек1 Ч. Ч.</option>
                              <option value="1">
                                Человек2</option>
                            </select>
                          </div>
                        </div>
                        
                      </li>
                    </ul>
                  </div>

                  <div class="select gray" style="position: relative;" ref="select">
                    <select v-model="solution.status" class="form-control" @change="changeStatus($event)">
                      <!-- :style="{'background-color': solution.status == 'Выполнено' ? '#4EAD96' : '#C4C4C4', 'color': solution.status == 'Выполнено' ? '#fff' : '#2D453F' }" -->
                      <option value="В работе">
                        В работе</option>
                      <option value="Выполнено">
                        Выполнено</option>
                    </select>
                  </div>
                  <!-- :value="new Date(solution.updated_at).toISOString().split('T')[0] -->
                  <input type="date" id="start" name="trip-start" class="date" v-model="solution.formData">
                  <!-- {{solution.formData}} -->
                  <!-- {{solution.updated_at}} -->
                  <!-- {{new Date(solution.updated_at).toISOString().split('T')[0]}} -->
                  <!-- {{formData}}
                  {{solution.status}} -->
                  <!-- {{solution.in_work}} -->

                  <div class="selectResponsible">
                    <!-- v-model="solution.status" -->
                    <select class="form-control" style="height: fit-content; padding: 0;">
                      <option value="0">
                        Человек1</option>
                      <option value="1">
                        Человек2</option>
                    </select>
                  </div>

                  <!-- {{solution.in_work}} -->
                  <button type="button" class="close" style="margin: 0 -1rem -1rem auto;"
                    @click="removeFromWork(solution)">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </li>

              </ol>

              <button type="button" class="btn btnMain" @click.prevent="showSolutions(val)" data-toggle="modal"
                data-target="#popupSolutions"><span>Посмотреть/Добавить решение</span></button>

              <!-- {{solutions}} -->
            </div>
          </div>
        </div>

        <div class="modal-content" v-if="openSolutions">
          <Solutions :openS="openSolutions" @closeSolutions="closeSolutions($event)" :val="val" />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {
    TrashIcon,
    // CheckIcon
  } from 'vue-feather-icons'
  import {
    mapGetters
  } from 'vuex'
  import Solutions from './Solutions'
  export default {
    name: 'popup',
    props: ['open', 'val'],
    data: () => ({
      openSolutions: false,
      showTasks: false,
      solutionName: '',
      formData: '',
      progress: ''

    }),
    components: {
      // CheckIcon,
      TrashIcon,
      Solutions
    },

    computed: {
      ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404']),
    },
    methods: {
      changeStatus(event) {
        this.$emit('input', event.target.value);

        if (this.solutions.filter(s => s.status == 'Выполнено').length !== 0) {
          this.progress = (this.solutions.filter(s => s.status == 'Выполнено').length / this.solutions.length) * 100
        }
        if (event.target.value === 'Выполнено') {
          event.path[1].classList.remove('gray')
          event.path[1].classList.add('green')
        } else {
          event.path[1].classList.remove('green')
          event.path[1].classList.add('gray')
        }
      },
      displayTasks(event) {
        this.showTasks = !this.showTasks
        if (event.target.tagName === 'DIV') {
          if (this.showTasks) {
            event.target.classList.add('clicked')
            event.path[1].lastChild.classList.add('show')
          } else {
            event.target.classList.remove('clicked')
            event.path[1].lastChild.classList.remove('show')
          }
        } else if (event.target.tagName === 'SPAN') {
          if (this.showTasks) {
            event.target.classList.add('clicked')
            event.path[2].lastChild.classList.add('show')
          } else {
            event.target.classList.remove('clicked')
            event.path[2].lastChild.classList.remove('show')
          }
        }


      },

      showSolutions() {
        this.openSolutions = true
      },
      closeSolutions() {
        this.openSolutions = false
      },

      removeFromWork(obj) {
        console.log(obj);
        this.solutions.splice(this.solutions.indexOf(obj), 1);
        //send to server changes
      },

      deleteTask(id) {
        console.log('delete task', id);
      }

      // async addSolution(obj) {
      //   await this.$store.dispatch('postSolution', {
      //     problemId: obj.id,
      //     name: this.solutionName
      //   }).then(() => {
      //     if (!this.error) {
      //       this.solutionName = ''
      //       //   document.getElementById('close').click()
      //     }

      //   })
      // },
    }
  }
</script>

<style scoped lang="scss">
  svg {
    color: #AFAFAF;
    cursor: pointer;
    margin: 0 -1px 0 0;
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
      margin-right: 14px;
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
    cursor: pointer;
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
    width: 504px;
 
    li {
      display: list-item;
      // margin-right: -125%;
      width: 234%;
      display: flex;
      justify-content: space-between;

      span {
        width: 48%;
        margin: 0;
      }

      // input {
      //   padding: 0;
      // }
    }

    li:last-child {
      justify-content: center;
      input .form-control {
        padding: 0;
        // width: 100%;
        // width: 504px;
      }
      input .date {
        margin: 0;
      }
    }
  }
  .selectResponsible { 
    // margin: 0 33px; 
    // width: 179px;
    margin: 0 20px 0 33px;
    width: 220px;
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
      background-position: right 0.6em top 50%, 0 0;
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

  .new-solution {
    display: flex;
  }

  .addNewTask {
    display: flex;
    margin: 0 22px;
    .selectResponsible {
      width: 197px;
    }
  }
</style>