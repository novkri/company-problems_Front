<template>
  <div class="layout">
    <Navbar />
    <div class="row">
      <Sidebar />
      <div class="content col">
        <router-view :key="$route.path"/>
      </div>


<div class="addProblem">
        <button type="button" class="btn btnMainAdd" @click="create" data-toggle="modal" data-target="#popupCreate">
          <plus-icon size="1.4x" class="custom-class"></plus-icon> <span>Предложить проблему</span>
        </button>
      </div>


<PopupCreate v-if="openCreate" @createProblem="createProblem(param = $event)" />
    </div>
  </div>
</template>

<script>
import {
    PlusIcon,
  } from 'vue-feather-icons'
  // import {
  //   mapGetters
  // } from 'vuex'
  import PopupCreate from '@/components/PopupProblems/Create'

  import Navbar from '@/components/NavBar'
  import Sidebar from '@/components/SideBar'
  export default {
    name: 'main-layout',
    data: () => ({
      openCreate: false,
    }),
    components: {
      PlusIcon,

      Navbar,
      Sidebar,
      PopupCreate
    },

    methods: {
      create() {
        this.openCreate = true
        this.$store.commit('setError', '')
      },
    }
  }
</script>

<style scoped lang="scss">

  .row {
    margin: 0;
    height: 90vh;
  }
  .content {
    max-width: 81%;
    padding-right: 0;
  }
  .addProblem {
    display: none;
  }

  @media (min-width: 1600px) {
    .content {
    max-width: 84%;
    padding-right: 0;
  }
  }
  

    @media (max-width: 500px) {
    .content {
    max-width: 100%;
    padding-right: 0;
  }
  .addProblem {
    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;

    button {
      margin-bottom: 10px;
    }
  }
  }
</style>