<template>
  <div class="popup-solutions">
    <div class="modal fade" id="popupSolutions" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          <div class="modal-body">
            <div>
              Solutions
              {{solutions}}
            </div>
          </div>
        </div>
         
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'popup',
  props: ['open', 'solutions'],
  data: () => ({
    // selected: '',
    // openSolutions: false,
    // solutions: {}
  }),
  mounted() {
    console.log("mounted");
  }
//   methods: {
//     showSolutions(obj) {
//       this.solutions = obj //передать все решения по проблеме
//       console.log(this.solutions);
//     }
//   }
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