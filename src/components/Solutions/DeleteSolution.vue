<template>
  <div class="modal fade" id="popupDeleteSolution" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Вы точно хотите удалить решение?</h5>
          <button type="button" class="close" @click="closeDeleteSolutions" data-dismiss="modal" style="font-size: 24px;"
            data-target="#popupDeleteSolution">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <button type="submit" class="btn btn-secondary" @click="deleteSolution(val)" data-dismiss="modal"
            data-target="#popupDeleteSolution">Да</button>
          <button type="reset" class="btn btn-secondary" data-dismiss="modal" data-target="#popupDeleteSolution"
            @click="closeDeleteSolutions">Отменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'popup',
    props: ['openDeleteS', 'val'],
    data: () => ({
      name: '',
    }),
    computed: {
      ...mapGetters(['error', 'error404']),
    },
    methods: {
      closeDeleteSolutions() {
        this.$emit('closeDeleteSolutions')
      },

      async deleteSolution(id) {
        this.$emit('closeDeleteSolutions')
        await this.$store.dispatch('deleteSolution', id)
      }
    }
  }
</script>

<style scoped>
  .modal-content {
    border-radius: 12px;
    border: none;
    width: 487px;
    padding: 30px 87px 25px;
    line-height: 24px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .modal-title {
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #2D453F;
  }

  #new-problem-title {
    border: none;
    border-bottom: 2px solid #92D2C3;
    border-radius: 6px;
    background-color: #FAFAFA;
    color: #CDCDCD;
    margin: 0 10px;
  }

  .modal-header {
    border: none;
    padding: 0 0 32px 0;
  }

  .modal-body {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }

  .btn {
    background-color: #F5F5F5;
    border: none;
    color: #000;
    width: fit-content;
    padding: 5px 27px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    font-family: 'GothamPro';
    color: #000000;
  }

  .close {
    margin-right: -83px;
    margin-top: -34px;
    font-weight: normal;
    color: #2D453F;
    opacity: 1;
  }

  @media (min-width: 576px) {
    .modal-dialog {
      max-width: 487px;
      margin: 1.75rem auto;
    }
  }
</style>