<template>
  <div class="popup-show">
    <div id="popupShow" tabindex="-1" class="modal fade">
      <div class="modal-dialog modal-dialog-centered" style="width:1411px;">
        <div class="modal-content">
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
              <div class="subtitle"><span style="width: 35%;">Решения в работе:</span> <span style="color: #000;">Статус
                  выполнения</span>
                <span style="color: #000;">Срок исполнения</span> <span style="color: #000;">Ответственный</span></div>
              <ol>
                <!-- @mouseover="(event) => btnRemoveShow(event)" @mouseleave="(event) => btnRemoveHide(event)" -->
                <li v-for="(solution, idx) in solutions" :key="idx" id="list">
                  <div class="list-item">
                    <div class="desc" ref="desc" @click="displayTasks($event)"><span>{{idx+1}}.{{solution.name}}</span>
                    </div>


                    <!-- tasks -->
                    <!-- отдельным компонетом? -->
                    <ul class="tasks" ref="hiddenList">
                      <li>
                        <span>Задача1</span>
                        <div class="select gray" style="position: relative;" ref="select">
                          <select v-model="solution.status" class="form-control" @change="changeStatus($event)">
                            <option value="В процессе">
                              В процессе</option>
                            <option value="Выполнено">
                              Выполнено</option>
                            <option value="">
                              Отсутсвует</option>
                          </select>
                        </div>
                        <input type="date" id="start" name="trip-start" class="date">
                        <div class="selectResponsible">
                          <select class="form-control" style="height: fit-content; padding: 0;">
                            <option default disabled>Выбрать</option>
                            <option v-for="(u, i) in allUsers" :key="i">
                              {{u.name.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w).join(' ')}}
                            </option>
                          </select>
                        </div>
                        <trash-icon size="1.5x" class="custom-class" @click="deleteTask(task.id)"></trash-icon>
                      </li>

                      <li>
                        <input type="text" class="form-control" placeholder="+ Добавить задачу...">
                        <div class="addNewTask">
                          <input type="date" id="start" name="trip-start" class="date">
                          <div class="selectResponsible" style="margin: 0px 19px 0px 67px; width: 112px;">
                            <select class="form-control" style="height: fit-content; padding: 0;">
                              <option v-for="(u, i) in allUsers" :key="i">
                                {{u.name.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w).join(' ')}}
                              </option>
                            </select>
                          </div>
                        </div>

                      </li>
                    </ul>
                    <!-- tasks -->
                  </div>

                  <div class="select" style="position: relative;" ref="select"
                    :class="[solution.status == 'Выполнено' ? 'green' : 'gray']">
                    <select v-model="solution.status" class="form-control"
                      @change="changeStatus(solution.status, solution.id)">
                      <option value="В процессе">
                        В процессе</option>
                      <option value="Выполнено">
                        Выполнено</option>
                      <option value="">Отсутсвует</option>
                    </select>
                  </div>

                  <input type="date" id="start" name="trip-start" class="date" v-model="solution.deadline"
                    @change="changeDeadline(solution.deadline, solution.id)">

                  <div class="selectResponsible">
                    <user-icon size="1.5x" class="custom-class"></user-icon>
                    <select class="form-control" style="height: fit-content; padding: 0;" v-model="solution.executor"
                      @change="selectExecutor(solution.id)">
                      <option v-for="(u, i) in allUsers" :key="i" :value="u.id">
                        {{u.name.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w).join(' ')}}
                      </option>
                    </select>
                  </div>
                  <div style="width: 50px;">
                    <button type="button" class="close" id="remove" style="margin: auto;"
                      @click="removeFromWork(solution)" data-toggle="modal" data-target="#popupRemoveFromWOrk">
                      <trash-icon size="1x" class="custom-class"></trash-icon>
                    </button>
                  </div>

                </li>
              </ol>

              <button type="button" class="btn btnMain" @click.prevent="showSolutions(val)" data-toggle="modal"
                data-target="#popupSol"><span>Посмотреть/Добавить решение</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Solutions v-if="openSolutions" :openS="openSolutions" @closeSolutions="closeSolutions($event)" :val="val" />
    <RemoveFromWork v-if="openRemoveFromWork" :openRemoveFromWork="openRemoveFromWork"
      @closeRemoveSolutions="closeRemoveSolutions($event)" :val="solutionIdRemove" />
  </div>
