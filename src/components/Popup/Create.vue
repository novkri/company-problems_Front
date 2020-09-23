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
            <div style="width: 100%; display: flex;">
              <form @submit.prevent="addProblem()" class="form-group">
              <div class="input-group">
                <input type="text" ref="input" v-model="name" class="form-control form-control--valid"
                  id="new-problem-title" placeholder="Название проблемы..." @blur="onBlur($event)" @focus="onFocus($event)"
                  :class="{ 'form-control--error': $v.name.$invalid, 'form-control--valid': name && !$v.name.$invalid}">
                <div class="input-group-append" @mousedown="onClear">
                  <span class="input-group-text">&times;</span>
                </div>
              </div>  
            </form>
            <button type="submit" class="btn btnMain" @click="addProblem()">
              <img src="@/assets/Vector.png" alt="send">
            </button>
            </div>
            <div class="error" v-if="error">{{error}}</div>
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
      onBlur(event) {
        event.target.nextSibling.style.display = 'none'
      },
      onFocus(event) {
        event.target.nextSibling.style.display = 'flex'
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
    flex-direction: column;
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
  .input-group {
    // display: flex;
    // flex-direction: row;
    // position: relative;
    // padding-bottom: 51px;
    position: relative;
  }
#new-problem-title {
  border-radius: 6px;
}
  .input-group-append {
    display: none;
    position: absolute;
    border: transparent;
    background-color: transparent;
    // top: 20%;
    top: 0;
    right: 0;
    z-index: 10;
  }

  .input-group-text {
    border: transparent;
    background-color: transparent;
    cursor: pointer;
    height: fit-content;
    background-color: transparent;
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