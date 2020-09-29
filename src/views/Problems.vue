<template>
  <div>
    <div class="filters">
      <!-- <div class="pagination">
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
      </div> -->
    </div>
    <!-- <h2>Список всех проблем в компании</h2> -->


    <div class="container">
      <div id="accordion">
        <!-- in paginatedData -->
        <div class="card" id="card" v-for="(problem, idx) in problems" :key="idx">
          <div class="card-header row" :id="'heading'+problem.id">
            <div class="name col-4">
              <button class="btn btn-link collapsed" @click="onClickShow(problem)" data-toggle="collapse"
                :data-target="'#collapseOne'+problem.id" aria-expanded="false"
                :aria-controls="'collapseOne'+problem.id">
                <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
              </button>
              <h5 class="mb-0">
                <p>{{idx+1}}. {{ problem.name }} </p>
              </h5>
            </div>

            <div class="middle-icons col-7">
              <div>
                <v-popover offset="16">
                  <file-text-icon size="1.5x" class="custom-class details tooltip-target b3">
                  </file-text-icon>

                  <template slot="popover">
                    <TooltipProblem char="=" :val="problem" />
                    <a v-close-popover
                      style="display: flex;justify-content: flex-end; font-size: 28px; font-family: 'GothamPro'">&times;</a>
                  </template>
                </v-popover>
              </div>
              <div>
                <clock-icon size="1.5x" class="custom-class" style="color: #4EAD96;"></clock-icon>
              </div>
              <div>
                <alert-circle-icon size="1.5x" class="custom-class" style="color: #4EAD96;"></alert-circle-icon>
              </div>

              <div>
                <div class="like">
                  <button class="likeBtn" @click="likeProblem(problem.id)">
                    <span>
                      {{ problem.likes_count }}
                    </span>
                    <thumbs-up-icon size="1.5x" class="custom-class"></thumbs-up-icon>
                  </button>
                </div>
              </div>
              <vue-ellipse-progress :progress="progress" color="#56CCF2" :size=45 :thickness="4">
                <span v-show="!progressClicked" slot="legend-value"
                  @click="clickProgress(problem.id)">{{progress}}%</span>
                <input v-show="progressClicked" :ref="'progress-bar'+problem.id" class="progress-input" type="text"
                  v-model="progress" @blur="editProgress(problem.id)" @keyup.enter="editProgress(problem.id)">
              </vue-ellipse-progress>
            </div>

            <div class="middle-icons_text col-8">
              <div>
                <span style="color: #828282;">
                  Подробнее:
                </span>
               <v-popover offset="16">
                  <file-text-icon size="1.5x" class="custom-class details tooltip-target b3">
                  </file-text-icon>

                  <template slot="popover">
                    <TooltipProblem char="=" :val="problem" />
                    <a v-close-popover
                      style="display: flex;justify-content: flex-end; font-size: 28px; font-family: 'GothamPro'">&times;</a>
                  </template>
                </v-popover>
                <!-- <file-text-icon size="1.5x" class="custom-class"></file-text-icon> -->
              </div>
              <div>
                <span style="color: #4EAD96;">
                  Срочная:
                </span>
                <clock-icon size="1.5x" class="custom-class" style="color: #4EAD96;"></clock-icon>
              </div>
              <div>
                <span style="color: #4EAD96;">Важная: </span>
                <alert-circle-icon size="1.5x" class="custom-class" style="color: #4EAD96;"></alert-circle-icon>
              </div>

              <div>
                <span style="color: #828282;">У меня такая же проблема: </span>
                <div class="like">
                  <button class="likeBtn" @click="likeProblem(problem.id)">
                    <span>
                      {{ problem.likes_count }}
                    </span>
                    <thumbs-up-icon size="1.5x" class="custom-class"></thumbs-up-icon>
                  </button>
                </div>
              </div>
              <div>
                <span style="color: #828282;">
                  Прогресс решения:              
                </span>
                <vue-ellipse-progress :progress="progress" color="#56CCF2" :size=45 :thickness="4">
                <span v-show="!progressClicked" slot="legend-value" style="padding: 0;"
                  @click="clickProgress(problem.id)">{{progress}}%</span>
                <input v-show="progressClicked" :ref="'progress-bar'+problem.id" class="progress-input" type="text"
                  v-model="progress" @blur="editProgress(problem.id)" @keyup.enter="editProgress(problem.id)">
              </vue-ellipse-progress>
                <!-- <circle-counter width="20rem" height="20rem" text="label"/> -->
                <!-- <thumbs-up-icon size="1.5x" class="custom-class"></thumbs-up-icon>
                <thumbs-up-icon size="1.5x" class="custom-class"></thumbs-up-icon> -->
              </div>
            </div>

            <div class="icons col-1">
              <div class="trash-icon">
                <trash-icon size="1.3x" class="custom-class" style="margin: auto;"
                  @click="deleteP(problem.id, problem.name)" data-toggle="modal" data-target="#popupDelete">
                </trash-icon>
              </div>
            </div>

          </div>

          <div :id="'collapseOne'+problem.id" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
              <div class="card" style="padding-top: 34px;" v-if="mounted">
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
                          <!-- plan,  -->
                          <textarea cols="30" rows="10" :ref="'textarea_plan'+problem.id"
                            @keydown.enter.prevent.exact="event => {editPlan(event)}"
                            @keyup.shift.enter.prevent="newLine" @focus="event => onFocusTextarea(event)"
                            @blur="event => {onBlurTextarea( event, 'plan')}"></textarea>
                          <div class="hidden">
                            <!-- plan, -->
                            <button class="input-btn" @mousedown="event => {editPlan( event)}">
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
                            <label>Команда</label>
                            <textarea cols="30" rows="10" :ref="'textarea_team'+problem.id"
                              @keydown.enter.prevent.exact="event => {editTeam(event)}"
                              @keyup.shift.enter.prevent="newLine" @focus="event => onFocusTextarea(event)"
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
                            <label>Опыт</label>
                            <!-- v-model="solution.name"  :ref="'textarea' + solution.id" -->
                            <!-- exprnce, -->
                            <textarea cols="30" rows="10" :ref="'textarea_exp'+problem.id"
                              @keydown.enter.prevent.exact="event => {editExp(event)}"
                              @keyup.shift.enter.prevent="newLine" @focus="event => onFocusTextarea(event)"
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
                            <label>Результат</label>
                            <textarea cols="30" rows="10" :ref="'textarea_result'+problem.id"
                              @keydown.enter.prevent.exact="event => {editResult(event)}"
                              @keyup.shift.enter.prevent="newLine" @focus="event => onFocusTextarea(event)"
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
                            <button class="btn btnMain problem-solved">Проблема решена</button>
                          </div>
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
                            Направить проблему в подразделения
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
                          <button class="btn btnMain btn-to-groups"
                            @click="sendToGroup(problem.id, checkedGroups)">Направить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="d-flex justify-content-center" style="margin-top: 20px;">
                <!-- <half-circle-spinner :animation-duration="1500" :size="50" color="#92D2C3" /> -->
                <div class="d-flex justify-content-center">
                  <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>



    <PopupDelete v-if="openDelete" :val="paramsModal" @deleteProblem="deleteProblem(param = $event)" />
  </div>

