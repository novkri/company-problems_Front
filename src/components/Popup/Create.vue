<template>
  <div class="popup-create">
    <div class="modal fade" id="popupCreate" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Предложить проблему</h5>
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close" @click="close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @keyup.enter="addProblem()" class="form-group">
              <div class="input-group">
                <input type="text" ref="input" v-model="name" class="form-control form-control--valid"
                  id="new-problem-title" placeholder="Название проблемы..." @blur="showClear = false" @focus="onFocus">
                <div class="input-group-append" v-if="showClear" @click="onClear">
                  <span class="input-group-text">&times;</span>
                </div>
                <div class="error" v-if="error">{{error}}</div>
              </div>
              <!-- <input ref="input" type="text" class="form-control form-control--valid "
                id="new-problem-title" v-model="name" placeholder="Название проблемы..." > -->
              <!-- <div class="error" v-if="!$v.name.maxLength">Название проблемы должно быть не более
                {{$v.name.$params.maxLength.max}} символов</div> -->
              <!-- <div class="error" v-if="!$v.name.minLength">{{error}}</div> -->
              <!-- <div class="error" v-if="error">{{error}}</div> -->
            </form>
            <button type="submit" class="btn btnMain" @click="addProblem()">
              <img src="@/assets/Vector.png" alt="send">
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {
    maxLength,
    minLength
  } from 'vuelidate/lib/validators'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'popup',
    props: ['open'],
    data: () => ({
      name: '',
      showClear: false
    }),
    validations: {
      name: {
        minLength: minLength(6),
        maxLength: maxLength(250)
      }
    },
    watch: {
      error() {
        // console.log(`Updating from ${oldValue} to ${newValue}`);
      }
    },
    computed: {
      ...mapGetters(['error'])
    },

    methods: {
      onFocus() {
        this.showClear = true
      },
      onClear() {
        this.name = ''
      },
      async addProblem() {
        await this.$store.dispatch('postProblem', {
          name: this.name
        }).then(() => {
          if (!this.error) {
            this.name = ''
            document.getElementById('close').click()
          }
        })
      },

      close() {
        this.name = ''
        this.$store.commit('setError', '')
      }
    }
  }
</script>

<style scoped lang="scss">
  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 30px 20px 40px 20px;
    width: 530px;
    height: 186px;
  }

  .modal-header {
    border: none;
    margin-bottom: 23px;
    padding: 0;
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
  }

  .modal-body {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }

  .form-control {
    background-color: #F7F7F7;
  }

  .form-control:active,
  .form-control:focus {
    background-color: #FFF;
  }

  .input-group-text {
    border: none;
    cursor: pointer;
    background-color: #F7F7F7;
    border-radius: 6px;
    border-bottom: 2px solid #92D2C3;
  }

  .btn {
    background-color: #92D2C3;
    border-radius: 50px;
    border: none;
    height: 34px;
    width: 34px;
    position: relative;
  }

  .close {
    margin-right: -4px;
    font-weight: normal;
    color: #2D453F;
    opacity: 1;
    font-family: 'GothamPro';
  }

  .btn img {
    position: absolute;
    top: 8px;
    left: 9px;
  }
</style>