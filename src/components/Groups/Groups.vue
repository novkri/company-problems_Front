<template>
  <div class="sfdf" style="height: 50vh;padding-top: 77px;">
    <h2>Список подразделений</h2>
    <div class="subtitle row">
      <span class="col-3">Название подразделения</span>
      <span class="col-4">Название подразделения (сокращенно)</span>
      <span class="col-3" style="display: flex;
    justify-content: center;">Руководитель</span>
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
              <span v-else>{{(10 * pageNumber)+1}}-{{(10 * pageNumber)+11}}</span>
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
            <div class="name col-4">
              <h5 class="mb-0" style="height: 100%;">
                <button class="btn btn-link collapsed" data-toggle="collapse" :data-target="'#collapseOne'+group.id"
                  @click="showOnClickUsers(group.id)" aria-expanded="false" :aria-controls="'collapseOne'+group.id">
                  <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                </button>
                <input class="form-control input-name"
                  @keyup.enter="event => {editGroupName(group.name, group.id, event)}" v-model="group.name"
                  @focus="onFocusInput($event)" @blur="onBlurInput($event)">
                <div class="hidden">
                  <button class="input-btn" @mousedown="event => {editGroupName(group.name, group.id, event)}">
                    <check-icon size="1x" class="custom-class"></check-icon>
                  </button>
                  <button class="input-btn" @mousedown="onClear($event)">
                  <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
                </button>
                </div>


              </h5>
            </div>
            <div class="short-name col-4">
              <!-- style="width: fit-content;" -->
              <input class="form-control input-name"
                @keyup.enter="event => {editGroupShort(group.short_name, group.id, event)}" v-model="group.short_name"
                @focus="onFocusInput($event)" @blur="onBlurInput($event)">
              <div class="hidden">
                <button class="input-btn" @mousedown="event => {editGroupShort(group.short_name, group.id, event)}">
                  <check-icon size="1x" class="custom-class"></check-icon>
                </button>
                <button class="input-btn" @mousedown="onClear($event)">
                <plus-icon size="1x" class="custom-class" id="closeIcon"></plus-icon>
              </button>
              </div> 
            </div>

            <div class="selectResponsible col-3"> {{group.leader_id}}
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
                @click="deleteGroup(group.id)">
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


                    <!-- <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseOneAdd"
                    aria-expanded="false" aria-controls="collapseOneAdd">
                    <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon>
                  </button> -->
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

    <PopupConfirm v-if="openConfirm" :val="newLeader" @setNewLeader="setNewLeader(param = $event)" />
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
      ChevronUpIcon,
      UserIcon,
      ChevronDownIcon,
      AwardIcon,
      CheckIcon,


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
        console.log(this.groups);
        const start = this.pageNumber * this.size,
          end = start + this.size;
        console.log(this.groups.slice(start, end));
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
      showOnClickUsers(id) {
        this.openShowUsers = true
        this.currentGroupId = id
      },
      createG() {
        this.openCreateGroup = true
        this.$store.commit('setError', '')
      },
      onBlurInput(event) {
        event.path[0].nextElementSibling.classList.remove('flex')
        // console.log(this.currentGroupName);
        // this.currentGroupName
        // console.log('blur', event);
        // event.target.value = this.currentGroupName
      },
      onFocusInput(event) {
        this.currentGroupName = event.target.value
        this.currentGroupInput = event.target
        event.path[0].nextElementSibling.classList.add('flex')
        console.log(this.currentGroupName);
      },

      onClear(event) {
        event.preventDefault()
        console.log(event.target.parentElement.parentElement.previousSibling.value);
        event.target.parentElement.parentElement.previousSibling.value = ''
        // console.log(this.currentGroupName);
        // // this.currentGroupName = ''
        // console.log(this.currentGroupName);
      },
      async editGroupShort(short_name, id, event) {
        // event.preventDefault()
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editGroupShort', {
            short_name,
            id
          })
          .then(() => {})
          .catch(() => {
            this.$store.commit('editGroupShort', {
              short_name: this.currentGroupName,
              id
            })
          })
        event.target.blur()
        event.path[2].classList.remove('flex')
      },
      async editGroupName(name, id, event) {
        // event.preventDefault()
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('editGroup', {
            name,
            id
          })
          .then(() => {})
          .catch(() => {
            this.$store.commit('editGroup', {
              name: this.currentGroupName,
              id
            })
          })
        event.target.blur()
        event.path[2].classList.remove('flex')
      },

      deleteGroup(id) {
        this.openDeleteGroup = true
        this.paramsModal = {
          id
        }
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
        this.$store.dispatch('changeExecutorGroup', {
            id: param.groupId,
            uid: param.leader_id
          })
          .then((r) => {
            console.log(r);
            this.$store.commit('changeLeader', param.leader_id)
          })
          .catch(() => {
            this.$store.commit('editExecutorGroup', {
              id: param.groupId,
              leader_id: this.currentExecutor
            })
          })
      },


      async putUserToGroup(groupId, uId) {
        await this.$store.commit('setError404', '')

        this.$store.dispatch('putUserToGroup', {
          id: groupId,
          uid: uId
          // })
        })
        // .catch(() => {
        //   this.$store.commit('changeExecutorGroup', {
        //     id: group.id,
        //     leader_id: this.currentExecutor
        //   })
        // })
      },



      //pages
      // reloadPage() {
      //   document.location.reload(true)
      // },
      nextPage() {
        // this.openShowUsers = false
        document.getElementsByClassName('btn-link')[0].click()
        this.pageNumber++;
      },
      prevPage() {
        // this.openShowUsers = false
        document.getElementsByClassName('btn-link')[0].click()
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
    // margin-right: 20px;
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
    // width: 35px;
    width: auto;
    height: 32px;
    margin-left: 8px;
    background-color: #F4F4F4;
    border-radius: 8px;
    // font-size: 27px;
    // align-items: center;

    svg {
      color: #4F4F4F;
      vertical-align: text-top;
    }
  }

  .hidden {
    visibility: hidden;
    // width: 90px;
  }

  .flex {
    display: flex;
    visibility: visible;
  }


  #remove {
    display: none;
    margin: 0;
    justify-content: flex-end;
    // align-items: center;
    // margin-bottom: 5px;
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
    // margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    // padding-left: 45px;
    padding-left: 68px;
    // margin-left: 10px;
    // width: 100%;
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
    height: 60px;
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
      // margin: 0 10px;
    }
  }

  #closeIcon {
    transform: rotate(45deg);
  }

  .input-name {
    cursor: pointer;
    background-color: #fff;
    border-radius: 8px;
    // width: fit-content;
    width: 100%;
  }

  .input-name:active,
  .input-name:focus {
    background-color: #F4F4F4;
    // width: 100%;

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
    // background-color: #F6F6F6;
    padding-left: 10px;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #828282;


    #ss-select {
      // padding-left: 8px;
      align-items: center;
      display: flex;
      height: 36px;
      // background-color: #F4F4F4;
      background-color: #fff;
      border-radius: 10px;
      text-align: center;
      // padding-right: 0;
      width: fit-content;
      border-radius: 8px;
      // min-width: 231px;
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

  // #iconUser {
  // position: relative;
  // }
  #plusIcon {
    //  position: absolute;
    //  top: 0%;
    //  right: -34%;
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
    // margin-bottom: 59px;
    color: #4F4F4F;
    // margin-left: 55px;
    // width: 71%;
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
      align-self: center;

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
    .container {
      width: 85% !important;
    }
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