</template>

<script>
  import TooltipProblem from '@/components/TooltipProblem'
  import PopupDelete from '@/components/PopupProblems/Delete'
  import PopupShow from '@/components/Solutions/ShowSolution'
  import Tasks from '@/components/Solutions/Tasks/Tasks'


  //////
  // import {
  //   HalfCircleSpinner
  // } from 'epic-spinners'

  import {
    mapGetters
  } from 'vuex'
  import {
    TrashIcon,
    PlusIcon,
    ChevronUpIcon,
    // ChevronRightIcon,
    // ChevronLeftIcon,
    FileTextIcon,
    ClockIcon,
    CheckIcon,
    ThumbsUpIcon,
    AlertCircleIcon
  } from 'vue-feather-icons'

  export default {
    name: "problems",
    data: () => ({
      openDelete: false,
      openShow: false,
      mounted: false,

      paramsModal: {},
      // pageNumber: 0,
      // size: 25,
      progress: 35,
      progressClicked: false,

      checkedGroups: [],

      currentTextarea: '',
    }),
    components: {
      TooltipProblem,
      PopupDelete,
      PopupShow,
      Tasks,

      TrashIcon,
      PlusIcon,
      // ChevronRightIcon,
      // ChevronLeftIcon,
      ChevronUpIcon,
      FileTextIcon,
      ClockIcon,
      CheckIcon,
      ThumbsUpIcon,
      AlertCircleIcon,

      // HalfCircleSpinner,
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

      // pageCount() {
      //   let l = this.problems.length,
      //     s = this.size;
      //   return Math.ceil(l / s);
      // },
      // paginatedData() {
      //   const start = this.pageNumber * this.size,
      //     end = start + this.size;
      //   return this.problems.slice(start, end);
      // }
    },

    methods: {
      clickProgress(id) {
        this.progressClicked = true
        this.$nextTick(() => {
          this.$refs['progress-bar' + id][0].focus()
        })
      },
      editProgress(id) {
        this.progressClicked = false
        console.log(id);
      },

      nextPage() {
        this.pageNumber++;
      },
      prevPage() {
        if (this.pageNumber > 0) {
          this.pageNumber--;
        }
      },


      edit(obj) {
        this.openShow = false
        this.paramsModal = obj
        this.$store.commit('setError', '')
      },

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
          .getElementById('heading' + problem.id).classList.remove('collapsed-header') : document.getElementById(
            'heading' + problem.id)
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
            console.log(this.currentSolutionName);
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

      newLine(e) {
        let caret = e.target.selectionStart;
        e.target.setRangeText("\n", caret, caret, "end");
        this.text = e.target.value;
      },
      editPlan(event) {
        event.target.blur()

        console.log(this.currentTextarea);
        console.log('ok');
        // send v-model
        //   await this.$store.commit('setError404', '')
        // await this.$store.dispatch('editPlan', {
        //     name,
        //     id
        //   })
      },
      editTeam(event) {
        console.log(event);
        console.log(this.currentTextarea);
        // send v-model
        //   await this.$store.commit('setError404', '')
        // await this.$store.dispatch('editTeam', {
        //     name,
        //     id
        //   })
      },
      editExp(event) {
        console.log(event);
        console.log(this.currentTextarea);
        // send v-model
        //   await this.$store.commit('setError404', '')
        // await this.$store.dispatch('editExp', {
        //     name,
        //     id
        //   })
      },
      editResult(event) {
        console.log(event);
        console.log(this.currentTextarea);
        // send v-model
        //   await this.$store.commit('setError404', '')
        // await this.$store.dispatch('editResult', {
        //     name,
        //     id
        //   })
      },

    }
  };
