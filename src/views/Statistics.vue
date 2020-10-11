<template>
  <div class="main-statistics">
    <!-- Statistics
      {{statisticQuantitativeIndicators}}
      <hr>
      {{statisticCategories}}
      <hr>
      {{statisticQuarterly}} -->
    <div class="accordion" id="accordionStatistics">
      <div class="card">
        <div class="card-header" id="statisticQuantitativeIndicators">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
              data-target="#collapse_statisticQuantitativeIndicators" aria-expanded="true"
              aria-controls="collapse_statisticQuantitativeIndicators">
             <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon> Количественные показатели по проблемам
            </button>
          </h2>
        </div>

        <div id="collapse_statisticQuantitativeIndicators" class="collapse show"
          aria-labelledby="statisticQuantitativeIndicators" data-parent="#accordionStatistics">
          <div class="card-body">
            <div>
              {{statisticQuantitativeIndicators}}

              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon
            officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3
            wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan
            excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
            you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
          </div>
        </div>
      </div>


      <div class="card">
        <div class="card-header" id="statisticCategories">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
              data-target="#collapse_statisticCategories" aria-expanded="true"
              aria-controls="collapse_statisticCategories">
              <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon> Динамика выявления и решения проблем за 4 последних квартала
            </button>
          </h2>
        </div>

        <div id="collapse_statisticCategories" class="collapse show" aria-labelledby="statisticCategories"
          data-parent="#accordionStatistics">
          <div class="card-body">
            <div>
              {{statisticCategories}}

              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon
            officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3
            wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan
            excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
            you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
            
          </div>
        </div>
      </div>


      <div class="card">
        <div class="card-header" id="statisticQuarterly">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
              data-target="#collapse_statisticQuarterly" aria-expanded="true"
              aria-controls="collapse_statisticQuarterly">
              <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon> Отдельные категории проблем
            </button>
          </h2>
        </div>

        <div id="collapse_statisticQuarterly" class="collapse show" aria-labelledby="statisticQuarterly"
          data-parent="#accordionStatistics">
          <div class="card-body">
            <div>
              {{statisticQuarterly}}
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon
            officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3
            wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
            Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan
            excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
            you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
          </div>
        </div>
      </div>



    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
    import {
    ChevronUpIcon
  } from 'vue-feather-icons'


  export default {
    name: 'statistics',
    // data: 
    components: {
      ChevronUpIcon
    },
    computed: {
      ...mapGetters(['statisticQuantitativeIndicators', 'statisticCategories', 'statisticQuarterly']),
    },
    async mounted() {
      await this.$store.dispatch('getStatisticQuantitativeIndicators')
      await this.$store.dispatch('getStatisticCategories')
      await this.$store.dispatch('getStatisticQuarterly')
    }
  }
</script>

<style lang="scss" scoped>
  .main-statistics {
    padding-top: 40px;
    padding-left: 54px;
  }

  .accordion {
    // max-width: 1252px;
    max-width: 95%;

    .card {
      border: none;
      border-radius: 9px;

      .card-header {
        background-color: #F2F5FA;
        border-radius: 9px;
        border-bottom: none;
        padding: 25px 16px;
      }

      button {
        padding: 0;
        font-family: 'GothamPro';
        font-size: 18px;
        line-height: 17px;
        color: #4F4F4F;
        text-decoration: none;
      }
    }
  }

  .collapse {
    background-color: #F2F5FA;
    margin-bottom: 21px;
  }

  .card-body {
    div {
      background-color: #fff;
      padding: 27px 45px;
      border-radius: 9px;
    }
  }

  .collapsed {
    svg {
      transform: rotate(180deg);
    }
    padding-left: 16px;
  }


  // @media (max-width: 1700px) {
  //   .accordion {
  //     max-width: 95%;
  //   }
  // }
</style>