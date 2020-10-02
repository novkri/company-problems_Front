<template>
  <div style="height: 50vh;padding-top: 77px;">
    <h2>Список подразделений</h2>
    <div class="subtitle row" style="width: 89%;">
      <span class="col-4">Название подразделения</span>
      <span class="col-4">Название подразделения (сокращенно)</span>
      <span class="col-2">Руководитель</span>
      <div class="pagination col-2">
        <nav>
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" @click="prevPage" aria-label="Previous" :class="{'block' : pageNumber==0}">
                <chevron-left-icon size="1.5x" class="custom-class" style="color: #5F5F5F;"></chevron-left-icon>
              </a>
            </li>
            <li class="page-item">
              <span v-if="pageNumber ==0">1-10</span>
              <span v-else>{{(10 * pageNumber)+1}}-{{(10 * pageNumber)+10}}</span>
            </li>
            <li class="page-item">
              <a class="page-link" @click="nextPage" aria-label="Next" :class="{'block' : pageNumber >= pageCount - 1}">
                <chevron-right-icon size="1.5x" class="custom-class" style="color: #5F5F5F;"></chevron-right-icon>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="container">
      <div id="accordion">
        <div class="card" id="card" v-for="(group, idx) in paginatedDataGroups" :key="idx">
          <div class="card-header row" id="heading">
            <div class="name col-5">
              <h5 class="mb-0" style="height: 100%;">
                <button class="btn btn-link collapsed" data-toggle="collapse" :data-target="'#collapseOne'+group.id"
                  @click="showOnClickUsers(group.id)" aria-expanded="false" :aria-controls="'collapseOne'+group.id">
                  <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                </button>
                <div class="name_div" @click="event => {onClickInput(group.id, 'name',event)}">
                  <span :ref="'name-div'+group.id">{{group.name}}</span>

                  <input class="form-control input-name" :id="'groupname'+group.id" style="display: none;"
                    :ref="'group-name' + group.id" @keyup.enter="event => {editGroupName(group.name, group.id, event)}"
                    v-model="group.name" @focus="event => onFocusInput(event, group.id, 'name')"
                    @blur="event => {onBlurInput(group.name, group.id, event, 'name')}">

                  <div class="hidden" :ref="'hidden'+group.id">
                    <button class="input-btn" @mousedown="event => {editGroupName(group.name, group.id, event)}">
                      <check-icon size="1x" class="custom-class"></check-icon>
                    </button>
                    <div @mousedown="event => onClear(event, group.id, 'name')">
                      <button class="input-btn">
                        <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </h5>
            </div>
            <div class="short-name col-3">
              <div class="short-name_div" @click="event => {onClickInput(group.id, 'short', event)}">
                <span :ref="'short-name-div'+group.id">{{group.short_name}}</span>

                <input class="form-control input-name" :id="'groupshort'+group.id" style="display: none;"
                  :ref="'group-name-short' + group.id"
                  @keyup.enter="event => {editGroupShort(group.short_name, group.id, event)}" v-model="group.short_name"
                  @focus="event => onFocusInput(event, group.id, 'short')"
                  @blur="event => {onBlurInput(group.short_name, group.id, event, 'short')}">
                <div class="hidden" :ref="'hidden-short' + group.id">
                  <button class="input-btn" @mousedown="event => {editGroupShort(group.short_name, group.id, event)}">
                    <check-icon size="1x" class="custom-class"></check-icon>
                  </button>
                  <div @mousedown="event => onClear(event, group.id, 'short')">
                    <button class="input-btn">
                      <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="selectResponsible col-3">
              <ss-select v-model="group.leader_id" :options="allUsersReduced.filter(u => u.group_id == group.id)"
                track-by="name" search-by="name" @change="selectExecutorGroup(group, $event)" disable-by="disabled"
                id="ss-select" style="width: fit-content;">
                <div slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                  @click.once="onClickExecutor(group.leader_id)" style="cursor: pointer; width: 100%;">
                  <ss-select-toggle class="flex items-center justify-between" style="width: 100%; padding: 0px;">
                    <award-icon size="1.5x" class="custom-class"></award-icon>
                    {{ $get(selectedOption, 'name') || 
                  `${allUsersReduced.find(u => u.id == group.leader_id) ? allUsersReduced.find(u => u.id == group.leader_id).surname + ' ' 
                    + allUsersReduced.find(u => u.id == group.leader_id).name + ' ' 
                    + allUsersReduced.find(u => u.id == group.leader_id).father_name: 'Выбрать'}`}}
                    <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
                  </ss-select-toggle>

                  <section v-show="isOpen" class="absolute border-l border-r min-w-full">
                    <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id" :index="index"
                      data-toggle="modal" data-target="#groupConfirm" :key="index"
                      class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.surname }} {{ option.name }} {{ option.father_name }} </ss-select-option>
                  </section>
                </div>
              </ss-select>
            </div>
            <div style="width: 50px;height: 100%;" class="icons col-1">
              <button type="button" class="close" id="remove" data-toggle="modal" data-target="#groupDelete"
                @click="deleteGroup(group)">
                <trash-icon size="1x" class="custom-class"></trash-icon>
              </button>
            </div>
          </div>


          <div :id="'collapseOne'+group.id" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
              <div class="card">
                <div class="card-header" id="headingOneAdd">
                  <h5 class="mb-0">

                    <div>
                      <ss-select :options="usersNoGroup" track-by="name" search-by="name" disable-by="disabled"
                        id="ss-select" style="width: fit-content;" @change="putUserToGroup(group.id, $event)">
                        <div
                          slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                          style="cursor: pointer; width: 100%;">
                          <ss-select-toggle class="pl-1 pr-4 py-1 flex items-center justify-between"
                            style="width: 100%; padding: 13px;">
                            <user-icon size="1.5x" class="custom-class" id="iconUser"></user-icon>
                            <plus-icon size="1x" class="custom-class" id="plusIcon"></plus-icon>
                            {{ $get(selectedOption, 'name') || 'Добавить сотрудника'}}
                            <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
                          </ss-select-toggle>

                          <section v-show="isOpen" class="absolute border-l border-r min-w-full"
                            style="top: 66%;left: 6%;">
                            <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id"
                              :index="index" :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.surname }} {{ option.name }} {{option.father_name}} </ss-select-option>
                          </section>
                        </div>
                      </ss-select>
                    </div>
                  </h5>
                </div>

                <div id="collapseOneAdd" class="collapse" aria-labelledby="headingOneAdd" data-parent="#collapseOne">
                  <div class="card-body">
                    <input type="text">
                  </div>
                </div>
              </div>
              <ShowUsers v-if="openShowUsers && currentGroupId==group.id" :val="currentGroupId" />
            </div>
          </div>
        </div>
      </div>
    </div>


    <button type="button" class="btn btnMain" @click="createG" data-toggle="modal" data-target="#groupCreate"
      style="margin: 100px auto 30px;">
      <plus-icon size="1.5x" class="custom-class" style="color: white; margin-right: 5px;"></plus-icon><span>Добавить
        подразделение</span>
    </button>


    <GroupCreate v-if="openCreateGroup" @createGroup="createGroup(param = $event)" />
    <GroupDelete v-if="openDeleteGroup" :val="paramsModal" @deleteGroup="deleteGroup(param = $event)" />

    <PopupConfirm v-if="openConfirm" :val="newLeader" @setNewLeader="setNewLeader(param = $event)"
      @undoChanges="undoChanges(param = $event)" />
  </div>
