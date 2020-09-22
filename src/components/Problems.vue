<template>
  <div class="container" style="width: 1350px;">
    <h2>Список всех проблем в компании</h2>

    <ul class="list-group">
      <li class="list-group-item" v-for="(problem, idx) in paginatedData" :key="idx" id="list">
        <div class="toggle-area" @click.prevent="show(problem)" data-toggle="modal" data-target="#popupShow">
          <p> {{ problem.name }} </p>
        </div>

        <!-- <div class="creator">{{problem}} d</div>
        <div class="creator">{{allUsers.id == problem.creator_id}} f</div> -->

        <div class="icons">
          <div style="width: 50px;align-items: center;display: flex;margin: 4px 15px 4px 18px;">
            <trash-icon size="1.3x" class="custom-class" id="remove" style="margin: auto;"
              @click="deleteP(problem.id, problem.name)" data-toggle="modal" data-target="#popupDelete"></trash-icon>
          </div>
        </div>
      </li>
    </ul>

    <div class="pagination">
      <nav>
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" @click="prevPage" aria-label="Previous" :class="{'block' : pageNumber==0}">
              <chevron-left-icon size="1.5x" class="custom-class" style="color: #5F5F5F;"></chevron-left-icon>
            </a>
          </li>
          <li class="page-item">
            <span v-if="pageNumber ==0">1-25</span>
            <span v-else>{{(25 * pageNumber)+1}}-{{(25 * pageNumber)+26}}</span>
          </li>
          <li class="page-item">
            <a class="page-link" @click="nextPage" aria-label="Next" :class="{'block' : pageNumber >= pageCount - 1}">
              <chevron-right-icon size="1.5x" class="custom-class" style="color: #5F5F5F;"></chevron-right-icon>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <button type="button" class="btn btnMain" @click="create" data-toggle="modal" data-target="#popupCreate" style="margin-bottom: 30px;">
      <plus-icon size="1.5x" class="custom-class" style="color: white; margin-right: 5px;"></plus-icon><span>Предложить
        проблему</span>
    </button>




    <PopupCreate v-if="openCreate" @createProblem="createProblem(param = $event)" />
    <PopupEdit v-if="openEdit" :val="paramsModal" @editProblem="editProblem(param = $event)" />
    <PopupDelete v-if="openDelete" :val="paramsModal" @deleteProblem="deleteProblem(param = $event)" />
    <PopupShow v-if="openShow" :val="paramsModal" :tab="tab" @changeTab="changeTab(param = $event)" />
  </div>
</template>

<script>
  import PopupCreate from '@/components/Popup/Create'
  import PopupEdit from '@/components/Popup/Edit'
  import PopupDelete from '@/components/Popup/Delete'
  import PopupShow from '@/components/Solutions/Show'
  import {
    mapGetters
  } from 'vuex'
  import {
    TrashIcon,
    PlusIcon,
    ChevronRightIcon,
    ChevronLeftIcon
  } from 'vue-feather-icons'

  export default {
    name: "Problems",
    data: () => ({
      tab: true,

      openCreate: false,
      openEdit: false,
      openDelete: false,
      openShow: false,

      paramsModal: {},
      pageNumber: 0,
      size: 25,
    }),
    components: {
      PopupCreate,
      PopupEdit,
      PopupDelete,
      PopupShow,
      
      TrashIcon,
      PlusIcon,
      ChevronRightIcon,
      ChevronLeftIcon
    },

    async mounted() {
      await this.$store.dispatch('getProblems')
      await this.$store.dispatch('getAllUsers')
    },
    watch: {
      error404() {
        if (this.error404) {
          this.$toast.error(this.error404);
        }
      },
      // ??????
      // val(newValue) {
      //   this.name = newValue.name
      // }
    },
    computed: {
      ...mapGetters(['problems', 'error', 'error404', 'allUsers']),

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
      //set default tab
      changeTab(e) {
        this.tab = e
      },

      //pages
      reloadPage() {
        document.location.reload(true)
      },
      nextPage() {
        this.pageNumber++;
      },
      prevPage() {
        if (this.pageNumber > 0) {
          this.pageNumber--;
        }
      },

      // for problems
      create() {
        this.openCreate = true
        this.$store.commit('setError', '')
      },

      edit(obj) {
        this.openShow = false
        this.openEdit = true
        this.paramsModal = obj
        this.$store.commit('setError', '')
      },
      async editProblem() {
        window.location.reload(true)
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

      async show(obj) {
        this.openEdit = false
        this.openDelete = false

        this.openShow = true
        this.tab = true
        
        this.paramsModal = obj
        this.$store.commit('setError', '')
        await this.$store.dispatch('getSolutions', obj.id).then(response => {
          if (response !== undefined) {
            this.$store.dispatch('getTasks', response.id)
            this.$store.dispatch('getCurrentSolution', '')
            this.$store.dispatch('getCurrentSolution', response.id)
          } else {
            this.$store.dispatch('clearTasks')
          }
        })
      }
    }
  };
</script>

<style scoped lang="scss">
  h2 {
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 24px;
    letter-spacing: 0.15px;
    margin-bottom: 59px;
    color: #4F4F4F;
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


  @media (max-width: 500px) {
    .container {
      width: 85% !important;
    }
  }
</style>