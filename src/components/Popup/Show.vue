<template>
  <div class="popup-show">
    <div class="modal fade" id="popupShow" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered" :style="{'width': openSolutions ? '1434px' : '1096px'}">
        <div class="modal-content" v-if="!openSolutions">
          <div class="modal-header">
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="subtitle">
              <h5 class="modal-title">{{val.name}}</h5>
              <h6 v-if="progress !== ''">Прогресс решения {{progress}}%</h6>
              <h6 v-else>Прогресс решения 0%</h6>
              <div class="icons">
                <img src="~@/assets/star.png">
                <span>95</span>
              </div>

            </div>

            <div>
              <span class="subtitle">Решения в работе:</span>
              <ol>
                <li v-for="(solution, idx) in solutions" :key="idx">
                  <div class="list-item">
                    <div class="desc" ref="desc" @click="displayTasks"><span>{{idx+1}}.{{solution.name}}</span></div>
                    <ul class="tasks" ref="hiddenList" v-if="showTasks">
                      <li>Задача1</li>
                      <li>Задача2</li>
                      <li>+ Добавить задачу</li>
                    </ul>
                  </div>

                  <div class="select" style="position: relative;">
                    <select v-model="solution.status" class="form-control"
                      :style="{'background-color': solution.status == 'Выполнено' ? '#4EAD96' : '#C4C4C4', 'color': solution.status == 'Выполнено' ? '#fff' : '#2D453F' }"
                      id="exampleFormControlSelect1" @change="changeStatus">

                      <option value="В работе"
                        :style="{'background-color': solution.status == 'Выполнено' ? '#4EAD96' : '#C4C4C4', 'color': solution.status == 'Выполнено' ? '#fff' : '#2D453F' }">
                        В работе</option>
                      <option value="Выполнено"
                        :style="{'background-color': solution.status == 'Выполнено' ? '#4EAD96' : '#C4C4C4', 'color': solution.status == 'Выполнено' ? '#fff' : '#2D453F' }">
                        Выполнено</option>
                    </select>
                  </div>
                  <!-- :value="new Date(solution.updated_at).toISOString().split('T')[0] -->
                  <input type="date" id="start" name="trip-start" class="date" v-model="formData">
                  <!-- {{solution.updated_at}} -->
                  <!-- {{new Date(solution.updated_at).toISOString().split('T')[0]}} -->
                  {{formData}}
                  {{solution.status}}
                  <button type="button" class="close" style="margin: 0 -1rem -1rem auto;"
                    @click="solution.in_work = false">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </li>

              </ol>

              <button type="button" class="btn btnMain" @click.prevent="showSolutions(val)" data-toggle="modal"
                data-target="#popupSolutions"><span>Посмотреть/Добавить решение</span></button>

              {{solutions}}
            </div>
          </div>
        </div>


        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
        <div class="modal-content" v-else style="padding: 36px 300px;">
          <div class="modal-header" style="width: 130%;">
            <button type="button" id="close" class="close" @click="openSolutions = false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <h5 class="modal-title">Список решений</h5>
            <h6>В работе</h6>
            <ul class="list-group">
              <li class="list-group-item" v-for="(sol, idx) in solutions" :key="idx">
                <input @input="setTitle($event.target.value)" ref="input" class="form-control" id="new-problem-title"
                  v-model="sol.name">
                {{idx+1}}. {{sol.name}}
                <div class="icons" ref="iconInWork">
                  <img src="~@/assets/checkd.png" v-if="!inWork" @click="changeinWork(0)">
                  <check-icon size="1.5x" class="custom-class" style="color: #D0D0D0" v-if="inWork"
                    @click="changeinWork(0)"></check-icon>
                </div>
              </li>
            </ul>
            <h6>Прочие решения</h6>
            <ul class="list-group">
              <li class="list-group-item" v-for="(notinworksol, idx) in solutionsOther" :key="idx">
                {{idx}}. {{notinworksol.name}}
                <div class="icons" ref="iconInWork">
                  <img src="~@/assets/checkd.png" v-if="!inWork" @click="changeinWork(1)">
                  <check-icon size="1.5x" class="custom-class" style="color: #D0D0D0" v-if="inWork"
                    @click="changeinWork(1)"></check-icon>
                </div>
              </li>
            </ul>
            <br>
            {{solutionsOther}}

            <h6>Добавить решение</h6>
            <!-- @keyup.enter="addProblem()"  -->
            <div class="new-solution">
              <form class="form-group">
                <!-- ref="input" id="new-problem-title" v-model="name" -->
                <input type="text" class="form-control form-control--valid" placeholder="Предложите ваше решение..."
                  v-model="solutionName">
                <!-- <div class="error" v-if="!$v.name.maxLength">Название проблемы должно быть не более
                  {{$v.name.$params.maxLength.max}} символов</div> -->
                <!-- <div class="error" v-if="!$v.name.minLength">{{error}}</div> -->

                <!-- <div class="error" v-if="error">{{error}}</div> -->
              </form>
              <button type="submit" class="btn btnMain" style="height: 34px; width: 34px; border-radius: 50px;"
                @click="addSolution(val)">
                <img src="@/assets/Vector.png" alt="send">
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
  import {
    CheckIcon
  } from 'vue-feather-icons'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'popup',
    props: ['open', 'val'],
    data: () => ({
      // selected: '',
      openSolutions: false,
      showTasks: false,
      solutionName: '',
      inWork: true,
      formData: '',
      progress: ''

    }),
    components: {
      CheckIcon,
    },

    // async mounted() {
    //   console.log(this.val.id);

    // //   // await this.$store.dispatch('getSolutions', this.val.id) //2
    // },
    computed: {
      ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404']),
      selected: {
        get() {
          return this.value
        },
        set(v) {
          this.$emit('input', v)
        }
      },
    },
    methods: {
      changeStatus(event) {
        // console.log(event);
        this.$emit('input', event.target.value);
        console.log(this.solutions.length, this.solutions.filter(s => s.status == 'Выполнено').length);
        if (this.solutions.filter(s => s.status == 'Выполнено').length !== 0) {
          this.progress = (this.solutions.filter(s => s.status == 'Выполнено').length / this.solutions.length) * 100
          // return progress
          console.log(this.progress);
        }
      },
      displayTasks() {
        this.showTasks = !this.showTasks
        if (this.showTasks) {
          this.$refs.desc.classList.add('clicked')
        } else {
          this.$refs.desc.classList.remove('clicked')
        }
      },
      changeinWork(i) {
        console.log(i);
        this.inWork = !this.inWork
        if (this.inWork) {
          this.$refs.iconInWork.classList.add('in-work')
        } else {
          this.$refs.iconInWork.classList.remove('not-in-work')
        }
      },
      async showSolutions(obj) {
        this.openSolutions = true
        console.log('showSolutions');
        console.log(obj.id);
      },

      async addSolution(obj) {
        console.log(this.solutionName, obj.id);
        await this.$store.dispatch('postSolution', {
          problemId: obj.id,
          name: this.solutionName
        }).then(() => {
          if (!this.error) {
            this.solutionName = ''
            //   document.getElementById('close').click()
          }

        })
      },
    }
  }
