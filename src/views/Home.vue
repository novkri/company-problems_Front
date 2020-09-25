<template>
  <div>
    <h2>Список всех проблем в компании</h2>
    <div class="container">

      <ul class="list-group">
        <li class="list-group-item" v-for="(problem, idx) in paginatedData" :key="idx" id="list">
          <div class="toggle-area" @click.prevent="show(problem)" data-toggle="modal" data-target="#popupShow">
            <p> {{ problem.name }} </p>
          </div>

          <!-- <div class="creator">{{problem}} d</div>
        <div class="creator">{{allUsers.id == problem.creator_id}} f</div> -->

          <div class="icons">
            <div class="trash-icon">
              <trash-icon size="1.3x" class="custom-class" id="remove" style="margin: auto;"
                @click="deleteP(problem.id, problem.name)" data-toggle="modal" data-target="#popupDelete"></trash-icon>
            </div>
          </div>
        </li>
      </ul>

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
    <!-- <PopupEdit v-if="openEdit" :val="paramsModal" @editProblem="editProblem(param = $event)" /> -->
    <PopupDelete v-if="openDelete" :val="paramsModal" @deleteProblem="deleteProblem(param = $event)" />
    <PopupShow v-if="openShow" :val="paramsModal" :tab="tab" @changeTab="changeTab(param = $event)" />
  </div>

</template>

<script>
  import PopupCreate from '@/components/PopupProblems/Create'
  // import PopupEdit from '@/components/Popup/Edit'
  import PopupDelete from '@/components/PopupProblems/Delete'
  import PopupShow from '@/components/Solutions/ShowSolution'

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
    name: "problems",
    data: () => ({
      tab: true,

      openCreate: false,
      // openEdit: false,
      openDelete: false,
      openShow: false,

      paramsModal: {},
      pageNumber: 0,
      size: 25,
    }),
    components: {
      PopupCreate,
      // PopupEdit,
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

      async show(obj) {
        // this.openEdit = false
        this.openDelete = false
        this.openShow = true
        this.tab = true
        this.paramsModal = obj

        this.$store.commit('setError', '')
        await this.$store.dispatch('getSolutions', obj.id).then(response => {
          if (response) {
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
  .container {
    width: 1370px;
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

  .btn {
    padding: 0;
    border-radius: 12px;
    width: 302px;
    height: 58px;
    background: #92D2C3;
    color: #fff;
    // margin: auto;

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
    .container {
      max-width: 1370px;
    }

    h2 {
      max-width: 1270px;
    }
  }

  @media (min-width: 500px) {
    .container {
      width: 85% !important;
    }

    h2 {
      width: 75%;
    }
  }
</style>