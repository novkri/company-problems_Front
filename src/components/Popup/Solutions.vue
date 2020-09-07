<template>
  <div class="modal-content" style="padding: 36px 300px;">
    <div class="modal-header" style="width: 130%;">
      <button type="button" id="close" class="close" @click="closeSolutions">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="modal-body">
      
      <h5 class="modal-title">Список решений</h5>
      <h6>Решения в работе</h6>
      <ul class="list-group">
        <li class="list-group-item" v-for="(sol, idx) in solutions" :key="idx">
          <!-- @input="setTitle($event.target.value)" ref="input" -->
          <input class="form-control" style="background-color: #F9F9F9;" @keyup.enter="editSolClick(sol.name, sol.id)" @blur="editSolClick(sol.name, sol.id)"
            v-model="sol.name" :class="{ 'form-control--error': sol.name.length < 6 ||  sol.name.length > 100 || sol.name.length == 0 }">
            {{sol.name.length}}
          <!-- <div class="error" v-if="error">{{error}} {{idx}} </div> -->
          <!-- <div>
            <span>{{idx+1}}. </span> -->
            <!-- @keyup.enter="editSolClick(sol.name, sol.id)" -->
            <!-- <span @focus="onFocus" @input="event => onInput(event, sol.name)" @blur="event => editSolution(event, sol.name, sol.id)" contenteditable style="padding: 10px;">{{sol.name}}</span>
            <button v-if="editBtn" @click="editSolClick(sol.name, sol.id)">ok</button>
          </div> -->
          <div class="icons" ref="iconInWork">
            <!-- {{sol.in_work}} -->
            <trash-icon @click="deleteSolution(sol.id)" size="1.5x" class="custom-class" style="margin-left: 30px;"></trash-icon>
            <img src="~@/assets/checkd.png" @click="changeinWork(sol)" v-if="sol.in_work">
            <check-icon size="1.5x" class="custom-class" style="color: #D0D0D0" v-else @click="changeinWork(sol)">
            </check-icon>
          </div>
        </li>
      </ul>
      <h6>Остальные решения</h6>
      <ul class="list-group">
        <li class="list-group-item" v-for="(notinworksol, idx) in solutionsOther" :key="idx">
          <!-- {{idx+1}}. {{notinworksol.name}} -->
          <input class="form-control" style="background-color: #F9F9F9;" @keyup.enter="editSolClick(notinworksol.name, notinworksol.id)" @blur="editSolClick(notinworksol.name, notinworksol.id)"
                  v-model="notinworksol.name">
                  <!-- <div class="error" v-if="error">{{error}}</div> -->
          <div class="icons" ref="iconInWork">
            <!-- {{notinworksol.in_work}} --> <!-- @click="deleteP(problem.id, problem.name)" data-toggle="modal" data-target="#popupDelete" -->
            <trash-icon @click="deleteSolution(notinworksol.id)" size="1.5x" class="custom-class" style="margin-left: 30px;"></trash-icon>
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
          <!-- ref="input" id="new-problem-title" v-model="name" -->
          <input type="text" class="form-control form-control--valid" placeholder="Предложите ваше решение..."
            v-model="solutionName">
          <!-- <div class="error" v-if="!$v.name.maxLength">Название проблемы должно быть не более
                  {{$v.name.$params.maxLength.max}} символов</div> -->
          <!-- <div class="error" v-if="!$v.name.minLength">{{error}}</div> -->

          <div class="error" v-if="error">{{error}}</div>
        </form>
        <button type="submit" class="btn btnMain" style="height: 34px; width: 34px; border-radius: 50px;"
          @click="addSolution(val)">
          <img src="@/assets/Vector.png" alt="send">
        </button>
      </div>
    </div>
  </div>
</template>



<script>
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
      progress: '',
      editBtn: false,
      isDisabled: true,

    }),
    components: {
      CheckIcon,
      TrashIcon
    },

    computed: {
      ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404']),
    },
    methods: {

      // onInput(event) {
      //   // const value = event.target.innerText;
      //   // this.content[index].value = value;
      //   let name = event.target.innerText
      //   // if (name.length < 6) {
      //   //   console.log(event);
      //   //   console.log(event.target);
      //   //   event.target.classList.add('error')
      //   // }
      //   // this.editBtn = true
      //   // console.log(name, event.target);
      // },
      onFocus() {
        this.editBtn = true
      },
      async editSolution(event, name, id) {
        // const value = event.target.innerText;
        // this.content[index].value = value;
        name = event.target.innerText
        // console.log(event, name, id);

        await this.$store.dispatch('editSolution', {name, id})
        this.editBtn = false
      },
      async editSolClick(name, id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editSolution', {name, id})
      },

      closeSolutions() {
        this.$emit('closeSolutions')
      },

      async changeinWork(obj) {
        obj.in_work = !obj.in_work
        // console.log(obj, this.solutions, this.solutionsOther);

        await this.$store.dispatch('changeinWork', obj)
        // if (obj.in_work == true) {
        //   this.solutions.push(obj)
        //   this.solutionsOther.splice(this.solutionsOther.indexOf(obj), 1);
        // } else {
        //   this.solutionsOther.push(obj)
        //   this.solutions.splice(this.solutions.indexOf(obj), 1);
        // }
      },


      async addSolution(obj) {
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
      async deleteSolution(id) {
        console.log('удаление решения: ', id);
        await this.$store.dispatch('deleteSolution', id)

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

  input:active, input:focus {
    border: 2px solid #92D2C3;
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
    background-color: #F9F9F9;
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
</style>