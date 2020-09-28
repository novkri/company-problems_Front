<template>
  <div>
    <div class="filters">
      Фильтрация:
    </div>
    <h2>Список всех проблем в компании</h2>
    <div class="container">
      <div id="accordion">
        <div class="card" id="card" v-for="(problem, idx) in paginatedData" :key="idx">
          <div class="card-header row" :id="'heading'+problem.id">
            <div class="name">
              <button class="btn btn-link collapsed" @click="onClickShow(problem)" data-toggle="collapse"
                :data-target="'#collapseOne'+problem.id" aria-expanded="false"
                :aria-controls="'collapseOne'+problem.id">
                <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
              </button>
              <h5 class="mb-0">
                <p> {{ problem.name }} </p>
              </h5>
              <clock-icon size="1.5x" class="custom-class"></clock-icon>
              <file-text-icon size="1.5x" class="custom-class"></file-text-icon>
            </div>

            <div class="icons">
              <div class="trash-icon">
                <trash-icon size="1.3x" class="custom-class" style="margin: auto;"
                  @click="deleteP(problem.id, problem.name)" data-toggle="modal" data-target="#popupDelete">
                </trash-icon>
              </div>
            </div>

          </div>

          <div :id="'collapseOne'+problem.id" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
              <div class="card" style="padding-top: 0;" v-if="mounted">
                <PopupShow v-if="openShow" :val="paramsModal" />
                <!-- + 4 accordions -->
                <div class="row" style="display: flex; flex-direction: row; margin-bottom: 8px;">
                  <!-- Задачи -->
                  <div class="accordion col-9" id="tasks">
                    <div class="card">
                      <div class="card-header" id="headingTasks" style="width: 100%;">
                        <div class="name">
                          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTasks"
                            aria-expanded="false" aria-controls="collapseTasks">
                            <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                          </button>
                          <h5 class="mb-0">
                            Задачи
                          </h5>
                        </div>
                      </div>

                      <div id="collapseTasks" class="collapse show" aria-labelledby="headingTasks" data-parent="#tasks"
                        style="width: 100%;">
                        <div class="card-body" v-if="solutions[0]">
                          <Tasks :val="solutions" />
                        </div>
                      </div>
                    </div>


                  </div>

                  <!-- План -->
                  <div class="accordion col-3" id="plan">
                    <div class="card">
                      <div class="card-header" id="headingPlan" style="width: 100%;">
                        <div class="name">
                          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapsePlan"
                            aria-expanded="false" aria-controls="collapsePlan">
                            <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                          </button>
                          <h5 class="mb-0">
                            План решения
                          </h5>
                        </div>
                      </div>

                      <div id="collapsePlan" class="collapse show" aria-labelledby="headingPlan" data-parent="#plan"
                        style="width: 100%;">
                        <div class="card-body">
                          <textarea cols="30" rows="10" :ref="'textarea_plan'+problem.id"
                            @focus="event => onFocusTextarea(event)"
                            @blur="event => {onBlurTextarea( event, 'plan')}"></textarea>
                          <div class="hidden">
                            <button class="input-btn" @mousedown="event => {editPlan(plan, event)}">
                              <check-icon size="1x" class="custom-class"></check-icon>
                            </button>
                            <div @mousedown="event => onClear(event, problem.id, 'plan')">
                              <button class="input-btn">
                                <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row" style="display: flex; flex-direction: row; margin-bottom: 8px;">
                  <!-- Команда -->
                  <div class="accordion col-9" id="results">
                    <div class="card">
                      <div class="card-header" id="headingResults" style="width: 100%;">
                        <div class="name">
                          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseResults"
                            aria-expanded="false" aria-controls="collapseResults">
                            <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                          </button>
                          <h5 class="mb-0">
                            Команда, опыт, результат
                          </h5>
                        </div>
                      </div>

                      <div id="collapseResults" class="collapse" aria-labelledby="headingResults" style="width: 100%;"
                        data-parent="#results">
                        <div class="card-body row" style="flex-direction: row;">
                          <div class="col-4" style="flex-direction: column;">
                            <textarea cols="30" rows="10" :ref="'textarea_team'+problem.id"
                              @focus="event => onFocusTextarea(event)"
                              @blur="event => {onBlurTextarea(event, 'team')}"></textarea>
                            <div class="hidden">
                              <button class="input-btn" @mousedown="event => {editTeam(team, event)}">
                                <check-icon size="1x" class="custom-class"></check-icon>
                              </button>
                              <div @mousedown="event => onClear(event, problem.id, 'team')">
                                <button class="input-btn">
                                  <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                                </button>
                              </div>
                            </div>



                          </div>
                          <div class="col-4" style="flex-direction: column;">
                            <!-- v-model="solution.name"  :ref="'textarea' + solution.id" -->
                            <!-- exprnce, -->
                            <textarea cols="30" rows="10" :ref="'textarea_exp'+problem.id"
                              @focus="event => onFocusTextarea(event)"
                              @blur="event => {onBlurTextarea( event, 'exp')}"></textarea>
                            <div class="hidden">
                              <button class="input-btn"
                                @mousedown="event => {editExp(solution.name, solution.id, event)}">
                                <check-icon size="1x" class="custom-class"></check-icon>
                              </button>
                              <div @mousedown="event => onClear(event, problem.id, 'exp')">
                                <button class="input-btn">
                                  <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="col-4" style="flex-direction: column;">
                            <textarea cols="30" rows="10" :ref="'textarea_result'+problem.id"
                              @focus="event => onFocusTextarea(event)"
                              @blur="event => {onBlurTextarea(event, 'result')}"></textarea>
                            <div class="hidden">
                              <button class="input-btn" @mousedown="event => {editResult(result, event)}">
                                <check-icon size="1x" class="custom-class"></check-icon>
                              </button>
                              <div @mousedown="event => onClear(event, problem.id, 'result')">
                                <button class="input-btn">
                                  <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                                </button>
                              </div>
                            </div>


                          </div>
                          <button class="btn btnMain">Проблема решена</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Подразделения -->
                  <div class="accordion col-3" id="groups">
                    <div class="card">
                      <div class="card-header" id="headingGroups" style="width: 100%;">
                        <div class="name">
                          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseGroups"
                            aria-expanded="false" aria-controls="collapseGroups">
                            <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                          </button>
                          <h5 class="mb-0">
                            Направить
                            <!-- проблему  -->
                            в подразделения
                          </h5>
                        </div>
                      </div>

                      <div id="collapseGroups" class="collapse" aria-labelledby="headingGroups" style="width: 100%;"
                        data-parent="#groups">
                        <div class="card-body">
                          <div class="custom-control custom-checkbox" v-for="(group, idx) in groups" :key="idx">
                            <input type="checkbox" class="custom-control-input" :id="'groupCheck'+group.id"
                              :value="group.id" v-model="checkedGroups">
                            <label class="custom-control-label" :for="'groupCheck'+group.id">{{group.name}}</label>
                          </div>
                          {{checkedGroups}}
                          <button class="btn btnMain" @click="sendToGroup(problem.id, checkedGroups)">Направить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <half-circle-spinner :animation-duration="1500" :size="50" color="#92D2C3" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <hr>
    <div class="footer">
      <button type="button" class="btn btnMain" @click="create" data-toggle="modal" data-target="#popupCreate">
        <plus-icon size="1.5x" class="custom-class"></plus-icon>
        <span>Предложить проблему</span>
      </button>

      <div class="pagination">
        <nav>
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" @click="prevPage" aria-label="Previous" :class="{'block' : pageNumber==0}">
                <chevron-left-icon size="1.5x" class="custom-class"></chevron-left-icon>
              </a>
            </li>
            <li class="page-item">
              <span v-if="pageNumber ==0">1-25</span>
              <span v-else>{{(25 * pageNumber)+1}}-{{(25 * pageNumber)+26}}</span>
            </li>
            <li class="page-item">
              <a class="page-link" @click="nextPage" aria-label="Next" :class="{'block' : pageNumber >= pageCount - 1}">
                <chevron-right-icon size="1.5x" class="custom-class"></chevron-right-icon>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>



    <PopupCreate v-if="openCreate" @createProblem="createProblem(param = $event)" />
    <PopupDelete v-if="openDelete" :val="paramsModal" @deleteProblem="deleteProblem(param = $event)" />
  </div>

