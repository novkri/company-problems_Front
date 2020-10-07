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
    components: {
      Navbar,
      Sidebar
    }
  }
</script>

<style scoped>
  .row {
    margin: 0;
    height: 90vh;
  }


  
</style>