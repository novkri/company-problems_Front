<template>
  <div class="container_tooltip">
    <div class="main-tooltip">

      <div>
        <p style="align-self: baseline;"><span>Предложил проблему: </span>
          {{allUsers.find(u => u.id === val.creator_id).surname}}
          {{allUsers.find(u => u.id === val.creator_id).name}}
          {{allUsers.find(u => u.id === val.creator_id).father_name}}</p>
      </div>

      <div>
        <p style="align-self: baseline;"><span>Описание: </span>
        </p> 
        <p @click="event => changeProblemDesc(val.id, val.creator_id, event)" class="desc" v-show="!isEditDesc" :style="[val.creator_id == currentUid ? {'cursor': 'pointer'} : {'cursor': 'default'}]">{{val.description}}</p>
        <p @click="event => changeProblemDesc(val.id, val.creator_id, event)" class="desc" v-show="!val.description" :style="[val.creator_id == currentUid ? {'cursor': 'pointer'} : {'cursor': 'default'}]">
          <input class="form-control desc"  v-show="!emptyInputIsClicked" @click="emptyInputIsClicked = true"
            placeholder="Введите описание...">
        </p>
        <input v-show="isEditDesc" v-model="val.description" @blur="event => onBlurDesc(event, val.id)"
          @keyup.enter="onEnterDesc($event)" class="form-control desc" :ref="'descInput'+val.id" />
      </div>

      <div>
        <p style="align-self: baseline;"><span>Возможное решение: </span>
        </p>
        <p @click="event => changePossible(val.id, val.creator_id, event)" class="possible" v-show="!isEditPossible">
          {{val.possible_solution}}</p>
        <p @click="event => changePossible(val.id, val.creator_id, event)" class="possible" v-show="!val.possible_solution">
          <input class="form-control possible" v-show="!emptyInputPossibleIsClicked" :disabled="val.creator_id !== currentUid"
            @click="emptyInputPossibleIsClicked = true" placeholder="Введите решение...">
        </p>

        <input v-show="isEditPossible" v-model="val.possible_solution" @blur="event => onBlurPossible(event, val.id)"
          @keyup.enter="onEnterPossible($event)" class="form-control possible" :ref="'possibleInput'+val.id" />
      </div>

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
      problem_creator: '',
      mounted: false,
      emptyInputIsClicked: false,
      emptyInputPossibleIsClicked: false,

      isEditDesc: false,
      isEditPossible: false,

      // newInput: '',
      newInput: ''
    }),
    computed: {
      ...mapGetters(['problems', 'error', 'error404', 'allUsers', 'currentSolution', 'solutions', 'groups', 'currentUid']),

    },
    methods: {
      async changeProblemDesc(id,creator_id, event) {
        await this.$store.commit('setError404', '')
        if (creator_id == this.currentUid) {
          this.isEditDesc = true
        this.newInput = event.target.textContent
        this.$nextTick(() => {
          this.$refs['descInput' + id].focus()
        })
        } else {
          // await this.$store.commit('setError404', 'не хватает прав')
        }
        
      },

      onEnterDesc(event) {
        event.target.blur()
      },

      async onBlurDesc(event, id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('changeProblemDescription', {
            id,
            description: this.val.description
          })
          .catch(() => {
            this.isEditDesc = true
            this.$store.commit('changeProblemDescription', {
              id,
              description: this.newInput
            })
          })
          !this.val.description ? this.isEditDesc = true : this.isEditDesc = false
      },

      async changePossible(id, creator_id, event) {
        await this.$store.commit('setError404', '')
        if (creator_id == this.currentUid) {

        this.isEditPossible = true
        this.newInput = event.target.textContent

        this.$nextTick(() => {
          this.$refs['possibleInput' + id].focus()
        })
        } else {
          // await this.$store.commit('setError404', 'не хватает прав')
        }
      },

      onEnterPossible(event) {
        event.target.blur()
      },

      async onBlurPossible(event, id) {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('changePossible', {
            id,
            possible_solution: this.val.possible_solution
          })
          .catch(() => {
            this.isEditPossible = false
            this.$store.commit('changePossible', {
              id,
              possible_solution: this.newInput
            })
          })
          !this.val.possible_solution ? this.isEditPossible = true : this.isEditPossible = false
      }
    }

  }
</script>

<style scoped lang="scss">
  .form-control.desc,
  .form-control.possible {
    background-color: #F6F6F6;
    width: auto;
  }

  p {
    word-break: break-word;
  }

  .container_tooltip {
    width: 100%;
  }

  .main-tooltip {
    // margin-top: 30px;
    width: 100%;
    flex-direction: column;

    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    text-align: justify;
    letter-spacing: 0.15px;
    color: #4F4F4F;

    div {
      margin-bottom: 31px;
      align-items: center;
    }

    span {
      font-family: 'GothamPro-Medium';
      margin-right: 5px;
      word-break: keep-all;
    }
  }
</style>