</template>

<script>
  import {
    TrashIcon,
    UserIcon
  } from 'vue-feather-icons'
  import {
    mapGetters
  } from 'vuex'
  import Solutions from './Solutions'
  import RemoveFromWork from './RemoveFromWork'

  export default {
    name: 'popup',
    props: ['open', 'val'],
    data: () => ({
      openSolutions: false,
      showTasks: false,
      solutionName: '',
      progress: '',
      openRemoveFromWork: false,
      solutionIdRemove: '',
      btnRemove: false
    }),
    components: {
      UserIcon,
      TrashIcon,
      Solutions,
      RemoveFromWork
    },

    computed: {
      ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404', 'allUsers']),
    },
    methods: {
      async selectExecutor(id) {
        console.log(id);
        console.log(event.target.value); //id
        let uid = event.target.value
        await this.$store.dispatch('changeExecutor', {
          id,
          uid
        })
      },
      async changeStatus(status, id) {
        await this.$store.dispatch('changeStatus', {
          status,
          id
        })
      },
      async changeDeadline(deadline, id) {
        await this.$store.dispatch('changeDeadline', {
          deadline,
          id
        })
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

      async removeFromWork(obj) {
        this.solutionIdRemove = obj.id
        this.openRemoveFromWork = true
        // await this.$store.dispatch('changeinWork', {in_work: false, id: obj.id})
      },

      deleteTask(id) {
        console.log('delete task', id);
      }
    }
  }
</script>

<style scoped lang="scss">
  svg {
    color: #AFAFAF;
    cursor: pointer;
    margin: 0 -1px 0 0;
  }

  #remove {
    display: none;
  }

  #list:hover #remove {
    display: block;
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
    font-family: 'GothamPro-Medium';
    margin-bottom: 35px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #2D453F;
    width: 90%;
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
  }

  .modal-content {
    border-radius: 12px;
    border: none;
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
      padding: 15px 32px 12px;
      border-radius: 9px;
      background-color: #F9F9F9;
      margin: 0 24px 16px 0;
      // align-items: center;
      align-items: flex-start;
    }

    li:hover {
      background-color: #F0F0F0;

      .date,
      .date:focus,
      input,
      input:focus,
      input:active,
      .selectResponsible,
      .selectResponsible select,
      .selectResponsible:active,
      .selectResponsible:focus {
        background-color: #F0F0F0;
      }
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
    width: 538px;
  }

  .desc {
    display: flex;
    flex-direction: row;
    width: fit-content;
    cursor: pointer;
    margin-right: 57px;
  }

  .desc::after {
    content: url('~@/assets/Select.png');
    transition: all 1s ease 0s;
    cursor: pointer;
    margin: auto;
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
      width: 231%;
      display: flex;
      justify-content: space-between;

      span {
        width: 54%;
        margin: 0;
      }
    }

    li:last-child {
      justify-content: center;

      input .form-control {
        padding: 0;
      }

      input .date {
        margin: 0;
        color: #828282;
        background-color: #F9F9F9;

        &:hover {
          background-color: #F0F0F0;
        }
      }
    }
  }

  .selectResponsible {
    display: flex;
    width: 185px;
    margin: 0 0 0 65px;
    background-color: #F9F9F9;

    &:hover {
      background-color: #F0F0F0;
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
    color: #828282;
    background-color: #F9F9F9;
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
    top: 0;
    left: -55%;
  }

  .select {
    width: 158px;
    border-radius: 10px;
    height: 36px;

    padding: 0;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    margin-right: 85px;
    letter-spacing: 0.15px;
    color: #828282;

    select {
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
      background-position: right 0.6em top 46%, 0 0;
      color: #fff;
    }
  }

  .gray {
    background-color: #C4C4C4 !important;

    select {
      background: url('~@/assets/Select.png') no-repeat;
      background-position: right 0.6em top 46%, 0 0;
      color: #2D453F;
    }
  }

  .form-control {
    border-radius: 10px;
    padding: 7px 13px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    background-color: #F9F9F9;
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
</style>