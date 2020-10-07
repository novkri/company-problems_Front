<template>
  <div>
    <span class="empty" v-show="problems.length == 0">Список проблем пуст...</span>
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
    <div class="container">
      <div id="accordion">
        <div class="card" id="card" v-for="(problem, idx) in problems" :key="idx">
          <!-- {{problem.status}} -->
          <div class="card-header row" :id="'heading'+problem.id" ref="collapsed-header">
            <div class="name col-4">
              <button class="btn btn-link collapsed" @click="onClickShow(problem)" data-toggle="collapse"
                :data-target="'#collapseOne'+problem.id" aria-expanded="false"
                :aria-controls="'collapseOne'+problem.id">
                <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
              </button>

              <h5 class="mb-0" style="display: flex; width: 92%;">
                <div style="width: inherit;"
                  :style="[problem.creator_id == currentUid ? {'cursor': 'pointer'} : {'cursor': 'default'}]"
                  :ref="'name-div'+problem.id" @click="event => {onClickInput(problem.id, problem.creator_id, event)}">
                  {{ problem.name}}
                </div>
                <input class="form-control" style="display: none;" :id="'problem-name'+problem.id"
                  :disabled="problem.creator_id !== currentUid" v-model="problem.name"
                  :ref="'problem-name' + problem.id"
                  @keyup.enter="event => {editProblemName(problem.name, problem.id, event)}"
                  @focus="onFocusInput($event)" @blur="event => {onBlurInput(problem.name, problem.id, event)}" />
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
                      style="display: flex;justify-content: flex-end; font-size: 28px; font-family: 'GothamPro'; cursor: pointer;">&times;</a>
                  </template>
                </v-popover>
              </div>
              <div style="width: 21px;">
                <clock-icon size="1.5x" class="custom-class details" :ref="'urgency'+problem.id" v-show="problem.urgency === 'Срочная'"
                  :style="[problem.urgency == isUrgent ? {'color': '#4EAD96'} : {'color': '#AFAFAF'}]"
                  @click="changeUrgency(problem.id, problem.urgency)"></clock-icon>
              </div>
              <div style="width: 21px;">
                
                <alert-circle-icon size="1.5x" class="custom-class details" :ref="'importance'+problem.id" v-show="problem.importance === 'Важная'"
                  :style="[problem.importance == isImportnant ? {'color': '#4EAD96'} : {'color': '#AFAFAF'}]"
                  @click="changeImportance(problem.id, problem.importance)"></alert-circle-icon>
              </div>

              <div>
                <div class="like" :class="[problem.is_liked ? 'liked' : '']">
                  <button class="likeBtn" @click="likeProblem(problem.id)">
                    <span>
                      {{ problem.likes_count }}
                    </span>
                    <thumbs-up-icon size="1.5x" class="custom-class"></thumbs-up-icon>
                  </button>
                </div>
              </div>
              <vue-ellipse-progress :progress="+problem.progress" color="#56CCF2" :size=45 :thickness="4">
                <span slot="legend-value" :ref="'legend-value'+problem.id"
                  @click="event => clickProgress(problem.id, event)">{{problem.progress}}%</span>
                <input :ref="'progress-bar'+problem.id" class="progress-input" type="text" style="display: none;"
                  v-model="problem.progress" @blur="editProgress(problem.id, problem.progress)"
                  @keyup.enter="editProgress(problem.id, problem.progress)">
              </vue-ellipse-progress>
            </div>

            <div class="middle-icons_text col-8">
              <div>
                <span style="color: #828282;">
                  Подробнее:
                </span>
                <v-popover offset="16">
                  <file-text-icon size="1.3x" class="custom-class details tooltip-target b3">
                  </file-text-icon>

                  <template slot="popover">
                    <TooltipProblem char="=" :val="problem" />
                    <a v-close-popover
                      style="display: flex;justify-content: flex-end; font-size: 28px; font-family: 'GothamPro'">&times;</a>
                  </template>
                </v-popover>
              </div>
              <div>
                <span :style="[problem.urgency == isUrgent ? { 'color': '#4EAD96'} : { 'color': '#BDBDBD'}]">
                  Срочная:
                </span>
                <clock-icon size="1.3x" class="custom-class details" :ref="'urgency'+problem.id"
                  :style="[problem.urgency == isUrgent ? {'color': '#4EAD96'} : {'color': '#AFAFAF'}]"
                  @click="changeUrgency(problem.id, problem.urgency)"></clock-icon>
              </div>
              <div>
                <span
                  :style="[problem.importance == `Важная` ? { 'color': '#4EAD96'} : { 'color': '#BDBDBD'}]">Важная:</span>
                <alert-circle-icon size="1.3x" class="custom-class details" :ref="'importance'+problem.id"
                  :style="[problem.importance == isImportnant ? {'color': '#4EAD96'} : {'color': '#AFAFAF'}]"
                  @click="changeImportance(problem.id, problem.importance)"></alert-circle-icon>
              </div>
              <div>
                <span style="color: #828282;">У меня такая же проблема: </span>
                <div class="like" :class="[problem.is_liked ? 'liked' : '']">
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
                <vue-ellipse-progress :progress="+problem.progress" color="#56CCF2" :size=35 :thickness="3">
                  <span :ref="'legend-value'+problem.id" slot="legend-value" style="padding: 0;font-size: 11px !important;"
                    @click="event => clickProgress(problem.id, event)">{{problem.progress}}%</span>
                  <input :ref="'progress-bar'+problem.id" class="progress-input" type="text" style="display: none;"
                    v-model="problem.progress" @blur="editProgress(problem.id, problem.progress)"
                    @keyup.enter="editProgress(problem.id, problem.progress)">
                </vue-ellipse-progress>
              </div>
            </div>

            <div class="icons col-1">
              <div class="trash-icon">
                <trash-icon size="1.3x" class="custom-class" style="margin: auto;"
                  v-show="problem.creator_id == currentUid" @click="deleteP(problem.id, problem.name)"
                  data-toggle="modal" data-target="#popupDelete">
                </trash-icon>
              </div>
            </div>
          </div>

          <div :id="'collapseOne'+problem.id" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
              <div class="card" style="padding-top: 34px;" v-if="mounted">
                <div class="row" style="display: flex; flex-direction: row; margin-bottom: 8px;">
                  <div class="accordion col-9" id="tasks">
                    <div class="card">
                      <div class="card-header" id="headingTasks" style="width: 100%;">
                        <div class="name">
                          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTasks"
                            aria-expanded="false" aria-controls="collapseTasks">
                            <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                          </button>
                          <h5 class="mb-0">
                            Решение
                          </h5>
                        </div>
                      </div>

                      <div id="collapseTasks" class="collapse show" aria-labelledby="headingTasks" data-parent="#tasks"
                        style="width: 100%;">
                        <div class="card-body" :val="solutions">
                          <PopupShow v-if="openShow" :val="paramsModal" />
                          <Tasks v-if="solutions[0]" :val="solutions[0]" />
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
                        <div class="card-body p-0">
                          <!-- plan,  -->
                          <textarea placeholder="Опишите ваш план решения..." rows="6" :ref="'textarea_plan'+problem.id"
                            v-model="solutions[0].plan" :disabled="solutions[0].executor_id != currentUid"
                            @keydown.enter.prevent.exact="event => {editPlan(solutions[0].id, solutions[0].plan, event)}"
                            @keyup.shift.enter.prevent="newLine" @focus="event => onFocusTextarea(event)"
                            @blur="event => {onBlurTextarea(event, 'plan')}"></textarea>
                          <div class="hidden" style="bottom: 13%; right: 11%;">
                            <div v-show="solutions[0].executor_id == currentUid">
                              <button class="input-btn confirm"
                                @mousedown="event => {editPlan(solutions[0].id,solutions[0].plan, event)}">
                                <check-icon size="1.4x" class="custom-class"></check-icon>
                              </button>
                              <div @mousedown="event => onClear(event, problem.id, 'plan')">
                                <button class="input-btn cancel">
                                  <plus-icon size="1.6x" class="custom-class" id="closeIcon"></plus-icon>
                                </button>
                              </div>
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
                            aria-expanded="false" aria-controls="collapseResults" ref="collapseResultsBtn">
                            <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                          </button>
                          <h5 class="mb-0">
                            Команда, опыт, результат
                          </h5>
                        </div>
                      </div>

                      <div id="collapseResults" class="collapse" aria-labelledby="headingResults" style="width: 100%;"
                        data-parent="#results" ref="collapsed-results">
                        <div class="card-body row p-0" style="flex-direction: row;">

                          <div class="col-4 p-2" style="flex-direction: column;display: flex;">
                            <label style="width: 100%;">Команда</label>
                            <textarea rows="6" :disabled="solutions[0].executor_id != currentUid"
                              :ref="'textarea_team'+problem.id" v-model="solutions[0].team"
                              @keydown.enter.prevent.exact="event => {editTeam(solutions[0].id, solutions[0].team, event)}"
                              @keyup.shift.enter.prevent="newLine" @focus="event => onFocusTextarea(event)"
                              @blur="event => {onBlurTextarea(event, 'team')}"></textarea>
                            <div class="hidden">
                              <div v-show="solutions[0].executor_id == currentUid">
                                <button class="input-btn confirm"
                                  @mousedown="event => {editTeam(solutions[0].id, solutions[0].team, event)}">
                                  <check-icon size="1.4x" class="custom-class"></check-icon>
                                </button>
                                <div @mousedown="event => onClear(event, problem.id, 'team')">
                                  <button class="input-btn cancel">
                                    <plus-icon size="1.6x" class="custom-class" id="closeIcon"></plus-icon>
                                  </button>
                                </div>
                              </div>

                            </div>
                          </div>

                          <div class="col-4 p-2" style="flex-direction: column;display: flex;">
                            <label style="width: 100%;">Опыт</label>
                            <textarea rows="6" :disabled="solutions[0].executor_id != currentUid"
                              :ref="'textarea_exp'+problem.id" v-model="problem.experience"
                              @keydown.enter.prevent.exact="event => {editExp(problem.id, problem.experience, event)}"
                              @keyup.shift.enter.prevent="newLine" @focus="event => onFocusTextarea(event)"
                              @blur="event => {onBlurTextarea( event, 'exp')}"></textarea>
                            <div class="hidden">
                              <div v-show="solutions[0].executor_id == currentUid">
                                <button class="input-btn confirm"
                                  @mousedown="event => {editExp(problem.id, problem.experience, event)}">
                                  <check-icon size="1.4x" class="custom-class"></check-icon>
                                </button>
                                <div @mousedown="event => onClear(event, problem.id, 'exp')">
                                  <button class="input-btn cancel">
                                    <plus-icon size="1.6x" class="custom-class" id="closeIcon"></plus-icon>
                                  </button>
                                </div>
                              </div>

                            </div>
                          </div>

                          <div class="col-4 p-2" style="flex-direction: column;display: flex;">
                            <label style="width: 100%;">Результат</label>
                            <textarea rows="6" :disabled="solutions[0].executor_id != currentUid"
                              :ref="'textarea_result'+problem.id" v-model="problem.result"
                              @keydown.enter.prevent.exact="event => {editResult(problem.id, problem.result, event)}"
                              @keyup.shift.enter.prevent="newLine" @focus="event => onFocusTextarea(event)"
                              @blur="event => {onBlurTextarea(event, 'result')}"></textarea>
                            <div class="hidden">
                              <div v-show="solutions[0].executor_id == currentUid">
                                <button class="input-btn confirm"
                                  @mousedown="event => {editResult(problem.id, problem.result, event)}">
                                  <check-icon size="1.4x" class="custom-class"></check-icon>
                                </button>
                                <div @mousedown="event => onClear(event, problem.id, 'result')">
                                  <button class="input-btn cancel">
                                    <plus-icon size="1.6x" class="custom-class" id="closeIcon"></plus-icon>
                                  </button>
                                </div>
                              </div>
                            </div>


                            <div
                              style="margin-bottom: -37px; margin-top: 14px; display: flex; justify-content: space-evenly; flex-direction: row;flex-wrap:wrap; align-items: center;">
                              <span
                                v-show="problem.status == 'На проверке заказчика' && solutions[0].executor_id == currentUid"
                                class="problem-send">Проблема
                                отправлена для подтверждения решения</span>

                              <button
                                v-show="problem.status != 'На проверке заказчика' && solutions[0].executor_id == currentUid"
                                class="btn btnMain problem-solved" @click="problemSolved(problem.id)">Проблема
                                решена</button>
                              <div style="display: flex; ">
                                <button
                                  v-show="problem.creator_id == currentUid && problem.status == 'На проверке заказчика'"
                                  class="btn btnMain problem-confirm y" style="margin-right: 11px;"
                                  @click="problemConfirm(problem.id)">Подтвердить
                                  решение</button>
                                <button
                                  v-show="problem.creator_id == currentUid && problem.status == 'На проверке заказчика'"
                                  class="btn btnMain problem-confirm" style="background-color: #EBEBEB;color: #4F4F4F;"
                                  @click="problemReject(problem.id)">Отклонить</button>
                              </div>

                            </div>

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
                            aria-expanded="false" aria-controls="collapseGroups" ref="collapseGroupsBtn">
                            <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                          </button>
                          <h5 class="mb-0">
                            Направить в подразделение
                          </h5>
                        </div>
                      </div>

                      <div id="collapseGroups" class="collapse" aria-labelledby="headingGroups" style="width: 100%;"
                        data-parent="#groups" ref="collapsed-groups">
                        <div class="card-body p-0">
                          <div class="check-inputs">
                            <div class="custom-control custom-checkbox" v-for="(group, idx) in groups" :key="idx">
                              <input type="checkbox" class="custom-control-input" :id="'groupCheck'+group.id"
                                :value="group.id" v-model="checkedGroups">
                              <label class="custom-control-label" :for="'groupCheck'+group.id">{{group.name}}</label>
                            </div>
                          </div>

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


  import {
    mapGetters
  } from 'vuex'
  import {
    TrashIcon,
    PlusIcon,
    ChevronUpIcon,
    FileTextIcon,
    ClockIcon,
    CheckIcon,
    ThumbsUpIcon,
    AlertCircleIcon
  } from 'vue-feather-icons'

  export default {
    name: "problems-for-execution",
    data: () => ({
      openDelete: false,
      openShow: false,
      mounted: false,
      editableProblem: false,

      paramsModal: {},
      currentProgress: '',

      checkedGroups: [],

      currentTextarea: '',
      currentProblemName: '',

      isUrgent: 'Срочная',
      isImportnant: 'Важная',


      fakeAdmin: 1,
      fakeResponsible: 1
    }),
    components: {
      TooltipProblem,
      PopupDelete,
      PopupShow,
      Tasks,

      TrashIcon,
      PlusIcon,
      ChevronUpIcon,
      FileTextIcon,
      ClockIcon,
      CheckIcon,
      ThumbsUpIcon,
      AlertCircleIcon,
    },

    async mounted() {
      await this.$store.dispatch('getProblemsForExecution', {
          urgency: '',
          importance: '',
          deadline: '',
          status: ''
        }).catch(() => {
          this.$store.commit('setProblems', '')
        })
        .then((r) => {
          this.$store.commit('amountOfProblemsForExecution', r.length)
        })

      await this.$store.dispatch('getGroups').catch(() => this.$router.push('/login'))
      await this.$store.dispatch('getAllUsers')
      // this.$route.path === '/' ? await this.$store.dispatch('getProblems') : ''
    },
    watch: {
      error404() {
        if (this.error404) {
          this.$toast.error(this.error404);
        }
      },
    },
    computed: {
      ...mapGetters(['problems', 'error', 'error404', 'allUsers', 'currentSolution', 'solutions', 'groups', 'user',
        'currentUid'
      ]),

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
      // filteredProblems() {
      //   return this.$store.getters.filterProblemssBy('на рассмотрении');
      // }
    },

    methods: {
      async problemReject(id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('problemReject', id)
      },
      async problemConfirm(id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('problemConfirm', id)
      },
      async problemSolved(id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('problemSolved', id)
      },

      async changeUrgency(id, urgency) {
        await this.$store.commit('setError404', '')
        if (this.fakeResponsible) {
          if (urgency === 'Обычная') {
            await this.$store.dispatch('changeUrgency', {
              id,
              urgency: "Срочная"
            })

          } else {
            await this.$store.dispatch('changeUrgency', {
              id,
              urgency: "Обычная"
            })
          }
        } else {
          // await this.$store.commit('setError404', 'Не достаточно прав')
        }

      },

      async changeImportance(id, importance) {
        await this.$store.commit('setError404', '')
        if (this.fakeResponsible) {
      
          if (importance === 'Обычная') {
            await this.$store.dispatch('changeImportance', {
              id,
              importance: "Важная"
            })

          } else {
            await this.$store.dispatch('changeImportance', {
              id,
              importance: "Обычная"
            })
          }
        } else {
          // await this.$store.commit('setError404', 'Не достаточно прав')
        }

      },

      async clickProgress(id) {
        await this.$store.commit('setError404', '')
        if (this.fakeResponsible) {
          this.currentProgress = this.$refs['progress-bar' + id][0].value
          this.$refs['legend-value' + id][0].style.display = 'none'
          this.$refs['legend-value' + id][1].style.display = 'none'
          this.$nextTick(() => {
            this.$refs['progress-bar' + id][0].style.display = 'flex'
            this.$refs['progress-bar' + id][1].style.display = 'flex'
            this.$refs['progress-bar' + id][0].focus()
            this.$refs['progress-bar' + id][1].focus()
          })
        } else {
          // await this.$store.commit('setError404', 'Не достаточно прав')
        }

      },

      async editProgress(id, progress) {
        this.$refs['progress-bar' + id][0].style.display = 'none'
        this.$refs['legend-value' + id][0].style.display = 'flex'
        this.$refs['progress-bar' + id][1].style.display = 'none'
        this.$refs['legend-value' + id][1].style.display = 'flex'

        await this.$store.dispatch('editProgress', {
          id,
          progress
        }).catch(() => {
          this.$store.commit('editProgress', {
            id,
            progress: this.currentProgress
          })
        })
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
        this.$refs['collapsed-header'].forEach(element => {
          element.classList.contains('collapsed-header') && element.id !== 'heading' + problem.id ? element
            .classList.remove('collapsed-header') : ''
        });

        document.getElementById('heading' + problem.id).classList.contains('collapsed-header') ? document
          .getElementById('heading' + problem.id).classList.remove('collapsed-header') : document.getElementById(
            'heading' + problem.id).classList.add('collapsed-header')

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
            })
            .then(() => {
              this.$refs['collapsed-results'].forEach(element => {
                element.classList.contains('show') ? this.$refs['collapseResultsBtn'].forEach(element => {
                  element.click()
                }) : ''
              });
              this.$refs['collapsed-groups'].forEach(element => {
                element.classList.contains('show') ? this.$refs['collapseGroupsBtn'].forEach(element => {
                  element.click()
                }) : ''
              });
            })
            .catch(() => {
              this.$store.dispatch('clearTasks')
            })
        }
      },

      async sendToGroup(id, groupsArray) {
        await this.$store.dispatch('sendToGroup', {
          id,
          groupsArray
        })
        this.checkedGroups = null
      },


      async onClickInput(id, creator_id, event) {
        await this.$store.commit('setError404', '')
        if (creator_id == this.currentUid) {
          event.target.style.display = 'none'
          this.$nextTick(() => {
            this.$refs['problem-name' + id][0].style.display = 'initial'
            this.$refs['problem-name' + id][0].focus()
          })
        } else {
          // await this.$store.commit('setError404', 'не хватает прав')
        }

      },

      async onBlurInput(name, id, event) {
        await this.$store.commit('setError404', '')
        if (name !== this.currentProblemName) {
          await this.$store.dispatch('editProblemName', {
            name,
            id
          }).catch(() => {
            this.$store.commit('editProblemName', {
              name: this.currentProblemName,
              id
            })
          })
          event.target.style.display = 'none'
          this.$refs['name-div' + id][0].style.display = 'initial'
        } else {
          this.$store.commit('editProblemName', {
            name: this.currentProblemName,
            id
          })
          event.target.style.display = 'none'
          this.$refs['name-div' + id][0].style.display = 'initial'
        }

      },
      onFocusInput(event) {
        this.currentProblemName = event.target.value
      },

      async editProblemName(name, id, event) {
        await this.$store.commit('setError404', '')
        event.target.blur()
      },


      onFocusTextarea(event) {
        this.currentTextarea = event.target.value
      },

      onBlurTextarea(event, type) {
        switch (type) {
          case 'exp':
            // console.log('blur');
            // console.log(this.currentSolutionName);
            // this.$store.commit('editSolutionOther', {
            //   name: this.currentSolutionName,
            //   id
            // })
            break;
          case 'plan':
            // console.log(this.currentTextarea);
            break;
          case 'team':
            // console.log(this.currentTextarea);
            break;
          case 'result':
            // console.log(this.currentTextarea);
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
      async editPlan(id, plan, event) {
        event.target.blur()
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editPlan', {
            plan,
            id
          })
          .catch(() => {
            this.$store.commit('editPlan', {
              plan: this.currentTextarea,
              id
            })
          })
      },
      async editTeam(id, team) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editTeam', {
            team,
            id
          })
          .catch(() => {
            this.$store.commit('editTeam', {
              team: this.currentTextarea,
              id
            })
          })
      },
      async editExp(id, experience) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editExp', {
            experience,
            id
          })
          .catch(() => {
            this.$store.commit('editExp', {
              experience: this.currentTextarea,
              id
            })
          })
      },
      async editResult(id, result) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editResult', {
            result,
            id
          })
          .catch(() => {
            this.$store.commit('editResult', {
              result: this.currentTextarea,
              id
            })
          })
      },

    }
  };