</template>

<script>
  import GroupCreate from '@/components/Groups/Create'
  import GroupDelete from '@/components/Groups/DeleteGroup'
  import PopupConfirm from '@/components/Groups/PopupConfirm'
  import ShowUsers from '@/components/Groups/Users/ShowUsers'

  import {
    mapGetters
  } from 'vuex'
  import {
    SsSelect,
    SsSelectToggle,
    SsSelectOption,
  } from 'ss-select'
  // // SsSelectSearchInput
  import {
    TrashIcon,
    PlusIcon,
    ChevronUpIcon,
    UserIcon,
    ChevronDownIcon,
    AwardIcon,
    CheckIcon,

    ChevronRightIcon,
    ChevronLeftIcon
  } from 'vue-feather-icons'

  export default {
    name: "Gropus",
    data: () => ({
      showDropdown: false,
      openDeleteGroup: false,
      openCreateGroup: false,
      openShowUsers: false,
      openConfirm: false,

      currentGroupName: '',
      currentGroupInput: '',
      currentExecutor: '',
      currentGroupId: '',

      arrowDown: true,

      paramsModal: {},
      newLeader: {},

      pageNumber: 0,
      size: 10,
    }),
    components: {
      GroupCreate,
      GroupDelete,
      ShowUsers,
      PopupConfirm,

      TrashIcon,
      ChevronRightIcon,
      ChevronLeftIcon,
      PlusIcon,
      CheckIcon,
      ChevronUpIcon,
      UserIcon,
      ChevronDownIcon,
      AwardIcon,



      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      // // SsSelectSearchInput

    },
    async mounted() {
      await this.$store.dispatch('getGroups')
      await this.$store.dispatch('getAllUsers')
    },
    computed: {
      ...mapGetters(['groups', 'error', 'error404', 'allUsers', 'members', 'usersNoGroup', 'allUsersReduced']),

      pageCount() {
        let l = this.groups.length,
          s = this.size;
        return Math.ceil(l / s);
      },
      paginatedDataGroups() {
        const start = this.pageNumber * this.size,
          end = start + this.size;
        return this.groups.slice(start, end);
      }
    },
    watch: {
      error404() {
        if (this.error404) {
          this.$toast.error(this.error404);
        }
      },
    },
    methods: {
      onClickInput(id, type, event) {
        event.target.style.display = 'none'
        this.$nextTick(() => {
          if (type == 'name') {
            this.$refs['group-name' + id][0].style.display = 'flex'
            this.$refs['group-name' + id][0].focus()
          } else {
            this.$refs['group-name-short' + id][0].style.display = 'flex'
            this.$refs['group-name-short' + id][0].focus()
          }
        })
      },

      showOnClickUsers(id) {
        this.openShowUsers = true
        this.currentGroupId = id
      },
      createG() {
        this.openCreateGroup = true
        this.openDeleteGroup = false
        this.$store.commit('setError', '')
        document.getElementsByClassName('btn-link').forEach(element => {
          element.classList.contains('collapsed') ? '' : element.click()
        });
      },


      async onBlurInput(name, id, event, type) {
        console.log(name, this.currentGroupName, id);
        if (name !== this.currentGroupName) {
          type === 'name' ? this.$store.dispatch('editGroup', {
            id,
            name
          }).catch((e) => {
            console.log(e);
            this.$store.commit('editGroup', {
              id,
              name: this.currentGroupName
            })
          }) : this.$store.dispatch('editGroupShort', {
            id,
            short_name: name
          }).catch(() => {
            this.$store.commit('editGroupShort', {
              id,
              short_name: this.currentGroupName
            })
          })
        }

        if (type == 'name') {
          this.$refs['group-name' + id][0].style.display = 'none'
          this.$refs['name-div' + id][0].style.display = 'initial'
          this.$refs['hidden' + id][0].classList.remove('flex')
        } else {
          this.$refs['group-name-short' + id][0].style.display = 'none'
          this.$refs['short-name-div' + id][0].style.display = 'initial'
          this.$refs['hidden-short' + id][0].classList.remove('flex')
        }
      },

      onFocusInput(event, id, type) {
        console.log(event.target.value);
        this.currentGroupName = event.target.value
        this.currentGroupInput = event.target

        type == 'name' ? this.$refs['hidden' + id][0].classList.add('flex') : this.$refs['hidden-short' + id][0]
          .classList.add('flex')

      },

      onClear(event, id, type) {
        event.preventDefault()
        type === 'name' ? this.$store.commit('editGroup', {
          name: this.currentGroupName,
          id
        }) : this.$store.commit('editGroupShort', {
          short_name: this.currentGroupName,
          id
        })
      },

      async editGroupShort(short_name, id, event) {
        await this.$store.commit('setError404', '')
        console.log(short_name, 'short_name');
        if (short_name !== this.currentGroupName) {
          await this.$store.commit('editGroupShort', {
            short_name,
            id
          })
        }

        event.target.blur()
      },

      async editGroupName(name, id, event) {
        await this.$store.commit('setError404', '')

        if (name !== this.currentGroupName) {
          await this.$store.commit('editGroup', {
            name,
            id
          })
        }

        event.target.blur()
      },

      deleteGroup(group) {
        this.openDeleteGroup = true
        this.openCreateGroup = false
        this.paramsModal = {
          group
        }
        document.getElementsByClassName('btn-link').forEach(element => {
          element.classList.contains('collapsed') ? '' : element.click()
        });
      },

      onClickExecutor(leader) {
        this.currentExecutor = leader
      },
      selectExecutorGroup(group, event) {
        this.openConfirm = true
        this.newLeader = {
          groupId: group.id,
          leader_id: event
        }
      },
      async setNewLeader(param) {
        await this.$store.commit('setError404', '')
        // this.$store.dispatch('getMembers', param.groupId)
        this.$store.dispatch('changeExecutorGroup', {
            id: param.groupId,
            uid: param.leader_id
          })
          .then((r) => {
            console.log(r);
            // this.$store.dispatch('getMembers', param.groupId)
            // this.$store.commit('changeLeader', param.leader_id)
            this.$store.commit('editExecutorGroup', {
              id: param.groupId,
              leader_id: param.leader_id
            })
            this.$store.commit('changeLeader', param.leader_id)
            this.currentExecutor = param.leader_id
          })
          .catch((e) => {
            console.log(e);
            this.$store.commit('editExecutorGroup', {
              id: param.groupId,
              leader_id: this.currentExecutor
            })
          })
      },

      async undoChanges(param) {
        console.log('undoChanges');
        console.log(param)
        console.log(this.currentExecutor)
        await this.$store.commit('setError404', '')
        await this.$store.commit('editExecutorGroup', {
          id: param.groupId,
          leader_id: this.currentExecutor
        })
      },


      async putUserToGroup(groupId, uId) {
        await this.$store.commit('setError404', '')

        await this.$store.dispatch('putUserToGroup', {
          id: groupId,
          uid: uId
        }).then(() => {
          this.$store.dispatch('getAllUsers')
        })
        // .catch(() => {
        //   this.$store.commit('changeExecutorGroup', {
        //     id: group.id,
        //     leader_id: this.currentExecutor
        //   })
        // })
      },


      nextPage() {
        document.getElementsByClassName('btn-link').forEach(element => {
          element.classList.contains('collapsed') ? '' : element.click()
        });
        this.pageNumber++;
      },
      prevPage() {
        document.getElementsByClassName('btn-link').forEach(element => {
          element.classList.contains('collapsed') ? '' : element.click()
        });
        if (this.pageNumber > 0) {
          this.pageNumber--;
        }
      },
    },

  }
