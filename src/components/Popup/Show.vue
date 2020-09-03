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
              <span class="subtitle">Решения в работе:</span>
              <ol>
                <li>
                  <span>1. dummy 1</span>
                  
                  <!-- <div class="input-group mb-3">
                    <select class="custom-select" id="inputGroupSelect02">
                      <option selected>Choose...</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div> -->
                  <!-- <div class="input-group"> -->
                     <div class="select">
                        <select v-model="selected" class="form-control form-control--in-work" id="exampleFormControlSelect1">
                          <!--  <option disabled value="">Выберите один из вариантов</option> -->
                          <option>В работе</option>
                          <option>Решено</option>
                          <option>Пусто ?</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                     </div>


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
      this.openSolutions = true
      // this.solutions = {...obj, test: 'test'}
      //передать все решения по проблеме
      // console.log(this.solutions);
      console.log(obj);
    }
  }
}
</script>

<style scoped lang="scss">
  .modal-header {
    border: none;
  }
  .modal-title {
    border: none;
    margin-bottom: 35px;
    padding: 0;
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-size: 24px;
    line-height: 24px;
    color: #2D453F;
  }
  .subtitle {
    font-family: 'GothamPro-Medium';
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #2D453F;
  }

  .modal-content {
    border-radius: 12px;
    border: none;
    max-width: 1096px;
    padding: 36px 30px 37px 62px;
  }
  ol {
    margin-top: 30px;
    margin-bottom: 20px;
    line-height: 24px;
    color: #2D453F;
    margin-bottom: 30px;
  }
  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    align-items: center;
    span {
      width: 555px;
    }
  }

  .btn {
    padding: 0;
    border-radius: 12px;
    width: 335px;
    height: 50px;
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
      max-width: 1096px;
      margin: 1.75rem auto;
    }
  }

  .close {
    margin-left: 91px;
  }
  .date, .date:focus {
    outline: none;
    border: none;
    position: relative;
    margin-left: 61px;
  }
  input[type="date"]::-webkit-calendar-picker-indicator {
    background: url('~@/assets/calendar.png') 100%;
    background-repeat: no-repeat;
    cursor: pointer;
    color: #6D6D6D;
    position: absolute;
    top: -2%;
    left: 75%;

  }

  .select {
    width: 158px;
    border-radius: 10px;
 
    padding: 0;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    select {
      display: block;
      width: 100%; 
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }
  }
 .select:before {
    content: url('~@/assets/Select.png');
    display: block;
    border: none;
    pointer-events: none;
    position: absolute;
    z-index: 1;
    top: 27%;
    left: 68%;
}
  .form-control {
    border-radius: 10px;
    padding: 7px 13px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
  }
  .form-control--in-work {
    background: #C4C4C4;
    border-radius: 10px;
    color: #2D453F;
  }
  .form-control--done {
    background: #4EAD96;
    border-radius: 10px;
    color: #FFFFFF;
  }


</style>