<template>
  <div class="popup-edit">
    <div class="modal fade" id="popupEdit" tabindex="-1" ref="modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <form @submit.prevent="editProblem()" class="form-group">
              <input @input="setTitle($event.target.value)" ref="input" class="form-control"
                :class="{ 'form-control--error': $v.name.$invalid }" id="new-problem-title" v-model="name">
                <!-- @keyup.enter="editProblem()" -->
              <!-- <div class="error" v-if="!$v.name.maxLength">Название проблемы должно быть не более
                {{$v.name.$params.maxLength.max}} символов</div> -->
                <!-- <div class="error" v-if="!$v.name.minLength">{{error}}</div> -->
                <div class="error" v-if="error">{{error}}</div>
            </form>
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" @click="editProblem()">
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
    props: ['open', 'val'],

    data: function () {
      return {
        name: '',

      }
    },
    mounted() {
      this.name = this.val.name
    },
    validations: {
      name: {
        minLength: minLength(6),
        maxLength: maxLength(250)
      }
    },
    computed: {
      ...mapGetters(['error', 'error404']),
      
    },
    watch: {
      error404(newValue, oldValue) {
        console.log(`Updating from ${oldValue} to ${newValue}`)
        if (this.error404) {
          this.$vToastify.error(this.error404)
        }
      },
      val(newValue, oldValue) {
        console.log(`Updating from ${oldValue.name} to ${newValue.name}`)
        this.name = newValue.name
      }
    },
    methods: {
      setTitle(value) {
        this.name = value
        this.$v.name.$touch()
      },
      async editProblem() {
          await this.$store.dispatch('checkIfExists', {id: this.val.id})
          .then(async () => {
            if (this.val.name !== this.name) {
              await this.$store.dispatch('editProblem', {id: this.val.id, name: this.name})
            }
          })
          .catch(() => console.log('d', this.error404))
        
      },
      close() {
        document.getElementById('close').click()
        this.$store.commit('setError', '')
        this.$emit('editProblem')
      }
    }
  }
</script>

<style scoped>
  .modal-header {
    padding: 0;
  }

  .modal-content {
    border-radius: 12px;
    border: none;
    width: 806px;
    height: 360px;
    padding: 27px 27px 35px 19px;
  }

  .modal-body {
    font-size: 16px;
    color: #CDCDCD;
  }

  form {
    margin-bottom: 0;
  }

  .form-control {
    border: none;
    border-radius: 6px;
    background-color: #F0F0F0;
    color: #2D453F;
    width: 573px;
    font-size: 18px;
    caret-color: #92D2C3;
  }

  .error {
    font-size: 12px;
    color: #FF8585;
  }

  #new-problem-desc {
    font-size: 16px;
    color: #CDCDCD;
    resize: none;
    height: 200px;
    margin-top: 20px;
  }

  .close {
    margin-right: -6px;
    font-weight: 200;
    color: #2D453F;
    opacity: 1;
  }

  .modal-header {
    border: none;
  }

  .modal-body {
    margin: 10px 22px 39px 22px;
    padding: 0;
  }

  .btn {
    background-color: #92D2C3;
    border-radius: 50;
  }


  @media (min-width: 576px) {
    .modal-dialog {
      max-width: 806px;
      margin: 1.75rem auto;
    }
  }
</style>