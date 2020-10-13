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
        <p><span>Описание: </span>
        </p> 
        <p @click="event => changeProblemDesc(val.id, val.creator_id, event)" class="desc" v-show="!isEditDesc" :style="[val.description ? {'background-color': '#f9f9f9'} : {}]">{{val.description}}</p>
        <input v-show="isEditDesc" v-model="val.description" @blur="event => onBlurDesc(event, val.id)"
          @keyup.enter="onEnterDesc($event)" class="form-control desc" :ref="'descInput'+val.id" />
      </div>

      <div>
        <p><span>Возможное решение: </span>
        </p> 
        <p @click="event => changePossible(val.id, val.creator_id, event)" class="possible" v-show="!isEditPossible" :style="[val.possible_solution ? {'background-color': '#f9f9f9'} : {}]">
          {{val.possible_solution}}</p>
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

      newInputDesc: '',
      newInput: ''
    }),
    computed: {
      ...mapGetters(['problems', 'error', 'error404', 'allUsers', 'currentSolution', 'solutions', 'groups', 'currentUid', 'user']),

    },
    methods: {
      async changeProblemDesc(id,creator_id, event) {
        await this.$store.commit('setError404', '')
        if (creator_id == this.currentUid || this.user.is_admin) {
        this.isEditDesc = true
        this.newInputDesc = event.target.textContent
        this.$nextTick(() => {
          this.$refs['descInput' + id].focus()
          event.target.style.display = 'none'
        })
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
              description: this.newInputDesc
            })
          })
          !this.val.description ? this.isEditDesc = true : this.isEditDesc = false
      },

      async changePossible(id, creator_id, event) {
        await this.$store.commit('setError404', '')
        if (creator_id == this.currentUid || this.user.is_admin) {

        this.isEditPossible = true
        this.newInput = event.target.textContent

        this.$nextTick(() => {
          event.target.style.display = 'none'
          this.$refs['possibleInput' + id].focus()
        })
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
.desc, .possible {
  background-color: #ebebeb;
  min-width: 189.8px;
  min-height: 33.5px;
  border-radius: 6px;
  padding-top: 4px;
  align-self: normal;
  cursor: pointer;
}
  .form-control.desc,
  .form-control.possible {
    background-color: #ebebeb;
    width: auto;
  }

  p {
    word-break: break-word;
    span {
      cursor: default;
    }
  }

  .container_tooltip {
    width: 100%;
    margin-top: 30px;
  }

  .main-tooltip {
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