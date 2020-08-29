<template>
  <div class="popup-edit">
    <div class="modal fade" id="popupEdit" tabindex="-1" ref="modal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <form @submit.prevent="editProblem()" class="form-group">
              <input @input="setTitle($event.target.value)" ref="input" class="form-control"
                :class="{ 'form-control--error': $v.name.$invalid }" id="new-problem-title" v-model="name" @click.prevent="editProblem()">
              <div class="error" v-if="!$v.name.maxLength">Название проблемы должно быть не более
                {{$v.name.$params.maxLength.max}} символов</div>
            </form>
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" @click="editProblem()"></div>
        </div>
         
      </div>
    </div>

  </div>

</template>

<script>
  import {
    maxLength
  } from 'vuelidate/lib/validators'
    import {mapGetters} from 'vuex'

  export default {
    name: 'popup',
    props: ['open', 'val'],
    // data: () => ({
    //   name: '',
    //   permission: false
    // }),
    data: function () {
      return {
        name: ''
      }
    },
    mounted() {
      this.name = this.val.name
    },
    validations: {
      name: {
        maxLength: maxLength(250)
      }
    },
    computed: {
      ...mapGetters(['error'])
    },
    methods: {
      setTitle(value) {
        this.name = value
        this.$v.name.$touch()
      },
      async editProblem() {
        this.val.name = this.name
        await this.$emit('editProblem', this.val)
        if (this.error) {
          document.getElementById('close').click();
        }
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
    color: red;
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