<template>
  <div class="container">
    <button type="button" class="btn" @click="create" data-toggle="modal" data-target="#popupCreate"><img class="plus"
        src="@/assets/plus.png" alt="+"><span>Предложить проблему</span></button>

    <p></p>
    <!-- {{error}} -->
    <ul class="list-group">
      <li class="list-group-item" v-for="(problem, idx) in paginatedData" :key="idx">
        <p> {{ problem.name }}  </p>
        <div class="icons"><img @click="edit(problem)" data-toggle="modal" data-target="#popupEdit"
            src="@/assets/edit.png" alt="edit"> <img @click="deleteP(problem.id, problem.name)" data-toggle="modal"
            data-target="#popupDelete" src="@/assets/trash.png" alt="delete"></div>
      </li>
    </ul>

    <div class="pagination">
      <nav>
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link"  @click="prevPage" aria-label="Previous" :class="{'block' : pageNumber==0}">
              <img src="@/assets/chevron-left.png" alt="<">
            </a>
          </li>
          <li class="page-item">
            <span v-if="pageNumber ==0">1-25</span>
            <span v-else>{{(25 * pageNumber) + 1}}-{{50 * pageNumber}}</span>
          </li>
          <li class="page-item">
            <a class="page-link" @click="nextPage" aria-label="Next" :class="{'block' : pageNumber >= pageCount - 1}">
              <img src="@/assets/chevron-right.png" alt=">">
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <PopupCreate v-if="openCreate" :open="openCreate" @createProblem="createProblem(param = $event)" />
    <PopupEdit v-if="openEdit" :open="openEdit" :val="paramsModal" @editProblem="editProblem(param = $event)" />
    <popupDelete v-if="openDelete" :open="openDelete" :val="paramsModal"
      @deleteProblem="deleteProblem(param = $event)" />

  </div>
</template>

<script>
  import PopupCreate from '@/components/Popup/Create'
  import PopupEdit from '@/components/Popup/Edit'
  import popupDelete from '@/components/Popup/Delete'
  import {mapGetters} from 'vuex'

  export default {
    name: "Problems",
    data: () => ({
      openCreate: false,
      openEdit: false,
      openDelete: false,
      paramsModal: {
        // title: '',
        // description: ''
      },
      pageNumber: 0,
      size: 25
    }),
    components: {
      PopupCreate,
      PopupEdit,
      popupDelete
    },

    async mounted() {
      await this.$store.dispatch('getProblems')
      console.log('mounted', this.problems);
    },

    computed: {
      ...mapGetters(['problems', 'error']),
      pageCount(){
        let l = this.problems.length,
            s = this.size;
        return Math.ceil(l/s);
      },
      paginatedData(){
        console.log(this.problems);
        const start = this.pageNumber * this.size,
          end = start + this.size;
        return this.problems.slice(start, end);
      }
    },

    methods: {
      nextPage(){
         this.pageNumber++;
        //  this.$router.push({ name: 'Home', params: { page: this.pageNumber}})
      },
      prevPage(){
        if (this.pageNumber > 0) {
          this.pageNumber--;
          // this.$router.push({ name: 'Home', params: { page: this.pageNumber}})
        }  
      },
      create() {
        this.openCreate = true
      },
      async createProblem(param) {
        if (param.name.length < 250) {
          await this.$store.dispatch('postProblem', param)
        }
      },

      edit(obj) {
        this.openEdit = true
        // this.paramsModal = {
        //   id,
        //   name,
        //   created,
        //   updated
        // }
        this.paramsModal = obj
        // console.log(obj);
      },
      async editProblem(param) {
        console.log(param);
        if (param.name.length < 250) {
          console.log(param);
          await this.$store.dispatch('editProblem', param)
        }
      },

      deleteP(id, name) {
        this.openDelete = true
        this.paramsModal = {
          id,
          name
        }
      },
      async deleteProblem(param) {
        await this.$store.dispatch('deleteProblem', param)
      },
    }
  };
</script>

<style scoped lang="scss">
  // .container {
  //   width: 293px;
  //   margin: 50px;
  //   padding: 0;
  // }

  .btn {
    padding: 0;
    border-radius: 12px;
    width: 100%;
    height: 54px;
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
    padding: 1.08rem 1.25rem;

    &:last-child {
      margin-bottom: 43px;
    }
  }

  img {
    margin-left: 30px;
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