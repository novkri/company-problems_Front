<template>
  <div class="container_tooltip">
    <!-- {{val}}  -->

    Предложил проблему: {{val.creator_id}} id
    Описание: ?
    Возможное решение: ?
  </div>
</template>

<script>
export default {
  name: 'tooltip',
  props: ['val'],
}
</script>

<style scoped>
  /* .container_tooltip {
    
  } */
</style>