</script>

<style scoped lang="scss">
  .container {
    width: 95%;
    height: inherit;
    overflow-y: scroll;
    margin-top: 10px;
  }

  #accordion {
    width: inherit;
    margin: auto;
    height: auto;
  }

  .name_div,
  .short-name_div {
    font-family: 'GothamPro';
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #000000;
    display: flex;
    height: fit-content;
    flex: 0 0 auto;
    width: 100%;

    span {
      flex: 0 0 auto;
      width: 100%;
    }
  }

  .short-name_div {
    justify-content: center;
  }

  .name {
    padding-left: 0;
  }

  .form-control,
  #ss-select {
    height: 32px;
  }

  .input-btn {
    border: none;
    width: auto;
    height: 32px;
    margin-left: 8px;
    background-color: #F4F4F4;
    border-radius: 8px;

    svg {
      color: #4F4F4F;
      vertical-align: text-top;
    }
  }

  .hidden {
    visibility: hidden;
    display: flex;
    height: fit-content;
  }

  .flex {
    display: flex;
    visibility: visible;
  }

  #remove {
    display: none;
    margin: 0;
    justify-content: flex-end;
    margin-top: 5px;
  }

  #card:hover #remove {
    display: flex;
    width: 50px;
  }

  .subtitle {
    font-family: 'GothamPro';
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    display: flex;
    justify-content: space-between;
    padding-left: 68px;
    height: auto;

    width: 79%;
    margin: 0 auto 15px;
  }


  .card {
    border: none;
    margin-bottom: 16px;
  }

  .card-header {
    border: 2px solid #ECEBF4;
    border-radius: 9px;
    background-color: #fff;
    width: 100%;
    display: flex;
    min-height: 60px;
    height: fit-content;
    // height: 60px;
  }

  .card-body {
    width: 84%;
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
        color: #92D2C3;
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

  section {
    top: 62%;
  }

  .short-name,
  .selectResponsible {
    text-align: center;
  }

  .short-name {
    display: flex;
    justify-content: center;
  }

  .close {
    svg {
      color: #9b9b9b;
      cursor: pointer;
    }
  }

  #closeIcon {
    transform: rotate(45deg);
  }

  .input-name {
    cursor: pointer;
    background-color: #fff;
    border-radius: 8px;
    width: 100%;
    font-size: 18px;
    line-height: 24px;
  }

  .input-name:active,
  .input-name:focus {
    background-color: #F4F4F4;
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

  .selectResponsible {
    display: flex;
    padding-left: 10px;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #828282;
    justify-content: center;

    #ss-select {
      align-items: center;
      display: flex;
      height: 36px;
      background-color: #fff;
      border-radius: 10px;
      text-align: center;
      width: fit-content;
      border-radius: 8px;
      justify-content: space-between;
      padding: 0;

      div {
        justify-content: space-between;
        display: flex;
      }
    }

    select {
      margin: 0;
      width: 142px;
      background-color: #f6f6f6;
    }

  }

  .selectResponsible:hover {
    #ss-select {
      background-color: #e5e9f1;
    }
  }

  .selectResponsible:focus,
  .selectResponsible:active {
    color: #fff;

    #ss-select {
      background-color: #4EAD96;
    }

    svg {
      color: #fff !important;
    }

  }

  #plusIcon {
    vertical-align: super;
    margin-right: 11px;
  }

  // from Groups
  h2 {
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    margin: 0 auto 59px;
  }

  .btn {
    padding: 0;
    border-radius: 12px;
    width: 302px;
    height: 58px;
    background: #92D2C3;
    color: #fff;
    margin: auto;

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

  .collapsed {
    transform: rotate(180deg);
    padding-left: 16px;
  }

  .icons {
    justify-content: flex-end;
  }


  .plus {
    margin-left: 0;
    margin-right: 9px;
  }

  h5 {
    display: flex;
    flex-direction: row;
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
  }

  .pagination {
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0;
    padding: 0;
  }

  .page-link {
    background: none;
    border: none;
    color: #5F5F5F;
    margin: 0;
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
    color: #5F5F5F;
  }

  .page-item a {
    padding: 0;
    margin: 0 15px;
  }

  .borderline {
    margin: -2px 0;
    padding: 10px 26px;
    border-right: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
  }


  @media (max-width: 1500px) {
    svg {
      font-size: 20px !important;
    }

    .page-item a {
      margin: 0 9px;
    }

    #headingOneAdd {
      height: auto;
    }


    h2 {
      font-size: 20px;
    }

    .subtitle {
      padding-left: 0;
      align-items: center;
    }

    .selectResponsible #ss-select div {
      // justify-content: center;
      width: 100%;

    }

    #remove {
      align-self: center;

      svg {
        font-size: 20px !important;
      }
    }

    .input-btn {
      height: 25px;
      align-self: flex-start;

      svg {
        vertical-align: middle;
      }
    }
  }

  @media (min-width: 1400px) {
    .container {
      max-width: 1350px;
    }

    h2 {
      max-width: 1270px;
    }
  }

  @media (max-width: 1200px) {
    .btnMain {
      width: 200px;
    }
  }

  @media (min-width: 500px) {
    // .container {
    //   width: 85% !important;
    // }

    h2 {
      width: 64%;
    }

    .subtitle {
      width: 73%;
      padding-left: 68px !important;
    }
  }

  .col-3 {
    // height: 100%  !important;
    padding: 0px;
  }
</style>