</template>

<script>
  import PopupCreate from '@/components/PopupProblems/Create'
  // import PopupEdit from '@/components/Popup/Edit'
  import PopupDelete from '@/components/PopupProblems/Delete'
  import PopupShow from '@/components/Solutions/ShowSolution'
  import Tasks from '@/components/Solutions/Tasks/Tasks'

  import {
    HalfCircleSpinner
  } from 'epic-spinners'

  import {
    mapGetters
  } from 'vuex'
  import {
    TrashIcon,
    PlusIcon,
    ChevronUpIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    FileTextIcon,
    ClockIcon,
    CheckIcon,
  } from 'vue-feather-icons'

  export default {
    name: "problems",
    data: () => ({
      openCreate: false,
      // openEdit: false,
      openDelete: false,
      openShow: false,
      mounted: false,

      paramsModal: {},
      pageNumber: 0,
      size: 25,

      checkedGroups: [],

      currentTextarea: '',
    }),
    components: {
      PopupCreate,
      // PopupEdit,
      PopupDelete,
      PopupShow,
      Tasks,

      TrashIcon,
      PlusIcon,
      ChevronRightIcon,
      ChevronLeftIcon,
      ChevronUpIcon,
      FileTextIcon,
      ClockIcon,
      CheckIcon,

      HalfCircleSpinner
    },

    async mounted() {
      await this.$store.dispatch('getProblems')
      await this.$store.dispatch('getGroups')
      await this.$store.dispatch('getAllUsers')
    },
    watch: {
      error404() {
        if (this.error404) {
          this.$toast.error(this.error404);
        }
      },
    },
    computed: {
      ...mapGetters(['problems', 'error', 'error404', 'allUsers', 'currentSolution', 'solutions', 'groups']),

      pageCount() {
        let l = this.problems.length,
          s = this.size;
        return Math.ceil(l / s);
      },
      paginatedData() {
        const start = this.pageNumber * this.size,
          end = start + this.size;
        return this.problems.slice(start, end);
      }
    },

    methods: {
      nextPage() {
        this.pageNumber++;
      },
      prevPage() {
        if (this.pageNumber > 0) {
          this.pageNumber--;
        }
      },

      //
      create() {
        this.openCreate = true
        this.$store.commit('setError', '')
      },

      edit(obj) {
        this.openShow = false
        // this.openEdit = true
        this.paramsModal = obj
        this.$store.commit('setError', '')
      },
      // async editProblem() {
      //   window.location.reload(true)
      // },

      deleteP(id, name) {
        this.openShow = false
        this.openDelete = true
        this.paramsModal = {
          id,
          name
        }
      },
      async deleteProblem(param) {
        await this.$store.dispatch('deleteProblem', param)
      },

      async likeProblem(id) {
        await this.$store.dispatch('problemLike', id)
      },

      async onClickShow(problem) {
        document.getElementById('heading' + problem.id).classList.contains('collapsed-header') ? document
          .getElementById('heading' +
            problem.id).classList.remove('collapsed-header') : document.getElementById('heading' + problem.id)
          .classList.add('collapsed-header')


        if (this.paramsModal !== problem) {
          this.openDelete = false
          this.openShow = true
          this.paramsModal = problem

          this.$store.commit('setError', '')
          await this.$store.dispatch('getSolutions', problem.id).then(response => {
            this.mounted = true
            this.$store.dispatch('getTasks', response.id)
            this.$store.dispatch('getCurrentSolution', '')
            this.$store.dispatch('getCurrentSolution', response.id)
            setTimeout(function () {
              document.getElementById('heading' + problem.id).scrollIntoView();
            }, 200);
          }).catch(() => {
            this.$store.dispatch('clearTasks')
          })
        }
      },

      async sendToGroup(id, groupsArray) {
        console.log(id, groupsArray);
        await this.$store.dispatch('sendToGroup', {
          id,
          groupsArray
        })
      },

      onFocusTextarea(event) {
        this.currentTextarea = event.target.value
        console.log(this.currentTextarea);
        event.path[0].nextElementSibling.classList.add('flex')
      },

// name, 
      onBlurTextarea(event, type) {
        console.log(event);
        event.path[0].nextElementSibling.classList.remove('flex')

        switch (type) {
          case 'exp':
            console.log('blur');
            // this.$store.commit('editSolutionOther', {
            //   name: this.currentSolutionName,
            //   id
            // })
            break;
          case 'plan':
            console.log(this.currentTextarea);
            break;
          case 'team':
            console.log(this.currentTextarea);
            break;
          case 'result':
            console.log(this.currentTextarea);
            break;
          default:
            alert("Нет таких значений");
        }
      },

      onClear(event, id, type) {
        event.preventDefault()
        switch (type) {
          case 'exp':
            this.$refs['textarea_exp' + id][0].value = this.currentTextarea
            break;
          case 'plan':
            this.$refs['textarea_plan' + id][0].value = this.currentTextarea
            break;
          case 'team':
            this.$refs['textarea_team' + id][0].value = this.currentTextarea
            break;
          case 'result':
           this.$refs['textarea_result' + id][0].value = this.currentTextarea
            break;
          default:
            alert("Нет таких значений");
        }
      },


    }
  };