</script>

<style scoped lang="scss">

  .progress-input {
    width: 22px;
    // background-color: transparent;
    background-color: #F7F7F7;
    border-radius: 9px;
    border: none;
    outline: none;
  }

  .details:hover,
  .details:focus {
    color: #92D2C3;
    outline: none;
  }

  .like {
    border: 1.5px solid #92D2C3;
    border-radius: 6px;
    background-color: transparent;
    height: 31px;
    width: fit-content;

    .likeBtn {
      border: none;
      outline: none;
      color: #4EAD96;
      width: 100%;
      height: 100%;
      align-items: center;
      background-color: transparent;
      display: flex;
      padding: 5px 9px;

      span {
        height: 27px;
        align-items: center;
        height: 100%;
        display: flex;
        font-size: 18px;
        line-height: 17px;
      }

      svg {
        color: #4EAD96;
        padding-left: 8px;
        height: 100%;
      }
    }
  }

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

  .spinner-border {
    margin: auto;
    color: #92D2C3;
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

  #collapseResults,
  #collapsePlan,
  #collapseGroups {
    padding-top: 7px;

  }

  .name {
    display: flex;

    button {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .collapsed {
    transform: rotate(180deg);
    padding-left: 16px;
  }

  .card-header {
    border: none;
    border-radius: 9px;
    background-color: #fff;
    width: 100%;
    display: flex;
    min-height: 60px;
    height: fit-content;
    justify-content: space-between;
    margin-left: 0px;
    background-color: #F6F7F9;

  }

  .middle-icons_text {
    display: none;
    padding: 0;
    flex-wrap: wrap;
    height: fit-content;

    div {
      display: flex;
      align-items: center;
    }

    span {
      font-size: 16px;
      padding-right: 9px;
    }
  }

  .collapsed-header {
    // border-bottom: none;
    border-radius: 9px 9px 0 0;

    .middle-icons {
      display: none;
    }

    .middle-icons_text {
      display: flex;
      justify-content: space-between;
    }

    .icons {
      display: none;
    }
  }

  .card-body {
    border: none;
    display: flex;
    flex-direction: column;
    border-radius: 0 0 9px 9px;
    background: #F6F7F9;
    margin: auto;
    padding-top: 0;
    margin-bottom: 10px;

    .card {
      width: 100%;
      background-color: transparent;
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
        display: flex;
      }

      .card-header {
        padding: 0;
        border: none;
        background-color: transparent;
        width: 349px;
      }
    }
  }

  .filters {
    margin-top: 25px;
  }

  .container {
    // width: 1370px;
    max-width: 97%;
    width: auto !important;
    max-height: 82vh;
    overflow-y: scroll;
    padding-right: 20px;
    margin-top: 18px;
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

  .problem-solved,
  .btn-to-groups {
    margin: auto;
    width: auto;
    padding: 10px 26px;
    font-family: 'GothamPro';
    font-size: 16px;
    height: fit-content !important;
    line-height: 15px;
  }

  .btn-to-groups {
    padding-left: 36px;
    padding-right: 36px;
    margin-top: 15px;
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

  .middle-icons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    div {
      display: flex;
      flex-direction: row;
    }
  }

  .icons {
    display: flex;
    justify-content: flex-end;

    .trash-icon {
      width: 50px;
      align-items: center;
      display: flex;
    }
  }

  // .pagination {
  //   align-items: center;
  //   justify-content: flex-end;
  //   margin-bottom: 0;
  // }

  // .page-link {
  //   background: none;
  //   border: none;
  //   color: #5F5F5F;
  //   font-size: 18px;
  //   margin: 0;

  //   svg {
  //     color: #5F5F5F;
  //   }
  // }

  // .block {
  //   color: #D3D3D3;
  //   opacity: 0.5;
  //   pointer-events: none;
  //   cursor: default;
  // }

  // .page-link img {
  //   margin: 0;
  // }

  // .page-item {
  //   font-style: normal;
  //   font-weight: normal;
  //   font-size: 18px;
  //   line-height: 17px;
  //   color: #5F5F5F;
  // }

  // .page-item a {
  //   padding: 0;
  //   margin: 15px;
  // }

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



  @media (max-width: 1300px) {
    * {
      font-size: 12px;

      .middle-icons_text span {
        font-size: 11px !important;
      }
    }

    // .modal-body {
    //   max-width: 95% !important;
    // }
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