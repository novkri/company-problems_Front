<template>
  <div class="popup-create">
    <div class="modal fade" id="groupCreate" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close" @click="close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h5 class="modal-title" id="exampleModalLabel">Добавить подразделение</h5>
          </div>

          <div class="modal-body">
            <div>
              <form class="form-group">
                <div class="input-group">
                  <label for="new-group-title">Название подразделения (полностью) <span class="error">*</span></label>
                  <input type="text" ref="input" class="form-control" id="new-group-title"
                    :class="{ 'form-control--error': $v.name.$invalid, 'form-control--valid': name && !$v.name.$invalid}"
                    placeholder="Название подразделения..." @blur="onBlur($event)" @focus="onFocus($event)"
                    @input="clearError" v-model="name">
                  <div class="input-group-append" @mousedown="onClear('name')">
                    <span class="input-group-text">&times;</span>
                  </div>
                  <div class="error" v-if="!name">Это поле обязательно для заполнения.</div>
                  <div class="error" v-if="error.name">{{error.name[0]}}</div>
                </div>

                <div class="input-group">
                  <label for="new-group-title">Название подразделения (сокращенно)</label>
                  <input type="text" ref="input" class="form-control" id="new-group-title__short"
                    :class="{ 'form-control--error': $v.nameShort.$invalid, 'form-control--valid': nameShort && !$v.nameShort.$invalid}"
                    placeholder="Название сокращения..." @blur="onBlur($event)" @focus="onFocus($event)"
                    @input="clearError" v-model="nameShort">
                  <div class="input-group-append" @mousedown="onClear('short')">
                    <span class="input-group-text">&times;</span>
                  </div>
                  <div class="error" v-if="error.short_name">{{error.short_name[0]}}</div>
                </div>

                <div class="input-group">
                  <label>Выбрать руководителя <span class="error">*</span></label>
                  <div class="selectResponsible" style="background-color: transparent;" @click="clearError">
                    <ss-select v-model="leader_id" :options="usersNoGroup" track-by="name" search-by="name"
                      disable-by="disabled" id="ss-select" style="width: fit-content;">
                      <div
                        slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                        style="cursor: pointer; width: 100%;">
                        <ss-select-toggle class="pl-1 pr-4 py-1 flex items-center justify-between"
                          style="width: 100%; padding: 13px;">
                          <award-icon size="1.5x" class="custom-class"></award-icon>
                          {{ $get(selectedOption, 'name') || selectedOption ? usersNoGroup.find(u => u.id == selectedOption).surname + ' ' + usersNoGroup.find(u => u.id == selectedOption).name + ' ' + usersNoGroup.find(u => u.id == selectedOption).father_name: 'Выбрать руководителя'}}
                          <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
                        </ss-select-toggle>

                        <section v-show="isOpen" class="absolute border-l border-r min-w-full">
                          <ss-select-option v-for="(option, index) in filteredOptions" :value="option.id" :index="index"
                            :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.surname }} {{ option.name }} {{ option.father_name }} </ss-select-option>
                        </section>
                      </div>
                    </ss-select>
                  </div>
                  <div class="error" v-if="!leader_id">Это поле обязательно для заполнения.</div>
                  <div class="error" v-if="error.leader_id">{{error.leader_id[0]}}</div>
                </div>
              </form>
            </div>

            <div type="submit" class="btnsAddTask">
              <button id="addBtn" class="btn" :class="[error ? 'btnPink' : 'btnMain']"
                @click.prevent="addGroup">Добавить подразделение</button>
            </div>
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
    mapGetters,
  } from 'vuex'
  import {
    SsSelect,
    SsSelectToggle,
    SsSelectOption,
  } from 'ss-select'
  // SsSelectSearchInput
  import {
    ChevronDownIcon,
    AwardIcon
  } from 'vue-feather-icons'


  export default {
    name: 'popup',
    props: ['open', 'val'],
    data: () => ({
      name: '',
      nameShort: '',
      leader_id: '',
    }),
    components: {
      ChevronDownIcon,
      AwardIcon,

      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      // SsSelectSearchInput
    },
    validations: {
      name: {
        minLength: minLength(3),
        maxLength: maxLength(100)
      },
      nameShort: {
        minLength: minLength(2),
        maxLength: maxLength(10)
      }
    },
    watch: {
      error() {}
    },
    computed: {
      ...mapGetters(['error', 'allUsers', 'usersNoGroup']),

    },

    methods: {
      async clearError() {
        await this.$store.commit('setError', '')
      },
      onBlur(event) {
        event.target.nextSibling.style.display = 'none'
      },
      onFocus(event) {
        event.target.nextSibling.style.display = 'flex'
      },
      onClear(type) {
        type === 'name' ? this.name = '' : this.nameShort = ''
      },

      async addGroup() {
        await this.$store.commit('setError404', '')
        await this.$store.dispatch('postGroup', {
          leader_id: this.leader_id,
          name: this.name,
          short_name: this.nameShort,
        }).then(() => {
          this.name = ''
          this.nameShort = ''
          this.leader_id = ''
          this.$store.dispatch('getAllUsers')

          document.getElementById('close').click()
        })
      },
      async selectExecutorGroup(group) {
        await this.$store.commit('setError404', '')
        await this.$store.commit('setError', '')
        await this.$store.dispatch('checkIfOk', {
          description: group.description,
          executor_id: group.executor_id,
          id: group.id
        }).then(() => {
          this.$store.dispatch('changeExecutorGroup', {
            id: group.id,
            uid: group.executor_id
          })
        }).catch(() => {
          this.$store.commit('changeExecutorGroup', {
            id: group.id,
            executor_id: this.currentExecutor
          })
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
  .error {
    font-size: 13px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #EC7676;
  }

  .selectResponsible {
    display: flex;
    background-color: #F6F6F6;
    padding-top: 10px;
    margin-bottom: 10px;
    height: 49px;
    color: #828282;

    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;



    #ss-select {
      padding-left: 8px;
      align-items: center;
      display: flex;
      height: 36px;

      background-color: #F0F0F0;
      border-radius: 10px;
      text-align: center;
      padding-right: 0;
      width: fit-content;

      section {
        top: 52% !important;
        left: 6% !important;
        max-height: 170px !important;
      }
    }

    select {
      margin: 0;
      width: 142px;
      background-color: #f6f6f6;
    }

    ::-webkit-scrollbar {
      width: 10px;
    }

    ::-webkit-scrollbar-thumb {
      background: #92D2C3;
      border-radius: 3px;
      height: 73px;
    }

    ::-webkit-scrollbar-track {
      background: #F2F2F2;
      border-left: 4px solid white;
      border-right: 4px solid white;
    }

  }


  .selectResponsible:hover {
    #ss-select {
      background-color: #e5e9f1;
    }
  }

  .selectResponsible:focus,
  .selectResponsible:active {
    color: #fff;

    #ss-select {
      background-color: #4EAD96;
    }

    svg {
      color: #fff !important;
    }

    #iconUser {
      color: #fff;
    }
  }

  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 22px 20px 40px 20px;

    min-height: 638px;
    height: fit-content;
  }

  .modal-header {
    display: flex;
    flex-wrap: wrap;
    border: none;
    margin-bottom: 60px;
    padding: 0;
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
  }

  .modal-title {
    margin: auto;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    padding-right: 71px;
    padding-left: 43px;
  }

  form {
    width: 100%;
    margin: 0;
  }

  label {
    margin-bottom: 5px;
  }

  .form-control {
    background-color: #F7F7F7;
    width: 100% !important;
    margin-bottom: 5px;
  }

  .form-control:active,
  .form-control:focus {
    background-color: #FFF;
  }

  #new-group-title,
  #new-group-title__short {
    border-radius: 9px;
    width: fit-content;

    font-family: 'GothamPro';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #9C9C9C;
  }

  #new-group-title:focus,
  #new-group-title__short:focus {
    width: fit-content;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 30px;
    position: relative;

    input {
      background-color: #F0F0F0;
    }

    label {
      font-family: 'GothamPro';
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #4F4F4F;
    }
  }

  .input-group:last-child {
    flex-direction: column;
  }

  .input-group-append {
    display: none;
    position: absolute;
    border: transparent;
    background-color: transparent;
    top: 20%;
    right: 0;
    z-index: 10;
  }

  .input-group-text {
    border: transparent;
    background-color: transparent;
    cursor: pointer;
    height: fit-content;
    margin-bottom: 5px;
    background-color: transparent;
  }

  .btnsAddTask {
    text-align: center;
    background-color: #fff;
    width: 100%;
  }

  .btn {
    margin-right: 17px;
    border-radius: 9px;
    background-color: #92D2C3;
    padding: 17px 26px;

    font-family: 'GothamPro-Medium';
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #FFFFFF;
  }

  .btnPink {
    background: #FFD3D3;
    width: fit-content;
  }


  .close {
    width: 100%;
    justify-content: flex-end;
    display: flex;
    margin-right: -4px;
    font-weight: normal;
    color: #2D453F;
    opacity: 1;
    font-family: 'GothamPro';
  }

  @media (max-width: 1500px) {
    h5 {
      font-size: 18px !important;
    }
  }

  @media (min-width: 576px) {
    .modal-dialog {
      max-width: 672px;
    }
  }
</style>