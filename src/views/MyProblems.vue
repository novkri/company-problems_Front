<template>
  <div id="myproblems_main">
    <span class="empty" v-show="problems.length == 0 && _isMounted">Список проблем пуст...</span>

    <div v-if="!userHasNoGroup">
      <div class="container" v-if="_isMounted">
        <div class="inner-container" v-for="(problemsPack, title) in sortedData" :key="title">
          <span class="problem_subtitle" v-show="problemsPack.length != 0">
            {{title}}
          </span>

          <div v-if="problemsPack.length == 0"></div>

          <div v-else>
            <div id="accordion">
              <div class="card" id="card" v-for="(problem, idx) in problemsPack" :key="idx">
                <!-- {{problem.status}} -->
                <div class="card-header row" @click="event => clickOnCard(problem.id, event)" :id="'heading'+problem.id"
                  ref="collapsed-header">
                  <div class="name col-4">
                    <button class="btn btn-link collapsed" :ref="'button_card'+problem.id" @click="onClickShow(problem)"
                      data-toggle="collapse" :data-target="'#collapseOne'+problem.id" aria-expanded="false"
                      :aria-controls="'collapseOne'+problem.id">
                      <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                    </button>

                    <h5 class="mb-0" style="display: flex; width: 80%;">
                      <span style="width: fit-content;max-width: 100%;"
                        :style="[problem.creator_id == currentUid || user.is_admin ? {'cursor': 'pointer'} : {'cursor': 'default'}]"
                        :ref="'name-div'+problem.id"
                        @click="event => {onClickInput(problem.id, problem.creator_id, event)}">
                        {{ problem.name}}
                      </span>
                      <input class="form-control" style="display: none;" :id="'problem-name'+problem.id"
                        :disabled="isCreatorOrAdmin" v-model="problem.name" :ref="'problem-name' + problem.id"
                        @keyup.enter="event => {editProblemName(problem.name, problem.id, event)}"
                        @focus="onFocusInput($event)" @blur="event => {onBlurInput(problem.name, problem.id, event)}" />
                    </h5>
                  </div>

                  <div class="middle-icons col-6">
                    <div>
                      <v-popover offset="16">
                        <file-text-icon size="1.5x" class="custom-class details tooltip-target b3">
                        </file-text-icon>

                        <template slot="popover">
                          <TooltipProblem char="=" :val="problem" />
                          <a v-close-popover class="close-popover">&times;</a>
                        </template>
                      </v-popover>
                    </div>
                    <div style="width: 21px;">
                      <clock-icon size="1.5x" class="custom-class details" :ref="'urgency'+problem.id"
                        v-show="problem.urgency === 'Срочная'"
                        :style="[problem.urgency == isUrgent ? {'color': '#4EAD96'} : {'color': '#AFAFAF'}]">
                      </clock-icon>
                    </div>
                    <div style="width: 21px;">
                      <alert-circle-icon size="1.5x" class="custom-class details" :ref="'importance'+problem.id"
                        v-show="problem.importance === 'Важная'"
                        :style="[problem.importance == isImportnant ? {'color': '#4EAD96'} : {'color': '#AFAFAF'}]">
                      </alert-circle-icon>
                    </div>

                    <div>
                      <div class="like" :class="[problem.is_liked ? 'liked' : '']">
                        <button class="likeBtn" @click="event => likeProblem(problem.id, event)">
                          <span>
                            {{ problem.likes_count }}
                          </span>
                          <thumbs-up-icon size="1.5x" class="custom-class"></thumbs-up-icon>
                        </button>
                      </div>
                    </div>
                    <vue-ellipse-progress :progress="+problem.progress" color="#56CCF2" :size=45 :thickness="3">
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
                          <a v-close-popover class="close-popover">&times;</a>
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
                        <button class="likeBtn" @click="event => likeProblem(problem.id, event)">
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
                      <vue-ellipse-progress :progress="+problem.progress" color="#56CCF2" :size=35 :thickness="2">
                        <span :ref="'legend-value'+problem.id" slot="legend-value"
                          style="padding: 0;font-size: 11px !important; display: flex;"
                          @click="event => clickProgress(problem.id, event)">{{problem.progress}}%</span>
                        <input :ref="'progress-bar'+problem.id" class="progress-input" type="text"
                          style="display: none;" v-model="problem.progress"
                          @blur="editProgress(problem.id, problem.progress)"
                          @keyup.enter="editProgress(problem.id, problem.progress)">
                      </vue-ellipse-progress>
                    </div>
                  </div>

                  <div class="icons col-1">
           
                    <div class="trash-icon">
                      <trash-icon size="1.3x" class="custom-class" style="margin: auto;" v-show="problem.creator == currentUid || user.is_admin"
                        @click="deleteP(problem.id, problem.name)" data-toggle="modal" data-target="#popupDelete">
                      </trash-icon>
                    </div>
                  </div>
                </div>

                <div :id="'collapseOne'+problem.id" class="collapse" aria-labelledby="headingOne"
                  data-parent="#accordion">
                  <div class="card-body">
                    <div class="card" style="padding-top: 34px;" v-if="mounted">
                      <div class="row" style="display: flex; flex-direction: row; margin-bottom: 8px;">
                        <div class="accordion col-9" id="tasks">
                          <div class="card" :ref="'cardSol'+problem.id"
                            :style="[problem.status == 'На проверке заказчика' ? {'padding-bottom': '13px', 'overflow-y': 'auto', 'min-height': 'auto'} : {'padding-bottom': '0px','min-height': '500px' }]">
                            <div class="card-header" id="headingTasks">

                              <button class="btn btn-link btn-block text-left" style="width: 100%;"
                                :class="[problem.status == 'На проверке заказчика' ? 'collapsed' : '']" type="button"
                                data-toggle="collapse" id="collapseTasks_btn" @click="onClickSol(problem)"
                                data-target="#collapseTasks" aria-expanded="false" aria-controls="collapseTasks">
                                <h5 class="mb-0">
                                  <chevron-up-icon v-if="problem.status == 'На проверке заказчика'" size="1.5x"
                                    class="custom-class"></chevron-up-icon>
                                  <chevron-down-icon v-else size="1.5x" class="custom-class"></chevron-down-icon>
                                  <p>
                                    Решение
                                  </p>
                                </h5>
                              </button>

                            </div>

                            <div id="collapseTasks" class="collapse"
                              :class="[problem.status == 'На проверке заказчика' ? '' : 'show']"
                              aria-labelledby="headingTasks" data-parent="#tasks" style="width: 100%;">
                              <div class="card-body" :val="solutions" style="padding-bottom: 0;">
                                <PopupShow v-if="openShow" :val="paramsModal" />
                                <Tasks v-if="solutions[0]" :val="solutions[0]" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- План -->
                        <div class="accordion col-3" id="plan">
                          <div class="card" :ref="'cardPlan'+problem.id" style="padding-bottom: 18px;">
                            <div class="card-header" id="headingPlan" style="width: 100%;">

                              <button class="btn btn-link btn-block text-left" style="width:100%;"
                                :class="[problem.status == 'На проверке заказчика' ? 'collapsed' : '']" type="button"
                                data-toggle="collapse" data-target="#collapsePlan" aria-expanded="false"
                                aria-controls="collapsePlan" @click="onClickPlan(problem.id)">
                                <h5 class="mb-0">
                                  <chevron-up-icon v-if="problem.status == 'На проверке заказчика'" size="1.5x"
                                    class="custom-class"></chevron-up-icon>
                                  <chevron-down-icon v-else size="1.5x" class="custom-class"></chevron-down-icon>
                                  <p>
                                    План решения
                                  </p>
                                </h5>
                              </button>

                            </div>

                            <div id="collapsePlan" class="collapse"
                              :class="[problem.status == 'На проверке заказчика' ? '' : 'show']"
                              aria-labelledby="headingPlan" data-parent="#plan" style="width: 100%;">
                              <div class="card-body p-0" :ref="'cardBody'+problem.id" style="height: 100%;">
                                <!-- plan,  -->
                                <textarea placeholder="Опишите ваш план решения..." rows="6"
                                  :ref="'textarea_plan'+problem.id" style="height: 100%;min-height: 418px;"
                                  v-model="solutions[0].plan" :disabled="isResponsibleAndAdmin"
                                  @keydown.enter.prevent.exact="event => {editPlan(solutions[0].id, solutions[0].plan, event)}"
                                  @keyup.shift.enter.prevent="newLine"
                                  @focus="event => onFocusTextarea(event, problem.id, 'plan')"
                                  @blur="event => {onBlurTextarea(event, 'plan', problem.id)}"></textarea>
                                <div class="hidden" :ref="'hidden_area-plan'+problem.id">
                                  <button class="input-btn confirm"
                                    @mousedown="event => {editPlan(solutions[0].id,solutions[0].plan, event)}">
                                    <check-icon size="1.4x" class="custom-class"></check-icon>
                                  </button>
                                  <button class="input-btn cancel"
                                    @mousedown="event => onClear(event, problem.id, 'plan')">
                                    <plus-icon size="1.6x" class="custom-class" id="closeIcon"></plus-icon>
                                  </button>
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

                              <button class="btn btn-link btn-block text-left" style="width: 100%;" type="button"
                                data-toggle="collapse" data-target="#collapseResults" aria-expanded="false"
                                aria-controls="collapseResults">
                                <h5 class="mb-0">
                                  <chevron-up-icon v-if="problem.status == 'На проверке заказчика'" size="1.5x"
                                    class="custom-class"></chevron-up-icon>
                                  <chevron-down-icon v-else size="1.5x" class="custom-class"></chevron-down-icon>
                                  <p>
                                    Команда, опыт, результат решения
                                  </p>
                                </h5>
                              </button>

                            </div>

                            <div id="collapseResults" class="collapse"
                              :class="problem.status == 'На проверке заказчика' ? 'show' : ''"
                              aria-labelledby="headingResults" style="width: 100%;" data-parent="#results"
                              ref="collapsed-results">
                              <div class="card-body row p-0" style="flex-direction: row;">

                                <div class="col-4 p-2"
                                  style="flex-direction: column;display: flex;max-height: 417px;min-height: 417px;">
                                  <label style="width: 100%;">Команда</label>
                                  <div>
                                    <ss-select :options="currentTeamUsers" track-by="name" search-by="surname"
                                      v-show="user.is_admin || solutions[0].executor_id == currentUid"
                                      disable-by="disabled" class="team" id="ss-select"
                                      @change="putUserToTeam(solutions[0], $event)">
                                      <div
                                        slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                                        style="cursor: pointer; width: 100%;">
                                        <ss-select-toggle class="pl-1 py-1" style="width: 100%;">
                                          <user-icon size="1.3x" class="custom-class" id="iconUser"></user-icon>
                                          <plus-icon size="1.5x" class="custom-class" id="plusIcon"
                                            style="padding-right: 10px;vertical-align: baseline;"></plus-icon>
                                          {{ $get(selectedOption, 'name') || 'Добавить сотрудника'}}
                                          <chevron-down-icon size="1.8x" class="custom-class"
                                            style="padding-left: 10px;align-self: center;"></chevron-down-icon>
                                        </ss-select-toggle>

                                        <section v-show="isOpen" class="absolute border-l border-r min-w-full"
                                          style="top: 17%;left: 0;">
                                          <div class="px-px">
                                            <ss-select-search-input class="w-full px-3 py-2 search"
                                              placeholder="Впишите фамилию">
                                            </ss-select-search-input>
                                          </div>
                                          <ss-select-option v-for="(option, index) in filteredOptions"
                                            :value="option.id" :index="index" :key="index"
                                            class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.surname }} {{ option.name }} {{option.father_name}} </ss-select-option>
                                        </section>
                                      </div>
                                    </ss-select>

                                    <div class="current-team">
                                      <div v-if="currentTeam.length > 0">
                                        <li class="team-members" v-for="(user, idx) in currentTeam" :key="idx">
                                          <div class="member">
                                            {{idx+1}}. {{user.surname}}
                                            {{user.name}} {{user.father_name}}
                                          </div>

                                          <div class="close">
                                            <button type="button" id="close" class="close"
                                              @click="removeUserFromTeam(user.id, solutions[0].id)">
                                              <span aria-hidden="true" style="font-size: 24px;">&times;</span>
                                            </button>
                                          </div>
                                        </li>
                                      </div>

                                      <div v-else style="color: #4F4F4F;text-align: center;">
                                        Список команды пуст...
                                      </div>
                                    </div>

                                  </div>
                                </div>

                                <div class="col-4 p-2" style="flex-direction: column;display: flex;">
                                  <label style="width: 100%;">Опыт</label>
                                  <textarea placeholder="Заполните опыт по решению проблемы..." rows="6"
                                    :disabled="validatedExecutorAndAdmin" :ref="'textarea_exp'+problem.id"
                                    v-model="problem.experience"
                                    @keydown.enter.prevent.exact="event => {editExp(problem.id, problem.experience, event)}"
                                    @keyup.shift.enter.prevent="newLine"
                                    @focus="event => onFocusTextarea(event, problem.id, 'exp')"
                                    @blur="event => {onBlurTextarea( event, 'exp', problem.id)}"></textarea>
                                  <div class="hidden" :ref="'hidden_area-exp'+problem.id">
                                    <button class="input-btn confirm"
                                      @mousedown="event => {editExp(problem.id, problem.experience, event)}">
                                      <check-icon size="1.4x" class="custom-class"></check-icon>
                                    </button>
                                    <button class="input-btn cancel"
                                      @mousedown="event => onClear(event, problem.id, 'exp')">
                                      <plus-icon size="1.6x" class="custom-class" id="closeIcon"></plus-icon>
                                    </button>
                                  </div>
                                </div>

                                <div class="col-4 p-2" style="flex-direction: column;display: flex;">
                                  <label style="width: 100%;">Результат решения</label>
                                  <textarea placeholder="Заполните результат решения проблемы..." rows="6"
                                    :disabled="validatedExecutorAndAdmin" :ref="'textarea_result'+problem.id"
                                    v-model="problem.result"
                                    @keydown.enter.prevent.exact="event => {editResult(problem.id, problem.result, event)}"
                                    @keyup.shift.enter.prevent="newLine"
                                    @focus="event => onFocusTextarea(event, problem.id, 'result')"
                                    @blur="event => {onBlurTextarea(event, 'result', problem.id)}"></textarea>
                                  <div class="hidden" :ref="'hidden_area-result'+problem.id">
                                    <button class="input-btn confirm"
                                      @mousedown="event => {editResult(problem.id, problem.result, event)}">
                                      <check-icon size="1.4x" class="custom-class"></check-icon>
                                    </button>
                                    <button class="input-btn cancel"
                                      @mousedown="event => onClear(event, problem.id, 'result')">
                                      <plus-icon size="1.6x" class="custom-class" id="closeIcon"></plus-icon>
                                    </button>
                                  </div>

                                  <div
                                    :style="[solutions[0].executor_id == currentUid || problem.creator_id == currentUid || user.is_admin? {'display': 'flex'} : {'display': 'none'}]"
                                    style="margin-bottom: -37px; margin-top: 14px; justify-content: space-evenly; flex-direction: row;flex-wrap:wrap; align-items: center;">
                                    <div style="display: flex;">
                                      <span class="problem-send" v-if="problem.status == 'Решена'">Отправить на
                                        согласование</span>
                                      <button v-else
                                        v-show="problem.creator_id == currentUid && problem.status == 'На проверке заказчика' || user.is_admin && problem.status == 'На проверке заказчика'"
                                        class="btn btnMain problem-confirm y" style="margin-right: 11px;"
                                        @click="problemConfirm(problem.id)">Подтвердить
                                        решение</button>

                                      <span class="problem-send" v-if="problem.status == 'На рассмотрении'">Проблема
                                        направлена руководителю для рассмотрения</span>
                                      <button v-else
                                        v-show="problem.creator_id == currentUid && problem.status == 'На проверке заказчика' || user.is_admin && problem.status == 'На проверке заказчика'"
                                        class="btn btnMain problem-confirm"
                                        style="background-color: #EBEBEB;color: #4F4F4F;"
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

                              <button class="btn btn-link btn-block text-left" style="width: 100%;" type="button"
                                data-toggle="collapse" data-target="#collapseGroups" aria-expanded="false"
                                aria-controls="collapseGroups">
                                <h5 class="mb-0">
                                  <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                                  <p>
                                    Направление в подразделения
                                  </p>
                                </h5>
                              </button>

                            </div>

                            <div id="collapseGroups" class="collapse" aria-labelledby="headingGroups"
                              style="width: 100%;" data-parent="#groups" ref="collapsed-groups">
                              <div class="card-body p-0" v-show="!validatedExecutorAndAdmin">
                                <div class="check-inputs">
                                  <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="groupCheckAll"
                                      @click="checkAll(problem)" v-model="all">
                                    <label class="custom-control-label" for="groupCheckAll">Все</label>
                                  </div>

                                  <div class="custom-control custom-checkbox" v-for="(group, idx) in groups" :key="idx">
                                    <input type="checkbox" class="custom-control-input" :id="'groupCheck'+group.id"
                                      :value="group.id" v-model="checkedGroups">
                                    <label class="custom-control-label"
                                      :for="'groupCheck'+group.id">{{group.name}}</label>
                                  </div>
                                </div>

                                <button class="btn btnMain btn-to-groups" v-show="!validatedExecutorAndAdmin"
                                  @click="sendToGroup(problem.id, checkedGroups)">Направить</button>
                              </div>

                              <div class="card-body p-0" v-show="validatedExecutorAndAdmin">
                                <span class="groups_list" v-show="problem.groups.length == 0">Проблема не направлена ни
                                  в одно подразделение</span>
                                <div class="container__groups_list">
                                  <span class="groups_list" style="padding-bottom: 5px;"
                                    v-for="(group, idx) in problem.groups" :key="idx">{{idx+1}}. {{group.name}}</span>
                                </div>

                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="d-flex justify-content-center" style="margin-top: 20px;">
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
        </div>
      </div>


      <div v-else class="d-flex justify-content-center" style="margin-top: 20px;">
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>

      <PopupDelete v-if="openDelete" :val="paramsModal" @deleteProblem="deleteProblem(param = $event)" />
    </div>
    <div v-else>
      <span class="empty">Вы не состоите ни в одном из подразделений. Обратитесь к администратору.</span>
    </div>
  </div>