</script>

<style scoped lang="scss">
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
    width: 82%;

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
    margin-top: 12px;
    transition: all 1s ease 0s;
    // list-style-image: url("~@/assets/listStyleFirst.png");
    list-style: none;

    li {
      // list-style-image: url("~@/assets/listStyleFirst.png");
      margin-bottom: 10px;
      display: list-item;
    }

    li::before {
      // content: url("~@/assets/listStyleFirst.png");

    }
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
    flex-direction: column;
    // font-family: 'GothamPro';
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 11px;
    color: #000000;
    text-align: center;
    cursor: pointer;
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
    // &::after {
    //   content: ">";
    //   color: #666;
    //   -webkit-transform: rotate(90deg);
    //   -moz-transform: rotate(90deg);
    //   -ms-transform: rotate(90deg);
    //   transform: rotate(90deg);
    //   right: 8px; 
    //   top:2px;
    //   padding: 0 0 2px;
    //   // border-bottom: 1px solid #ddd;
    //   font-weight: 900;
    //   position: absolute;
    //   pointer-events: none;
    //   font-family: "GothamPro-Medium";
    // }

    select {
      width: 158px;
      appearance: none;
      background: url('~@/assets/Select.png') no-repeat;
      background-position: right 0.6em top 50%, 0 0;
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

  .form-control {
    border-radius: 10px;
    padding: 7px 13px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
  }

  .list-group-item {
    border-radius: 7px;
    // width: 840px;
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
    // padding: 1.08rem 1.25rem;
    padding: 18px auto 18px 32px;

    &:last-child {
      margin-bottom: 43px;
    }
  }

  .new-solution {
    display: flex;
  }
</style>