<template>
  <div class="container_tooltip">
    <div class="main-tooltip">
      <div>
        <span>Предложил проблему: </span>
        {{allUsers.find(u => u.id === val.creator_id).surname}}
        {{allUsers.find(u => u.id === val.creator_id).name}} {{allUsers.find(u => u.id === val.creator_id).father_name}}
      </div>
      <div>
        <span>Описание: </span>{{val.description}}</div>
      <div>
        <span>Возможное решение: </span>{{possible_solution}}</div>

      <!-- {{problem_creator}} -->
    </div>

  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'tooltip',
    props: ['val'],
    data: () => ({
      problem_creator: ''
    }),
    computed: {
      ...mapGetters(['problems', 'error', 'error404', 'allUsers', 'currentSolution', 'solutions', 'groups', ]),
      // creator: function () {
      // this.problem_creator = this.allUser.find(u => u.id == this.val.creator_id)
      // // return this.message.split('').reverse().join('')
      // return this.problem_creator
      // }

      // },
      // watch: {
      //   problem_creator: function (value) {
      //     console.log(value);
      //     this.problem_creator = this.allUser.find(u => u.id == this.val.creator_id)
      //   },
      // }
    },
    mounted() {
      // console.log('d');
      // this.problem_creator = this.allUser.find(u => u.id == this.val.creator_id)
    }
  }
</script>

<style scoped lang="scss">
  .container_tooltip {
    width: 100%;
  }

  .main-tooltip {
    margin-top: 30px;
    width: 100%;
    flex-direction: column;

    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    text-align: justify;
    letter-spacing: 0.15px;
    color: #4F4F4F;

    span {
      margin-bottom: 31px;
      font-family: 'GothamPro-Medium';
      margin-right: 5px;
    }
  }
</style>