</script>

<style scoped lang="scss">
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
    justify-content: flex-end;
  }

  .flex {
    display: flex;
    visibility: visible;
  }

  #closeIcon {
    transform: rotate(45deg);
  }

  textarea {
    outline: none;
    border: none;
    resize: none;
  }

  .half-circle-spinner {
    margin: auto;
  }

  .card {
    border: none;
    margin-bottom: 16px;
  }

  .accordion.col-9,
  .accordion.col-3 {
    .card {
      border: 1px solid rgba(0, 0, 0, 0.36);
      border-radius: 9px;
      padding: 16px 13px;

      .card-header {
        height: fit-content;
      }
    }

  }

  .name {
    display: flex;
  }

  .collapsed {
    transform: rotate(180deg);
    padding-left: 16px;
  }

  .card-header {
    border: 2px solid #ECEBF4;
    border-radius: 9px;
    background-color: #fff;
    width: 100%;
    display: flex;
    height: 60px;
    justify-content: space-between;
    margin-left: 0px;
    background-color: #F6F7F9;
  }

  .collapsed-header {
    border-bottom: none;
    border-radius: 9px 9px 0 0;
  }

  .card-body {
    // width: 84%;
    border: 2px solid #ECEBF4;
    border-top: none;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    background: #F6F7F9;
    border-radius: 0 0 9px 9px;
    margin: auto;
    padding-top: 0;
    margin-bottom: 10px;

    .card {
      width: 100%;
      background-color: transparent;
      // margin-bottom: 30px;
      padding-bottom: 30px;
      padding-top: 30px;
      border-bottom: 1px solid #DEDEDE;
      padding-left: 18px;
      height: fit-content;
      margin: 0;


      .collapse {
        width: 290px;
      }


      h5 {
        font-family: 'GothamPro-Medium';
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.15px;
        // color: #92D2C3;
        display: flex;
      }

      .card-header {
        padding: 0;
        border: none;
        background-color: transparent;
        width: 349px;

        svg {
          color: #92D2C3;
        }
      }
    }
  }

  .container {
    // width: 1370px;
    max-width: 97%;
    width: auto !important;
    max-height: 63vh;
    overflow-y: scroll;
    padding-right: 20px;
    margin-top: 64px;
    margin-bottom: 36px;
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

  hr {
    width: 90%;
  }

  h2 {
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    // width: 78%;
    margin: 51px auto;
  }

  .btnMain {
    padding: 0;
    border-radius: 12px;
    width: 302px;
    height: 58px;
    background: #92D2C3;
    color: #fff;
    font-size: 18px;
    line-height: 17px;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'GothamPro-Medium';
  }

  .btn-link {
    background-color: transparent;
    width: fit-content;
    height: fit-content;
    margin: 0;
  }

  .plus {
    margin-left: 0;
    margin-right: 9px;
  }

  .list-group-item {
    border-radius: 7px;
    width: 100%;
    height: fit-content;
    background-color: #F0F0F0;
    color: #717171;
    font-size: 18px;
    border: none;
    margin: 6.5px 0;
    justify-content: space-between;
    display: flex;
    align-items: center;
    padding: 0;
  }

  #list:hover .borderline {
    margin: initial;
    padding: 10px 26px;
  }

  .toggle-area {
    width: 100%;
    cursor: pointer;
    padding: 23px 0 23px 23px;
  }

  svg {
    color: #AFAFAF;
    cursor: pointer;
  }

  .icons {
    display: flex;

    .trash-icon {
      width: 50px;
      align-items: center;
      display: flex;
      margin: 4px 15px 4px 18px;
    }
  }

  .pagination {
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0;
  }

  .page-link {
    background: none;
    border: none;
    color: #5F5F5F;
    font-size: 18px;
    margin: 0;

    svg {
      color: #5F5F5F;
    }
  }

  .block {
    color: #D3D3D3;
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
  }

  .page-link img {
    margin: 0;
  }

  .page-item {
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 17px;
    color: #5F5F5F;
  }

  .page-item a {
    padding: 0;
    margin: 15px;
  }

  .borderline {
    margin: -2px 0;
    padding: 10px 26px;
    border-right: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    width: 85%;
    margin: auto;
    max-width: 1350px;

    .btn {
      margin-top: 25px;

      svg {
        color: white;
        margin-right: 5px;
      }
    }
  }


  @media (min-width: 1430px) {
    // .container {
    //   max-width: 1370px;
    // }

    h2 {
      max-width: 1270px;
    }
  }

  @media (min-width: 500px) {
    // .container {
    //   width: 85% !important;
    // }

    h2 {
      width: 75%;
    }
  }
</style>