</template>

<script>
  import TooltipProblem from '@/components/TooltipProblem'
  import PopupDelete from '@/components/PopupProblems/Delete'
  import PopupShow from '@/components/Solutions/ShowSolution'
  import Tasks from '@/components/Solutions/Tasks/Tasks'

  import {
    SsSelect,
    SsSelectToggle,
    SsSelectOption,
    SsSelectSearchInput
  } from 'ss-select'

  import {
    mapGetters
  } from 'vuex'
  import {
    TrashIcon,
    PlusIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    FileTextIcon,
    ClockIcon,
    CheckIcon,
    ThumbsUpIcon,
    AlertCircleIcon,
    UserIcon,
  } from 'vue-feather-icons'

  export default {
    name: "my-problems",
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
      currentProblemCreator: '',

      isUrgent: 'Срочная',
      isImportnant: 'Важная',


      isProblemConfirmed: false,
      isProblemDeclined: false,
      isLeaderOgUser: false,

      all: false
    }),
    components: {
      TooltipProblem,
      PopupDelete,
      PopupShow,
      Tasks,

      TrashIcon,
      PlusIcon,
      ChevronUpIcon,
      ChevronDownIcon,
      FileTextIcon,
      ClockIcon,
      CheckIcon,
      ThumbsUpIcon,
      AlertCircleIcon,
      UserIcon,

      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      SsSelectSearchInput
    },

    async mounted() {
      if (!this.userHasNoGroup) {
        await this.$store.dispatch('checkIsLeader')
        await this.$store.dispatch('getMyProblems', {
          urgency: '',
          importance: '',
          deadline: '',
          status: ''
        }).catch(() => {
          this.$store.commit('setProblems', '')
        }).then(() => {
          this.$store.dispatch('countAmountOfMyProblems', {
            urgency: '',
            importance: '',
            deadline: '',
            status: 'На проверке заказчика'
          })
        })
        await this.$store.dispatch('getGroups').catch(() => this.$router.push('/login'))
        await this.$store.dispatch('getAllUsers')
      }
      await this.$store.dispatch('getGroups').catch(() => this.$router.push('/login'))
      await this.$store.dispatch('getAllUsers')
    },
    watch: {
      error404() {
        if (this.error404) {
          this.$toast.error(this.error404);
        }
      },
      isLeaderOgUser(newValue) {
        return newValue
      }
    },
    computed: {
      ...mapGetters(['problems', 'error', 'error404', 'allUsers', 'currentSolution', 'solutions', 'groups', 'user',
        'currentUid', 'user', 'isLeader', 'members', 'currentTeam', 'teamExecutors', 'currentTeamUsers',
        'userHasNoGroup'
      ]),
      validatedExecutorAndAdmin() {
        return this.solutions[0].executor_id == this.currentUid ? false : this.user.is_admin ? false : this
          .isLeaderOgUser ? false : true
      },
      isCreatorOrAdmin() {
        return this.currentProblemCreator == this.currentUid ? false : this.user.is_admin ? false : true
      },
      isCreatorLeaderOrAdmin() {
        return this.currentProblemCreator == this.currentUid ? false : this.user.is_admin ? false : this
          .isLeaderOgUser ? false : true
      },
      isResponsibleAndAdmin() {
        return this.solutions[0].executor_id == this.currentUid ? false : this.user.is_admin ? false : true
      },

      sortedData() {
        let arrnew0 = this.problems.filter(p => p.status == "В работе")
        let arrnew1 = this.problems.filter(p => p.status == "На рассмотрении")
        let arrnew2 = this.problems.filter(p => p.status == "На проверке заказчика")

        let allTogehter = {
          'В процессе решения': arrnew0,
          'На рассмотрении': arrnew1,
          'Требуют подтверждения факта решения:': arrnew2
        }

        return allTogehter
      }
    },

    methods: {
      async removeUserFromTeam(id, solution) {
        await this.$store.commit('setError404', '')
        this.$store.dispatch('removeUserFromTeam', {
          id,
          solution
        })
      },
      async putUserToTeam(sol, selectedOption) {
        await this.$store.dispatch('putUserToTeam', {
          id: sol.id,
          uid: selectedOption
        }).then(() => {

        })
      },
      clickOnCard(id, e) {
        if (e.target.tagName == 'DIV' && !e.target.classList.contains('name_div') || e.target.tagName == 'BUTTON' || e
          .target.tagName == 'H5') {
          this.$refs['button_card' + id][0].click()
        }
      },

      onClickSol(problem) {
        if (document.getElementById('collapseTasks').classList.contains('show') || problem.status ==
          'На проверке заказчика') {
          this.$refs['cardSol' + problem.id][0].style.paddingBottom = '18px'
          this.$refs['cardSol' + problem.id][0].style.overflowY = 'auto'
          this.$refs['cardSol' + problem.id][0].style.minHeight = 'auto'
        } else {
          this.$refs['cardSol' + problem.id][0].style.paddingBottom = '0px'
          this.$refs['cardSol' + problem.id][0].style.overflowY = 'scroll'
          this.$refs['cardSol' + problem.id][0].style.minHeight = '500px'
        }
      },


      onClickPlan(id) {
        document.getElementById('collapsePlan').classList.contains('show') ? this.$refs['cardPlan' + id][0].style
          .height = 'fit-content' : this.$refs['cardPlan' + id][0].style.height = 'auto'
        document.getElementById('collapsePlan').classList.contains('show') ? this.$refs['textarea_plan' + id][0].style
          .height = 'fit-content' : this.$refs['textarea_plan' + id][0].style.height = '100%'
        document.getElementById('collapsePlan').classList.contains('show') ? this.$refs['cardBody' + id][0].style
          .height = 'fit-content' : this.$refs['cardBody' + id][0].style.height = '100%'
      },
      checkAll() {
        if (!this.all) {
          this.all = true
          this.checkedGroups = []

          this.groups.forEach(element => {
            this.checkedGroups.push(element.id)
          });

        } else {
          this.all = false
          this.checkedGroups = []
        }
      },
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
        if (this.user.is_admin || this.solutions[0].executor_id == this.currentUid) {
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
          await this.$store.commit('setError404', 'У вас недостаточно прав')
        }
      },

      async changeImportance(id, importance) {
        await this.$store.commit('setError404', '')
        if (this.user.is_admin || this.solutions[0].executor_id == this.currentUid) {

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
          await this.$store.commit('setError404', 'У вас недостаточно прав')
        }
      },

      async clickProgress(id) {
        await this.$store.commit('setError404', '')
        if (this.user.is_admin || this.solutions[0].executor_id == this.currentUid) {
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

      async likeProblem(id, e) {
        e.stopPropagation()
        await this.$store.dispatch('problemLike', id)
      },

      async onClickShow(problem) {
        this.checkedGroups = []
        problem.groups ? problem.groups.forEach(element => {
          this.checkedGroups.push(element.id)
        }) : this.checkedGroups = []

        this.checkedGroups.length < this.groups.length ? this.all = false : this.all = true

        this.currentProblemCreator = problem.creator_id

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
              this.$store.commit('editTeam', '')
              this.$store.dispatch('getSol', response.id)

              this.$store.dispatch('getCurrentTeam', response.id)
              this.$store.dispatch('getTasks', response.id)
              this.$store.dispatch('getCurrentSolution', '')
              this.$store.dispatch('getCurrentSolution', response.id)
              this.mounted = true
            })
            .then(() => {
              document.getElementById('collapseTasks').classList.contains('show') ? '' : document.getElementById(
                'collapseTasks_btn').click()

              this.$refs['collapsed-results'].forEach(element => {
                element.classList.contains('show') ? this.$refs['collapseResultsBtn'].forEach(element => {
                  element.click()
                }) : ''
              });
              this.$refs['collapsed-groups'].forEach(element => {
                element.classList.contains('show') ? this.$refs['collapseGroupsBtn'].forEach(element => {
                  element.click()
                }) : ''
              })

              if ((this.members.find(m => m.id == problem.creator_id) && this.isLeader) || (problem.creator_id ==
                  this
                  .currentUid && this.isLeader)) {
                this.isLeaderOgUser = true
              } else {
                this.isLeaderOgUser = false
              }
            })
            .catch(() => {
              this.$store.dispatch('clearTasks')
            })
        }
      },

      async sendToGroup(id, groupsArray) {
        groupsArray.length > 0 ? await this.$store.dispatch('sendToGroup', {
          id,
          groupsArray
        }).then(() => {
          this.$toast.success("Проблема направлена в подразделения");
        }) : ''
      },


      async onClickInput(id, creator_id, event) {
        await this.$store.commit('setError404', '')
        this.currentProblemCreator = creator_id
        if (creator_id == this.currentUid || this.user.is_admin) {
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


      onFocusTextarea(event, id, type) {
        this.currentTextarea = event.target.value

        event.target.style.borderRadius = '9px 9px 0px 0px';
        this.$refs['hidden_area-' + type + id].forEach(element => {
          element.style.display = 'flex'
        });
      },

      onBlurTextarea(event, type, id) {
        event.target.style.borderRadius = '9px';
        this.$refs['hidden_area-' + type + id].forEach(element => {
          element.style.display = 'none'
        });
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
        if (this.user.is_admin || this.solutions[0].executor_id == this.currentUid || this.isLeader) {
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
        } else {
          //
        }
      },
      async editTeam(id, team, event) {
        event.target.blur()
        await this.$store.commit('setError404', '')
        if (this.user.is_admin || this.solutions[0].executor_id == this.currentUid) {
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
        } else {
          //
        }
      },
      async editExp(id, experience, event) {
        event.target.blur()
        await this.$store.commit('setError404', '')
        if (this.user.is_admin || this.solutions[0].executor_id == this.currentUid || this.isLeader) {
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
        } else {
          //
        }

      },
      async editResult(id, result, event) {
        event.target.blur()
        await this.$store.commit('setError404', '')
        if (this.user.is_admin || this.solutions[0].executor_id == this.currentUid || this.isLeader) {
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
        } else {
          //
        }
      },

    }
  };
