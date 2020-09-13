<template>
  <div>
    <div class="header row">
      <div  class="col-5">
        <img src="@/assets/tasks.png">
        Задачи:
      </div>
      <div class="subt" style="margin-right: 57px;">Статус выполнения</div>
      <div class="subt" style="margin-right: 57px;">Срок исполнения</div>
      <div class="subt">Исполнитель</div>
    </div>
    <div class="container row">
      <ol>
        <li id="list">
          <!-- :class="[solution.status == 'Выполнено' ? 'greenTitle' : '']" -->
          <div class="task-title greenTitle col-5">
            Задача 1
          </div>
          <!-- :class="[solution.status == 'Выполнено' ? 'green' : 'gray']" -->
          <div class="select gray" style="position: relative;" ref="select">
            <!-- v-model="solution.status"  @change="changeStatusTask(solution.status, solution.id)" -->
            <select class="form-control">
              <option value="К исполнению" default>
                К исполнению</option>
              <option value="В процессе">
                В процессе</option>
              <option value="Выполнено">
                Выполнено</option>
              <option value="">Отсутсвует</option>
            </select>
          </div>
          <div class="dateDiv">
            <!-- v-model="solution.deadline" @change="changeDeadlineTask(solution.deadline, solution.id)" -->
            <input type="date" id="start" name="trip-start" class="date" onkeypress="return false">
          </div>
          <div class="selectResponsible">
            <user-icon size="1.5x" class="custom-class" style="margin: 0 10px 0 0"></user-icon>
            <!--  v-model="solution.executor_id" @change="selectExecutorTask(solution.id)" -->
            <!-- width: 177px; -->
            <select class="form-control" style="height: fit-content; padding: 0;">
              <!--  v-for="(u, i) in allUsers" :key="i" :value="u.id" -->
              <!--  {{u.name.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w).join(' ')}} -->
              <option default >
                Выбрать
              </option>
              <option>
                Пупкин В.И.
              </option>
            </select>
          </div>
          <div style="width: 54px" id="close">
            <!-- @click="deleteTask(solution)" data-toggle="modal" data-target="#popupRemoveFromWOrk" -->
            <button type="button" class="close" id="remove" style="margin: auto;">
              <!-- <span aria-hidden="true">&times;</span> -->
              <trash-icon size="1x" class="custom-class"></trash-icon>
            </button>
          </div>
        </li>
        <li>
          <div v-if="addNotClicked">
            <plus-icon size="1.5x" class="custom-class" id="plus" @click.prevent="displayInput" style="color: #92D2C3;">
            </plus-icon>
            <!-- <input type="text" placeholder="Добавить задачу" class="addTask"> -->
            <span @click.prevent="displayInput" style="margin-left: 16px">Добавить задачу</span>
          </div>
          <div v-else class="inputAdd">
            <input type="text" placeholder="Добавить задачу" class="addTask" @input="enableB">
            <div class="selectsInputAdd">
              <!-- <span @click.prevent="displayInput">Добавить задачу</span> -->
              <div class="dateDiv">
                <!-- v-model="solution.deadline" @change="changeDeadlineTask(solution.deadline, solution.id)" -->
                <input type="date" id="start" name="trip-start" class="date" onkeypress="return false">
              </div>
              <div class="selectResponsible">
                <user-icon size="1.5x" class="custom-class" style="margin: 0 10px 0 0"></user-icon>
                <!--  v-model="solution.executor_id" @change="selectExecutorTask(solution.id)" -->
                <!-- width: 177px; -->
                <select class="form-control" style="height: fit-content; padding: 0;">
                  <!--  v-for="(u, i) in allUsers" :key="i" :value="u.id" -->
                  <!--  {{u.name.split(/\s+/).map((w,i) => i ? w.substring(0,1).toUpperCase() + '.' : w).join(' ')}} -->
                  <option default>
                    Выбрать
                  </option>
                </select>
              </div>
              <div style="width: 20px">
                <!-- @click="deleteTask(solution)" data-toggle="modal" data-target="#popupRemoveFromWOrk" -->
                <button type="button" class="close" id="remove" style="margin: auto;">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>

        </li>
      </ol>
      <div type="button" class="btnsAddTask" v-if="!addNotClicked">
        <button id="addBtn" class="btn btnPink" @click.prevent="addTask" :disabled="!enableBtn">Добавить задачу</button>
        <span @click.prevent="addNotClicked = true">Отмена</span>
      </div>
    </div>
  </div>

