<template>
  <div class="container" style="width: 1350px;">
    <h2>Список подразделений</h2>
    <div class="subtitle">
      <span>Название подразделения</span>
      <span>Название подразделения (сокращенно)</span>
      <span>Руководитель</span>
      <div class="pagination">
        1-25
        <nav>
         <!--  <ul class="pagination">
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
          </ul> -->
        </nav>
      </div>
    </div>
    <ul class="list-group">
      <!-- <li class="list-group-item" v-for="(Group, idx) in paginatedData" :key="idx" id="list">
        <div class="toggle-area" @click.prevent="show(Group)" data-toggle="modal" data-target="#popupShow">
          <p> {{ Group.name }} </p>
        </div>
        <div class="icons">
          <div style="width: 50px;align-items: center;display: flex;margin: 4px 15px 4px 18px;">
            <trash-icon size="1.3x" class="custom-class" id="remove" style="margin: auto;"
              @click="deleteP(Group.id, Group.name)" data-toggle="modal" data-target="#popupDelete"></trash-icon>
          </div>
        </div>
      </li> -->
    </ul>


    <!-- <button type="button" class="btn btnMain" @click="create" data-toggle="modal" data-target="#popupCreate">
      <plus-icon size="1.5x" class="custom-class" style="color: white; margin-right: 5px;"></plus-icon><span>Предложить
        проблему</span>
    </button>




    <PopupCreate v-if="openCreate" @createGroup="createGroup(param = $event)" />
    <PopupEdit v-if="openEdit" :val="paramsModal" @editGroup="editGroup(param = $event)" />
    <PopupDelete v-if="openDelete" :val="paramsModal" @deleteGroup="deleteGroup(param = $event)" />
    <PopupShow v-if="openShow" :val="paramsModal" :tab="tab" @changeTab="changeTab(param = $event)" /> -->
  </div>


</template>

<script>
  // import PopupCreate from '@/components/Groups/Create'
  // import PopupEdit from '@/components/Groups/Edit'
  // import PopupDelete from '@/components/Groups/Delete'
  // import PopupShow from '@/components/Groups/Show'

  // import {
  //   mapGetters
  // } from 'vuex'
  import {
    // TrashIcon,
    // ChevronRightIcon,
    // ChevronLeftIcon
  } from 'vue-feather-icons'

  export default {
    name: "Gropus",
    data: () => ({

    }),
    components: {
      // TrashIcon,
      // ChevronRightIcon,
      // ChevronLeftIcon,

    },
    async mounted() {
      //   await this.$store.dispatch('getGroups')
      //   await this.$store.dispatch('getAllUsers')
    },
    computed: {
      //   ...mapGetters(['Groups', 'error', 'error404', 'allUsers']),

      //   pageCount() {
      //     let l = this.Groups.length,
      //       s = this.size;
      //     return Math.ceil(l / s);
      //   },
      //   paginatedData() {
      //     const start = this.pageNumber * this.size,
      //       end = start + this.size;
      //     return this.Groups.slice(start, end);
      //   }
    },
  }
</script>

<style scoped lang="scss">
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
  }




// from Groups
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