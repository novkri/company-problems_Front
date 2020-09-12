<template>
  <div class="container">
    <!-- <div class="header row"> -->
      <!-- <div class="col-sm-6">
        One of three columns
      </div>
      <div class="col-sm-1.5">
        One of three columns
      </div>
      <div class="col-sm-2">
        One of three columns
      </div>
      <div class="col-sm-2">
        One of three columns
      </div>
      <div class="col-sm-1">
        One of three columns
      </div>
    </div>
    here will be tasks for solution: 
    <div>
      {{val}}
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'tasks',
    props: ['val'],
    data: () => ({
    }),
    components: {
    },
    computed: {
      // ...mapGetters(['solutions', 'solutionsOther', 'error', 'error404', 'allUsers']),
    },  
}
</script>

<style scoped lang="scss">
  .container {
    background: #F7F7F7;
    border-radius: 9px;
    width: 1323px;
  }
</style>