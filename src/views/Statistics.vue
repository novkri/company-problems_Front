<template>
  <div class="main-statistics" v-show="_isMounted">
    <div class="accordion" id="accordionStatistics">
      <div class="card">
        <div class="card-header" id="statisticQuantitativeIndicators"
          @click="clickCard('statisticQuantitativeIndicators')">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
              data-target="#collapse_statisticQuantitativeIndicators" aria-expanded="true" ref="statisticQuantitativeIndicators"
              aria-controls="collapse_statisticQuantitativeIndicators">
              <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon> Количественные показатели по
              проблемам
            </button>
          </h2>
        </div>

        <div id="collapse_statisticQuantitativeIndicators" class="collapse"
          aria-labelledby="statisticQuantitativeIndicators" data-parent="#accordionStatistics">
          <div class="card-body">
            <div class="container-list">
              <ol style="width: 80%;">
                <li class="header_li with_border">Категория</li>
                <li class="with_border li-category_titles"
                  :style="[title == '1.1. Решено' || title == '1.2. Не решено' ? {'padding-left': '58px'} : {}]"
                  v-for="(item, title) in statisticQuantitativeIndicators" :key="title">{{title}}
                </li>
              </ol>
              <ol style="width: 20%;">
                <li class="header_li">Количество и/или (%)</li>
                <li v-for="(item, title) in statisticQuantitativeIndicators" :key="title"
                  style="white-space: break-spaces;">
                  {{item}}
                  <span v-show="title == '1.1. Решено' || title == '1.2. Не решено'">
                    ({{ ( 1 / (totalAmountOfProblems / 100 / item)).toFixed(0) }} %)
                  </span>
                  <span
                    v-show="title == '5. Кол-во и процент проблем, решенных на уровне сотрудник - руководитель сотрудника (процент от общего кол-ва решенных проблем)'">
                    ({{ ( 1 / (totalAmountOfSolved / 100 / item)).toFixed(0) }} %)
                  </span>
                </li>
              </ol>

            </div>
          </div>
        </div>
      </div>


      <div class="card">
        <div class="card-header" id="statisticCategories" @click="clickCard('statisticCategories')">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
              data-target="#collapse_statisticCategories" aria-expanded="true" ref="statisticCategories"
              aria-controls="collapse_statisticCategories">
              <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon> Динамика выявления и решения проблем
              за 4 последних квартала
            </button>
          </h2>
        </div>

        <div id="collapse_statisticCategories" class="collapse" aria-labelledby="statisticCategories"
          data-parent="#accordionStatistics">
          <div class="card-body">
            <div class="container-list">

              <ol style="width: 40%;">
                <li class="header_li with_border">Категория\Квартал</li>
                <li class="with_border li-quartals_title">Кол-во выявленных проблем (квартал/всего)</li>
                <li class="with_border li-quartals_title">Кол-во проблем, планируемых к решению (квартал)</li>
                <li class="with_border li-quartals_title">Кол-во решенных проблем (квартал/всего)</li>
              </ol>

              <ol style="width: 15%;">
                <li class="header_li with_border quartal-header">
                  {{Object.values(statisticQuarterly1)[0]}}
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly1)[1]}}
                  ({{Object.values(statisticQuarterly1)[2]}})
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly1)[3]}}
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly1)[4]}}
                  ({{Object.values(statisticQuarterly1)[5]}})
                </li>
              </ol>

              <ol style="width: 15%;">
                <li class="header_li with_border quartal-header">
                  {{Object.values(statisticQuarterly2)[0]}}
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly2)[1]}}
                  ({{Object.values(statisticQuarterly2)[2]}})
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly2)[3]}}
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly2)[4]}}
                  ({{Object.values(statisticQuarterly2)[5]}})
                </li>
              </ol>

              <ol style="width: 15%;">
                <li class="header_li with_border quartal-header">
                  {{Object.values(statisticQuarterly3)[0]}}
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly3)[1]}}
                  ({{Object.values(statisticQuarterly3)[2]}})
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly3)[3]}}
                </li>
                <li class="with_border">
                  {{Object.values(statisticQuarterly3)[4]}}
                  ({{Object.values(statisticQuarterly3)[5]}})
                </li>
              </ol>

              <ol style="width: 15%;">
                <li class="header_li quartal-header">
                  {{Object.values(statisticQuarterly4)[0]}}
                </li>
                <li>
                  {{Object.values(statisticQuarterly4)[1]}}
                  ({{Object.values(statisticQuarterly4)[2]}})
                </li>
                <li>
                  {{Object.values(statisticQuarterly4)[3]}}
                </li>
                <li>
                  {{Object.values(statisticQuarterly4)[4]}}
                  ({{Object.values(statisticQuarterly4)[5]}})
                </li>
              </ol>

            </div>
          </div>
        </div>
      </div>


      <div class="card">
        <div class="card-header" id="statisticQuarterly1" @click="clickCard('statisticQuarterly1')">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
               data-target="#collapse_statisticQuarterly1" aria-expanded="true" ref="statisticQuarterly1"
              aria-controls="collapse_statisticQuarterly1">
              <chevron-up-icon size="1.5x" class="custom-class"></chevron-up-icon> Отдельные категории проблем
            </button>
          </h2>
        </div>

        <div id="collapse_statisticQuarterly1" class="collapse" aria-labelledby="statisticQuarterly1"
          data-parent="#accordionStatistics">
          <div class="card-body">

            <div class="container-list">

              <table v-if="statisticCategories">
                <thead>
                  <tr class="header_li">
                    <td class="with_border">Категория</td>
                    <td>Значение</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="with_border">1. Проблема (проблемы) с наибольшим кол-во “лайков” </td>
                    <td><span v-for="(problem, idx) in statisticCategories[0][1]" :key="idx">
                        {{problem.name}},
                      </span>
                      <span>
                        {{ statisticCategories[0][1].reduce((acc, curr) => acc.likes_count > curr.likes_count ? acc.likes_count : curr.likes_count) }}
                        лайка(ов)
                      </span></td>
                  </tr>
                  <tr>
                    <td class="with_border">2. Проблема, которая не решается дольше всего с указанием дней с момента
                      заведения в системе</td>
                    <td>
                      {{ statisticCategories[1][1][0].name }}
                      <!-- даты -->
                      <!-- {{ new Date(statisticCategories[1][1][0].created_at).toLocaleString() }}
                  {{ new Date().toLocaleString() }} -->

                      {{ ((new Date().getTime() - new Date(statisticCategories[1][1][0].created_at).getTime()) / (1000 * 60 * 60 * 24)).toFixed(0) }}
                      дней
                    </td>
                  </tr>
                  <tr>
                    <td class="with_border">3. Сотрудник (сотрудники), являющийся ответственным за решение для
                      наибольшего кол-ва нерешенных проблем</td>
                    <td>
                      {{ statisticCategories[2][1][0].surname }}
                      {{ statisticCategories[2][1][0].father_name ? statisticCategories[2][1][0].name[0]+'.' : statisticCategories[2][1][0].name[0]+'.,'}}
                      {{ statisticCategories[2][1][0].father_name ? statisticCategories[2][1][0].father_name[0]+'.,' : '' }}
                      {{ statisticCategories[2][1][0].solutions_count}} проблем(ы)
                      <!-- <br>
