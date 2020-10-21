<template>
  <div class="layout">
    <Navbar />
    <div class="row">
      <Sidebar />
      <div class="content col">
        <router-view :key="$route.path"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Navbar from '@/components/NavBar'
  import Sidebar from '@/components/SideBar'
  export default {
    name: 'main-layout',
    data: () => ({
      openCreate: false,
    }),
    components: {
      Navbar,
      Sidebar,
    },

  }
</script>

<style scoped lang="scss">

  .row {
    margin: 0;
    height: 88vh;
  }
  .content {
    max-width: 81%;
    padding-right: 0;
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

  }
</style>