</template>

<script>
  import {
    UserIcon,
    PlusIcon,
    TrashIcon
  } from 'vue-feather-icons'
  export default {
    name: 'tasks',
    props: ['val'],
    data: () => ({
      addNotClicked: true,
      enableBtn: false
    }),
    components: {
      UserIcon,
      PlusIcon,
      TrashIcon
    },
    computed: {
      // ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404', 'allUsers']),
    },
    methods: {
      enableB() {
        this.enableBtn = true
        document.getElementById('addBtn').classList.remove('btnPink')
        document.getElementById('addBtn').classList.add('btnGren')

        
      },
      addTask() {
        console.log('добавить задачу запрос');
        this.addNotClicked = true
      },
      displayInput() {
        this.addNotClicked = false
      },
      async changeStatusTask(status, id) {
        await this.$store.dispatch('changeStatusTask', {
          status,
          id
        })
      },
      async changeDeadlineTask(deadline, id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('changeDeadlineTask', {
          deadline,
          id
        })
      },
      async selectExecutorTask(id) {
        let uid = event.target.value
        await this.$store.dispatch('changeExecutorTask', {
          id,
          uid
        })
      },
      async deleteTask(obj) {
        console.log(obj);
        // this.solutionIdRemove = obj.id
        // this.openRemoveFromWork = true
        // await this.$store.dispatch('changeinWork', {in_work: false, id: obj.id})
      },
    }
  }
</script>