<br>
{{ statisticCategories[2][1]}}
{{ statisticCategories[2][1].length - 1 }} -->
                    </td>
                  </tr>
                </tbody>

              </table>

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
    data: () => ({
      // statisticCategories: []
    }),
    components: {
      ChevronUpIcon
    },
    computed: {
      ...mapGetters(['statisticQuantitativeIndicators', 'statisticCategories', 'statisticQuarterly1',
        'statisticQuarterly2', 'statisticQuarterly3', 'statisticQuarterly4', 'totalAmountOfProblems',
        'totalAmountOfSolved'
      ]),
    },
    async mounted() {
      await this.$store.dispatch('getStatisticQuantitativeIndicators')
      await this.$store.dispatch('getStatisticCategories')
      await this.$store.dispatch('getStatisticQuarterly')
    },
    methods: {
      clickCard(id_string) {
        document.getElementById(id_string).style.borderRadius = '9px 9px 0px 0px';
        this.$refs[id_string].click()
      }
    },
  }
</script>

<style lang="scss" scoped>
  .main-statistics {
    padding-top: 40px;
    padding-left: 54px;
  }

  .accordion {
    max-width: 95%;

    .card {
      border: none;
      border-radius: 9px;
      margin-bottom: 21px;

      .card-header {
        background-color: #F2F5FA;
        border-radius: 9px;
        border-bottom: none;
        padding: 25px 16px;
      }

      button {
        padding: 0;
        font-family: 'GothamPro-Medium';
        font-size: 18px;
        line-height: 17px;
        color: #4F4F4F;
        text-decoration: none;
      }
    }
  }

  .collapse {
    background-color: #F2F5FA;
  }

  .card-body {
    div {
      background-color: #fff;
      border-radius: 9px;
    }
  }

  .collapsed {
    svg {
      transform: rotate(180deg);
    }

    padding-left: 16px;
  }

  .container-list {
    display: flex;
  }

  ol {
    list-style: none;
    padding: 0;
    margin-bottom: 0;
  }

  li {
    font-family: 'GothamPro';
    font-size: 14px;
    line-height: 13px;
    color: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #E7E5F1;
    height: 49px;


  }

  tr {
    font-family: 'GothamPro';
    font-size: 14px;
    line-height: 13px;
    color: #000000;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #E7E5F1;
    height: 49px;
  }


  li:last-child,
  tr:last-child {
    border-bottom: none;
  }

  .header_li {
    font-family: 'GothamPro-Medium';
    font-size: 18px;
    line-height: 17px;
    color: #4EAD96;
    height: 66px;
  }

  .with_border {
    border-right: 1px solid #E7E5F1;
  }

  thead {
    border-bottom: 1px solid #E7E5F1;

    td {
      text-align: center;
    }

    td.with_border {
      border-right: 1px solid #E7E5F1;
    }
  }

  tr {
    td:first-child {
      width: 60%;
    }

    td:last-child {
      width: 40%;
      padding-right: 10px;
    }
  }

  tbody {
    td {
      min-height: 50px;
      padding-left: 45px;

      font-family: 'GothamPro';
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.15px;
      color: #000000;

      padding-top: 24px;
      padding-bottom: 18px;
    }
  }

  .li-category_titles {
    justify-content: flex-start;
    padding-left: 45px;
  }

  .li-quartals_title {
    justify-content: flex-start;
    padding-left: 45px;
  }

  .quartal-header {
    padding: 0 35px;
    text-align: center;
  }
</style>