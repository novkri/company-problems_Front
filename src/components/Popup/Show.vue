<template>
  <div class="popup-show" >
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
              <h6>Прогресс решения {{(1/4)*100}}%</h6> 
              <!-- прогресс решения вычислять в computed -->
              <!-- <star-icon size="1.5x" class="custom-class"></star-icon> -->
              <div class="icons">
                <img src="~@/assets/star.png">
                <span>95</span>
              </div>
              
            </div>

            <div>
              <span class="subtitle">Решения в работе:</span>
              <ol>
                <li>
                  <div class="list-item">
                    <div class="desc" ref="desc" @click="displayTasks"><span>1. dummy 1</span></div>
                    <ul class="tasks" ref="hiddenList" v-if="showTasks">
                      <li>Задача1</li>
                      <li>Задача2</li>
                      <li>+ Добавить задачу</li>
                    </ul>
                  </div>

                  <div class="select">
                    <select v-model="selected" class="form-control" :style="{'background-color': selected == 'Выполнено' ? '#4EAD96' : '#C4C4C4', 'color': selected == 'Выполнено' ? '#FFFFFF' : '#2D453F'}" 
                      id="exampleFormControlSelect1">
                      <option>В работе</option>
                      <option>Выполнено</option>
                    </select>
                  </div>

                  <input type="date" id="start" name="trip-start" class="date" value="2018-07-22">

                  <button type="button" class="close" style="margin: 0 -1rem -1rem auto;">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </li>
                <li>dummy 2</li>
                <li>dummy 3</li>
              </ol>

              <button type="button" class="btn btnMain" @click.prevent="showSolutions(val)" data-toggle="modal"
                data-target="#popupSolutions"><span>Посмотреть/Добавить решение</span></button>
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
                <li class="list-group-item" >
                  1. Решение 1
                  <div class="icons">
                    <!-- <check-icon size="1.5x" class="custom-class"></check-icon> -->
                    <!-- <edit-icon size="1x" class="custom-class" @click="edit(problem)" data-toggle="modal" data-target="#popupEdit"
                      style="margin-left: 0px;"></edit-icon> -->
                      <img src="~@/assets/checkd.png">
                  </div>
                </li>
              </ul>
            <h6>Прочие решения</h6>
             <ul class="list-group">
                <li class="list-group-item" >
                  1. Решение 1
                  <div class="icons">
                    <check-icon size="1.5x" class="custom-class" style="color: #D0D0D0"></check-icon>
                  </div>
                </li>
              </ul>
              <br>

            <h6>Добавить решение</h6>
            <!-- @keyup.enter="addProblem()"  -->
            <div class="new-solution">
              <form class="form-group">
                <!-- ref="input" id="new-problem-title" v-model="name" -->
                <input type="text" class="form-control form-control--valid"
                placeholder="Предложите ваше решение..." >
                  <!-- <div class="error" v-if="!$v.name.maxLength">Название проблемы должно быть не более
                  {{$v.name.$params.maxLength.max}} символов</div> -->
                  <!-- <div class="error" v-if="!$v.name.minLength">{{error}}</div> -->

                  <!-- <div class="error" v-if="error">{{error}}</div> -->
              </form>
              <!-- @click="addProblem()" -->
              <button type="submit" class="btn btnMain" style="height: 34px; width: 34px; border-radius: 50px;">
                <img src="@/assets/Vector.png" alt="send">
              </button>
            </div>
          </div>
        </div>
            

      </div>
    </div>

    <!-- <PopupSolutions v-if="openSolutions" :open="openSolutions" :solutions="solutions" /> -->
  </div>
</template>

<script>
  // import PopupSolutions from '@/components/Popup/Solutions'
  import { CheckIcon } from 'vue-feather-icons'
  // import { StarIcon } from 'vue-feather-icons'

  export default {
    name: 'popup',
    props: ['open', 'val'],
    data: () => ({
      selected: '',
      openSolutions: false,
      solutions: {},
      showTasks: false
    }),
    components: {
      CheckIcon,
      // StarIcon
      // PopupSolutions,
    },
    methods: {
      displayTasks() {
        this.showTasks = !this.showTasks
        if (this.showTasks) {
          this.$refs.desc.classList.add('clicked')
        } else {
          this.$refs.desc.classList.remove('clicked')
        }
      },
      showSolutions(obj) {
        this.openSolutions = true
        // this.solutions = {...obj, test: 'test'}
        //передать все решения по проблеме
        // console.log(this.solutions);
        console.log(obj);
      }
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
  }

  h6 {
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #2D453F;
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

    li {
      margin-bottom: 6px;
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
    font-family: 'GothamPro';
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

    select {
      width: 158px;
      appearance: none;
      background: url('~@/assets/Select.png') no-repeat #C4C4C4;
      background-position: right 1.2em top 50%, 0 0;
      outline: 0;
    }
    option {
      background-color: #C4C4C4;
      color: #2D453F;
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