<template>
  <div class="popup-show">
    <div class="modal fade" id="popupShow" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{val.name}}</h5>
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          <div class="modal-body">
            <div>
              выюрано {{selected}}
              <span>Решения в работе:</span>
              <ol>
                <li>
                  dummy 1
                  <!-- <div class="input-group mb-3">
                    <select class="custom-select" id="inputGroupSelect02">
                      <option selected>Choose...</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div> -->
                  <!-- <div class="input-group"> -->
                     
                    <select v-model="selected" class="form-control" id="exampleFormControlSelect1" style="width: 190px;">
                      <!-- <option disabled value="">Выберите один из вариантов</option> -->
                      <option>В работе</option>
                      <option>Решено</option>
                      <option>Пусто ?</option>
                      <option>4</option>
                      <option>5</option>
                    </select>

                    <input type="date" id="start" name="trip-start" class="date"
                      value="2018-07-22"
                      min="2018-01-01" max="2018-12-31">
                      
                    <button type="button" class="close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </li>
                  <li>dummy 2</li>
                  <li>dummy 3</li>
                </ol>
                   
              <button type="button" class="btn btnMain" @click.prevent="showSolutions(val)" data-toggle="modal" data-target="#popupSolutions"><span>Посмотреть/Добавить решение</span></button>
            </div>
          </div>
        </div>
         
      </div>
    </div>

    <PopupSolutions v-if="openSolutions" :open="openSolutions" :solutions="solutions" />
  </div>
</template>

<script>
import PopupSolutions from '@/components/Popup/Solutions'
export default {
  name: 'popup',
  props: ['open', 'val'],
  data: () => ({
    selected: '',
    openSolutions: false,
    solutions: {}
  }),
  components: {
    PopupSolutions,
  },
  methods: {
    showSolutions(obj) {
      this.solutions = {...obj, test: 'test'}
      //передать все решения по проблеме
      console.log(this.solutions);
    }
  }
}
</script>

<style scoped>
  .modal-header {
    border: none;
    margin-bottom: 23px;
    padding: 0;
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
  }

  .modal-content {
    border-radius: 12px;
    border: none;
    width: 860px;
    /* height: 340px; */
    padding: 41px 45px 35px 45px;
  }
  ol {
    margin-top: 30px;
    margin-bottom: 20px;
  }
  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    align-items: center;
  }

  .btn {
    padding: 0;
    border-radius: 12px;
    width: 302px;
    height: 58px;
    background: #92D2C3;
    color: #fff;
    margin: 0 auto;

    font-size: 18px;
    line-height: 17px;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'GothamPro-Medium';
  }
  @media (min-width: 576px) {
    .modal-dialog {
      max-width: 860px;
      margin: 1.75rem auto;
    }
  }

  .date, .date:focus {
    outline: none;
    border: none;
  }
  input[type="date"]::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendar.png') 100%;
    background-repeat: no-repeat;
    cursor: pointer;
}

</style>