<style scoped lang="scss">
  #remove {
    display: none;

    span {
      margin: 0;
      color: #848484;
      font-size: 26px;
    }
  }

  #list:hover #remove {
    display: flex;
  }

  .header {
    margin: 0;
    padding-top: 30px;
    max-width: inherit;
    width: -webkit-fill-available;
    padding-left: 42px;
    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #333333;
    font-style: normal;
    font-weight: normal;
    background-color: #F6F6F6;
  }

  .container {
    margin: 0;
    padding-top: 12px;
    max-width: inherit;
    width: -webkit-fill-available;
    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    font-style: normal;
    font-weight: normal;
    background-color: #F6F6F6;
  }

  ol {
    padding: 0;
    padding-left: 60px;
    width: 100%;
    padding-right: 42px;
    margin-bottom: 0;
  }

  li {
    display: flex;
    align-items: flex-start;
    padding-bottom: 18px;
    padding-top: 18px;
    border-bottom: 1px solid #DEDEDE;
  }

  li:last-child {
    border-bottom: none;
  }

  div {
    padding: 0;
  }

  svg {
    color: #AFAFAF;
    cursor: pointer;
    margin: 0 -1px 0 0;
  }



  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 36px 30px 37px 62px;
  }

  .modal-body {
    padding: 0;
  }



    option {
      background-color: #F6F6F6;
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

  .selectResponsible {
    display: flex;
    background-color: #F6F6F6;
    margin: 0 10px;

    padding-left: 10px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-radius: 10px;
    width: 174px;
    // margin-left: 13px;
    // margin-right: -31px;
    // padding-left: 10px;
    background-color: #f6f6f6;
    // padding-bottom: 5px;
    // padding-top: 5px;
    // border-radius: 10px;

    select {
      // background: url('~@/assets/Select.png') no-repeat;
      // background-position: right 0.5em top 46%, 0 0;
      margin: 0;
      // width: 100%;
      width: 142px;
      background-color: #f6f6f6;
    }
  }

  .selectResponsible:hover {
    background-color: #E0E0E0;
    select {
      background-color: #E0E0E0;
    }
  }

  .selectResponsible:focus,
  .selectResponsible:active {
    background-color: #4EAD96;
    color: #fff;
    outline: none;
        select {
      background-color: #4EAD96;
    }
  }


  // .dateDiv {
  //   margin-left: 35px;
  // }

  .date {
    outline: none;
    width: 200px;
    border: none;
    position: relative;
    height: 81%;
    color: #828282;
    padding-left: 48px;
    padding-bottom: 5px;
    padding-top: 5px;
    border-radius: 10px;
    width: 168px;
    background-color: #f6f6f6;
    margin: 0 20px;
  }

  .date:hover {
    background-color: #E0E0E0;
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

  input[class="date"]::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendar.png') 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    left: -95%;
    width: 100%;
    top: 20%;
  }

  input[class="date"]:focus::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendarW.png') 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    position: absolute;
    left: -95%;
    width: 100%;
    top: 20%;
  }

  select {
    appearance: none;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    height: fit-content;
    margin-right: 30px;
    width: 163px;
  }

  .select {
        margin-right: 30px;
    border-radius: 10px;
    height: 36px;
    width: 156px;
    padding: 0;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    letter-spacing: 0.15px;
    color: #828282;
    // margin-left: -11px;

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
    }
  }

  .green {
    background-color: #4EAD96 !important;
    width: 156px;

    select {
      background: url('~@/assets/SelectWhite.png') no-repeat;
      background-position: right 0.6em top 46%, 0 0;
      color: #fff;
    }
  }

  .gray {
    background-color: #E0E0E0 !important;
    width: 156px;

    select {
      background: url('~@/assets/Select.png') no-repeat;
      background-position: right 0.6em top 46%, 0 0;
      color: #2D453F;
    }

  }

  .task-title {
    // width: 477px;
    // width: 84%;
    margin-right: 15px;
  }

  .task-title::before {
    // content: '*';
    position: relative;
    top: -1px;
    right: 2%;
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    -moz-border-radius: 7.5px;
    -webkit-border-radius: 7.5px;
    border-radius: 7.5px;
    background-color: #BDBDBD;

  }

  .greenTitle::before {
    background-color: #4EAD96;
  }

  .inputAdd {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .addTask {
    border: none;
    background-color: #fff;
    color: #828282;
    margin-left: -16px;
    outline: none;

    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 9px 0 0 9px;
    padding: 10px 0 10px 50px;
    color: #4F4F4F;
    caret-color: #4EAD96;
    width: 43%;
    border-right: 1px solid #EEEEEE;
  }

  .selectsInputAdd {
    background-color: #fff;
    outline: none;
    display: flex;
    box-shadow: 9px 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0 9px 9px 0;
    padding: 10px 0 10px 153px;
    width: 57%;
  }

  
  .btnsAddTask {
    padding-left: 50px;
    background-color: #fff;
    width: 100%;
    padding-top: 19px;

    span {
      font-family: 'GothamPro';
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #4F4F4F;
      padding-bottom: 3px;
    }
    span:hover {
      border-bottom: 1px solid #000;
    }
  }
  .btn {
    margin-right: 17px;
    border-radius: 9px;
    width: 182px;
    padding: 11px 18px;

    font-family: 'GothamPro-Medium';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #FFFFFF;
  }
  .btnPink {
    background: #FFD3D3;
  }
  .btnGren {
    background: #92D2C3;
  }







 @media (max-width: 1200px) {
  .subt {
    display: none;
  }
  #list {
    display: flex;
    flex-direction: initial;
    flex-wrap: wrap;
    justify-content: space-between;
    div {
      margin-bottom: 30px;
    }
    #close {
      order: 3;
    }
    .select {
      order: 2;
    }
    .dateDiv {
      order: 4;
    }
    .selectResponsible {
      order: 5;
    }
    .list-item {
      order: 1;
    }
  }

  .task-title {
    flex: 0 1; 
    //  max-width: initial;
    min-width: fit-content;
  }
  .selectsInputAdd {
    display: none;
  }
  .addTask {
    border-radius: 9px;
    width: 100%;
  }
}
</style>