</script>

<style scoped lang="scss">
  .inner-container {
    margin-top: 30px;
  }

  .problem_subtitle {
    font-family: 'GothamPro-Medium';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;

    >div {
      margin-top: 10px;
    }
  }

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
    background-color: #fff;
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
    // visibility: visible;
    justify-content: flex-end;
    border-radius: 0 0 9px 9px;
    background-color: #fff;
    height: 69px;
    display: none;
    align-items: center;
    padding-right: 10px;
    bottom: 13%;
    right: 11%;
    border: 4px solid #F6F6F6;
    border-top: none;

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
    min-height: 300px;
    height: 100%;
    width: 100%;
    outline: none;
    border: none;
    resize: none;
    background-color: #F7F7F7;
    border-radius: 9px;
    padding: 26px 24px;

    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
  }

  textarea:focus {
    background-color: #fff;
    border: 4px solid #F6F6F6;
    border-bottom: none;
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
      padding-bottom: 0;

      .card-header {
        height: fit-content;

        button {
          display: flex;
        }
      }
    }

  }

  #results,
  #groups,
  #plan {
    .card {
      padding-bottom: 13px !important;
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

    // textarea {
    //   height: 84% !important;
    // }
  }

  #collapseTasks {
    .card-body {
      background-color: #fff;
    }
  }

  #collapseResults {
    .card-body {
      margin-bottom: 38px;
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
    padding: 0;

    button {
      padding-top: 0;
      padding-bottom: 0;
      display: flex;

      h5 {
        padding-left: 16px;
      }
    }
  }

  .collapsed {
    svg {
      transform: rotate(180deg);
    }

    padding-left: 16px;
  }


  .card-header {
    align-items: center;
    border: none;
    border-radius: 9px;
    background-color: #fff;
    width: 100%;
    display: flex;
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
    margin: auto;
    padding-top: 0;
    margin-bottom: 10px;

    .card {
      width: 100%;
      background-color: transparent;
      padding-bottom: 30px;
      padding-top: 30px;
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

        p {
          padding-left: 13px;
          font-family: 'GothamPro-Medium';
          color: #4f4f4f;
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0.15px;
        }
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

  .problem-confirm:hover {
    color: #fff;
  }

  .check-inputs {
    max-height: 323px;
    min-height: 323px;
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
  #results,
  #groups {
    .card-body {
      height: fit-content;
    }
  }

  #groups {
    .card-body {
      height: fit-content;
    }

    p {
      word-break: break-word;
    }
  }

  #tasks {
    .card {
      max-height: 500px;
      overflow-y: scroll;
      padding-bottom: 0;
      min-height: 500px;
    }

    .card-header {
      width: 100%;
      width: 100%;
      position: sticky;
      top: 0;
      z-index: 10;
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

  .custom-control-label {
    cursor: pointer;
  }



  @media (max-width: 1300px) {
    * {
      font-size: 12px;

      .middle-icons_text span {
        font-size: 11px !important;
      }
    }
  }

  @media (min-width: 1430px) {
    h2 {
      max-width: 1270px;
    }
  }

  @media (min-width: 500px) {
    h2 {
      width: 75%;
    }
  }

  @media (max-width: 480px) {
    .container {
      overflow-y: visible;
    }
  }
</style>