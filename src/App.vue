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
        console.log(this.$route.meta);
          return (this.$route.meta.layout) + '-layout';
      }
    },
  }

</script>
