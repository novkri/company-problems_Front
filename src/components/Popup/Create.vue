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
            <!-- @submit="addProblem()" -->
            <form @keyup.enter="addProblem()" class="form-group">
              <input ref="input" type="text" class="form-control form-control--valid" :class="{ 'form-control--error': $v.name.$invalid }"
                id="new-problem-title" v-model="name" placeholder="Название проблемы..." >
                <div class="error" v-if="!$v.name.maxLength">Название проблемы должно быть не более
                {{$v.name.$params.maxLength.max}} символов</div>
                <!-- <div class="error" v-if="!$v.name.minLength">{{error}}</div> -->
                <div class="error" v-if="error">{{error}}</div>
            </form>
            <!-- data-dismiss="modal"  -->
            <button type="submit" class="btn btnMain" @click="addProblem()"
              :disabled="!name">
              <img src="@/assets/Vector.png" alt="send">
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {maxLength, minLength} from 'vuelidate/lib/validators'
  import {mapGetters} from 'vuex'

  export default {
    name: 'popup',
    props: ['open'],
    data: () => ({
      name: ''
    }),
    validations: {
      name: {
        minLength: minLength(6),
        maxLength: maxLength(250)
      }
    },
    watch: {
      error(newValue, oldValue) {
        console.log(`Updating from ${oldValue} to ${newValue}`);
      }
    },
    computed: {
      ...mapGetters(['error'])
    },

    methods: {
      async addProblem() {
        await this.$store.dispatch('postProblem', {name: this.name}).then(() => {
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

<style scoped>
  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 30px 20px 40px 20px;
    width: 530px;
    height: 163px;
  }

  /* .form-control {
    border: transparent;
    border-bottom: 2px solid #92D2C3;
    border-radius: 6px;
    background-color: #FAFAFA;
    color: #2D453F;
    margin-bottom: 3px;
    caret-color: #92D2C3;
  }

  .error {
    font-size: 12px;
    color: red;
  } */

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

  /* form {
    margin-right: 30px;
    width: 85%;
  }

  .form-control--error {
    border: 1px solid red;
    border-bottom: 2px solid red;
  } */

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