</script>

<style scoped lang="scss">
  .empty {
    font-family: 'GothamPro-Medium';
    font-size: 16px;
    line-height: 17px;
    letter-spacing: 0.15px;
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 50px;
  }

  .custom-control-label {
    word-break: break-all;
    text-align: inherit;
  }

  .custom-control-label::before {
    border: #4EAD96 solid 1px;
  }

  .custom-control-input {
    border: 0.92px solid #4EAD96;
    color: #4EAD96;
  }

  .custom-control-input:focus {
    outline: none;
    outline-offset: 0;
  }

  .custom-control-input:checked~.custom-control-label::before {
    border-color: #4EAD96;
    background-color: #4EAD96;
  }

  .custom-control-input:focus~.custom-control-label::before {
    box-shadow: none;
  }

  .form-control {
    border: none;
    border-radius: 6px;
    background-color: #F0F0F0;
    color: #2D453F;
    font-size: 18px;
  }

  .progress-input {
    width: 29px;
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
    border: 2px solid #92D2C3;
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
        padding: 0 !important;
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

  .liked {
    background-color: #4EAD96;
    border: 2px solid #4EAD96;

    span {
      color: #fff;
    }

    svg,
    svg:hover {
      color: #fff !important;
    }
  }

  .like:hover {
    border: 2px solid #4EAD96;
    background-color: #4EAD96;

    span {
      color: #fff;
    }

    svg,
    svg:hover {
      color: #fff !important;
    }
  }

  .input-btn {
    border: none;
    width: auto;
    height: 36px;
    width: 36px;
    margin-left: 8px;
    background-color: #F4F4F4;
    border-radius: 8px;


    svg {
      color: #fff;
      vertical-align: middle;
    }
  }

  .confirm {
    background-color: #92D2C3;
  }

  .cancel {
    background-color: #FFD3D3;
  }

  .hidden {
    visibility: visible;
    justify-content: flex-end;
    border-radius: 0 0 9px 9px;
    background-color: #F7F7F7;
    height: 69px;

    &>div {
      border-top: 2px solid #E7E5F1;
      padding: 14px 0px 17px;
      margin: 0 6px;
      display: flex;
      justify-content: flex-end;
      flex-direction: row;

      div {
        padding-right: 3px;
      }
    }


  }

  .flex {
    display: flex;
    visibility: visible;
  }

  #closeIcon {
    transform: rotate(45deg);
  }

  label {
    text-align: center;
    font-family: 'GothamPro';
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
  }

  textarea {
    width: 100%;
    outline: none;
    border: none;
    resize: none;
    background-color: #F7F7F7;
    border-radius: 9px 9px 0 0;
    padding: 26px 24px;

    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
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
    padding-left: 0;
    padding-right: 8px;

    .card {
      background-color: #fff;
      border-radius: 9px;
      padding: 16px 13px;
      padding-bottom: 30px;

      .card-header {
        height: fit-content;
      }
    }

  }



  #collapseResults,
  #collapsePlan,
  #collapseGroups,
  #collapseTeam {
    padding-top: 7px;
    height: 100%;

    .card-body {
      background-color: #fff;
      height: 100%;
      height: -moz-available;
      height: -webkit-fill-available;
    }

    textarea {
      height: 84% !important;
    }
  }

  #collapseTasks {
    .card-body {
      background-color: #fff;
    }
  }

  #collapseResults {
    .card-body {
      margin-top: 28px;
    }
  }

  #collapseGroups {
    .card-body {
      margin-top: 27px;
    }
  }

  h5 {
    font-family: 'GothamPro';
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #000000;

    input {
      height: fit-content;
      padding: 3px;
    }
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
    align-items: center;
    border: none;
    border-radius: 9px;
    background-color: #fff;
    width: 100%;
    display: flex;
    // min-height: 60px;
    height: fit-content;

    justify-content: space-between;
    margin-left: 0px;
    background-color: #F2F5FA;

  }

  .middle-icons_text {
    display: none;
    padding: 0;
    flex-wrap: wrap;
    height: fit-content;
    align-items: center;

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
    background: #F2F5FA;
    // background-color: #fff;
    margin: auto;
    padding-top: 0;
    margin-bottom: 10px;

    .card {
      width: 100%;
      background-color: transparent;
      padding-bottom: 30px;
      padding-top: 30px;
      // border-bottom: 1px solid #DEDEDE;
      padding-left: 18px;
      height: fit-content;
      margin: 0;


      .collapse {
        width: 290px;
      }


      h5 {
        font-family: 'GothamPro-Medium';
        color: #4f4f4f;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.15px;
        display: flex;
        cursor: default;
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
    max-width: 97%;
    width: auto !important;
    max-height: 83vh;
    overflow-y: scroll;
    padding-right: 20px;
    margin-top: 18px;
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

  .problem-send {
    color: #92D2C3;
    font-family: 'GothamPro-Medium';
    text-align: center;
    font-size: 16px;
    line-height: 17px;
    font-style: normal;
    font-weight: normal;
    letter-spacing: 0.15px;
  }

  .problem-solved {
    margin-top: 19px;
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

  .problem-confirm {
    padding: 10px 7px;
    font-family: 'GothamPro';
    width: fit-content;
    height: fit-content;
    font-size: 16px;
    line-height: 15px;
    margin-bottom: 6px;
  }

  .check-inputs {
    max-height: 231px;
    min-height: 231px;
    overflow-y: scroll;
    padding-right: 10px;
  }

  .btn-to-groups {
    padding-left: 36px;
    padding-right: 36px;
    margin-top: 34px;
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


  #plan,
  #tasks,
  #results {
    .card-body {
      height: fit-content;
      // height: 459px !important;
    }
  }

  #plan {

    .card,
    .card-body {
      height: 100% !important;
    }
  }

  #groups {
    .card-body {
      height: fit-content;
      // height: 459px !important;
    }
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

  .ep-legend--value {

    span {
      cursor: pointer;
      font-size: 13px;
    }

  }

  .middle-icons,
  .middle-icons_text {
    align-items: center;

    svg:hover {
      color: #92D2C3 !important;
    }
  }

  .middle-icons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 120px;

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