<template>
  <div class="container">
    <button type="button" class="btn btnMain" @click="create" data-toggle="modal" data-target="#popupCreate">
      <plus-icon size="1.5x" class="custom-class" style="color: white; margin-right: 5px;"></plus-icon><span>Предложить
        проблему</span>
    </button>
    <p></p>
    <ul class="list-group">
      <!-- @click.prevent="show(problem)" -->
      <li class="list-group-item" v-for="(problem, idx) in paginatedData" :key="idx" >
        <div class="toggle-area" @click.prevent="show(problem)"
        data-toggle="modal" data-target="#popupShow">
          <p> {{ problem.name }} </p>
        </div>
        
        <div class="icons">
          <edit-icon size="1x" class="custom-class" @click="edit(problem)" data-toggle="modal" data-target="#popupEdit"
            style="margin-left: 0px;"></edit-icon>
          <trash-icon size="1x" @click="deleteP(problem.id, problem.name)" class="custom-class" data-toggle="modal"
            style="margin-left: 30px;" data-target="#popupDelete"></trash-icon>
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

<!-- :open="openCreate"  -->
    <PopupCreate v-if="openCreate" @createProblem="createProblem(param = $event)" />
    <PopupEdit v-if="openEdit" :val="paramsModal" @editProblem="editProblem(param = $event)" />
    <PopupDelete v-if="openDelete" :val="paramsModal"
      @deleteProblem="deleteProblem(param = $event)" />
    <PopupShow v-if="openShow" :val="paramsModal" />
    <!-- @showProblem="showProblem(param = $event)" -->
  </div>
</template>

<script>
  import PopupCreate from '@/components/Popup/Create'
  import PopupEdit from '@/components/Popup/Edit'
  import PopupDelete from '@/components/Popup/Delete'
  import PopupShow from '@/components/Popup/Show'
  import {
    mapGetters
  } from 'vuex'
  import {
    EditIcon,
    TrashIcon,
    PlusIcon,
    ChevronRightIcon,
    ChevronLeftIcon
  } from 'vue-feather-icons'

  export default {
    name: "Problems",
    data: () => ({
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
      EditIcon,
      TrashIcon,
      PlusIcon,
      ChevronRightIcon,
      ChevronLeftIcon
    },

    async mounted() {
      await this.$store.dispatch('getProblems')
    },
    watch: {
      error404(newValue, oldValue) {
        console.log(`Updating from ${oldValue} to ${newValue}`)
        if (this.error404) {
          this.$vToastify.error(this.error404)
        }
      },
      val(newValue, oldValue) {
        console.log(`Updating from ${oldValue.name} to ${newValue.name}`)
        this.name = newValue.name
      }
    },
    computed: {
      ...mapGetters(['problems', 'error', 'error404']),
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
      show(obj) {
        this.openEdit = false,
        this.openDelete = false,
        this.openShow = true
        this.paramsModal = obj
        this.$store.commit('setError', '')
      }
    }
  };
</script>

<style scoped lang="scss">
  .btn {
    padding: 0;
    border-radius: 12px;
    width: 302px;
    height: 58px;
    background: #92D2C3;
    color: #fff;
    margin-bottom: 30px;

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
    // padding: 1.08rem 1.25rem;
    padding: 0 23px 0 0;

    &:last-child {
      margin-bottom: 43px;
    }
  }

  .toggle-area {
    width: 100%;
    cursor: pointer;
    // margin: 23px;
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
    justify-content: center;
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
</style>