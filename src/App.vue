<template>
  <div id="app">
    <component :is="layout"><router-view /> </component>
  </div>
</template>

<script>
import MainLayout from '@/layouts/Layout'
import NoneLayout from '@/layouts/NoLayout'

  export default {
    components: {
      MainLayout,
      NoneLayout
    },
    computed: {
      layout() {
        return (this.$route.meta.layout) + '-layout';
      }
    },
  }

</script>
<style>
  .form-control.input {
    border-radius: 0 10px 10px 0 !important;
    background-color: transparent;
  }
  
</style>
