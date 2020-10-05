<template>
  <div class="popup-create">
    <div class="modal fade" id="popupCreate" tabindex="-1" style="padding: 0;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Предложить проблему</h5>
            <button type="button" id="close" class="close" data-dismiss="modal" aria-label="Close" @click="close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div style="width: 100%;">
              <form @submit.prevent="addProblem()" class="form-group">
                <div class="form-group">
                  <label for="new-problem-title">Название *</label>
                  <input type="text" ref="input" v-model="formData.name" class="form-control" id="new-problem-title"
                    placeholder="Название проблемы..." @blur="onBlur($event)" @focus="onFocus($event)"
                    :class="{ 'form-control--error': $v.formData.name.$invalid, 'form-control--valid': formData.name && !$v.formData.name.$invalid}"
                    >
                    <!-- :class="{ 'form-control--error': $v.name.$invalid, 'form-control--valid': name && !$v.name.$invalid}" -->
                  <!-- <div class="form-group-append" style="top: 59%;" @mousedown="onClear">
                    <span class="form-group-text">&times;</span>
                  </div> -->
                  <div class="error" v-if="error.name">{{error.name[0]}}</div>
                </div>
                <div class="form-group">
                  <label for="description">Описание</label>
                  <textarea cols="20" rows="3" type="text" ref="input" v-model="formData.description"
                    class="form-control" id="description" placeholder="Описание проблемы..." @blur="onBlur($event)"
                    @focus="onFocus($event)" :class="{ 'form-control--error': $v.formData.description.$invalid, 'form-control--valid': !$v.formData.description.$invalid}"
                     />
                     <!-- :class="{ 'form-control--error': $v.description.$invalid, 'form-control--valid': !$v.description.$invalid}" -->
                  <!-- <div class="form-group-append" id="textarea-append" @mousedown="onClear">
                  <span class="form-group-text">&times;</span> -->
                <!-- </div> -->
                <div class="error" v-if="error.description">{{error.description[0]}}</div>


              </div> 
                <div class="form-group">
                <label for="solution">Знаете как решить эту проблему? </label>
                <input type="text" ref="input" v-model="formData.solution" class="form-control"
                  id="solution" placeholder="Предложите ваше решение..." @blur="onBlur($event)" @focus="onFocus($event)"
                  :class="{ 'form-control--error': $v.formData.solution.$invalid, 'form-control--valid': !$v.formData.solution.$invalid}"
                  >
                  <!-- :class="{ 'form-control--error': $v.solution.$invalid, 'form-control--valid': !$v.solution.$invalid}" -->
                  <!-- <div class="form-group-append" style="top: 59%;" @mousedown="onClear">
                    <span class="form-group-text">&times;</span>
                  </div> -->
                  <div class="error" v-if="error.possible_solution">{{error.possible_solution[0]}}</div>
              </div>  
              <div class="form-group">
                <div class="form-check">
                  <label class="form-check-label" for="gridCheck">
                    Выберите подразделение
                  </label>
                  <ss-select v-model="formData.group" :options="groups" track-by="name" search-by="name"
                    class="form-control" @change="selectGroup($event.id)" disable-by="disabled"
                    id="ss-select"
                   >
                  <div @click="spacer = !spacer"
                    slot-scope="{ filteredOptions, selectedOption, isOpen, pointerIndex, $get, $selected, $disabled }"
                    style="cursor: pointer; width: 100%;">
                    <ss-select-toggle style="padding: 13px;" id="select-toggle">
                      {{ $get(selectedOption, 'name') || `${'Выбрать'}`}}
                      <chevron-down-icon size="1.5x" class="custom-class"></chevron-down-icon>
                    </ss-select-toggle>

                    <section v-show="isOpen" class="absolute border-l border-r min-w-full" style="height: auto;">
                      <ss-select-option v-for="(option, index) in filteredOptions" :value="option" :index="index"
                        :key="index" class="px-4 py-2 border-b cursor-pointer" :class="[
                                pointerIndex == index ? 'bg-light text-dark' : '',
                                $selected(option) ? 'bg-light text-dark' : '',
                                $disabled(option) ? 'opacity-50 cursor-not-allowed' : ''
                              ]">{{ option.name }}</ss-select-option>
                    </section>
                  </div>
                </ss-select>
                </div>
                <!-- <div class="error" v-if="error">{{error}}</div> -->
                <div v-show="spacer" class="spacer"></div>
              </div>
            </form>
            <button type="submit" class="btn btnMain" @click="addProblem()">
              Предложить проблему
            </button>
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
    mapGetters
  } from 'vuex'
    import {
    SsSelect,
    SsSelectToggle,
    SsSelectOption,
  } from 'ss-select'
  // SsSelectSearchInput
    import {
    ChevronDownIcon,
  } from 'vue-feather-icons'

  export default {
    name: 'popup',
    props: ['open'],
    data: () => ({
      formData: [],
      showClear: false,
      spacer: false,
      currentForm: []
    }),
    components: {
      ChevronDownIcon,

      SsSelect,
      SsSelectToggle,
      SsSelectOption,
      // SsSelectSearchInput
    },
    validations: {
      formData: {
        name: {
        minLength: minLength(6),
        maxLength: maxLength(150)
      },
      description: {
        minLength: minLength(6),
        maxLength: maxLength(350)
      },
      solution: {
        minLength: minLength(6),
        maxLength: maxLength(250)
      },
      }
      
      ////////
    },
    watch: {
      error() {
        // console.log(`Updating from ${oldValue} to ${newValue}`);
      }
    },
    computed: {
      ...mapGetters(['error', 'groups'])
    },

    methods: {
      onBlur(event) {
        event.target.nextElementSibling.style.display = 'none'
      },
      onFocus(event) {
        event.target.nextElementSibling.style.display = 'flex'
      },

      async addProblem() {
        console.log(this.formData);
        this.$store.commit('setError404', '')
        await this.$store.dispatch('postProblem', {
          name: this.formData.name,
          description: this.formData.description,
          possible_solution: this.formData.solution,
          // group: this.formData.group
        }).then((r) => {
          if (!this.error) {
            this.formData.group ? this.$store.dispatch('sendToGroup', {id: r.id, groupsArray: [this.formData.group.id]}) : ''
            this.$store.dispatch('getThisProblem', r.id)
            this.formData = []
            document.getElementById('close').click()
          } 
        })
      },

      close() {
        this.formData = []
        this.$store.commit('setError', '')
      },

      selectGroup(option) {
        console.log(option);
      },
    }
  }
</script>

<style scoped lang="scss">
* {
  font-family: 'GothamPro';
}
.modal-dialog {
  max-width: 600px;
}
  .modal-title {
    margin: auto;
  }

  .modal-content {
    border-radius: 12px;
    border: none;
    padding: 30px 41px 40px 41px;
    // width: 530px;
    width: 100%;
  }

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
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
  }

  label {
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    margin-left: 20px;
    margin-top: 14px;
  }

  .spacer {
    height: 174px;
  }

  form {
    width: 100%;
    margin: auto;
  }
  .form-control {
    background-color: #F0F0F0;
    padding-right: 46px;
  }

  .form-control:active,
  .form-control:focus {
    background-color: #F0F0F0;
  }
  .form-group {
    position: relative;
  }
  .form-check {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0;
    margin-top: 29px;
  }
    
  #new-problem-title {
    border-radius: 6px;
  }
  .form-group-append {
    display: none;
    position: absolute;
    border: transparent;
    top: 63%;
    right: 1%;
    z-index: 10;
    background-color: #F0F0F0;
    border: none;
    border-radius: 8px;
    padding: 5px 15px;
  }

  .form-group-text {
    border: transparent;
    background-color: transparent;
    cursor: pointer;
    height: fit-content;
    background-color: transparent;
  }


  .btn {
    background-color: #92D2C3;
    border-radius: 12px;
    color: #fff;
    border: none;
    padding: 17px 26px;
    font-size: 18px;
    line-height: 17px;
    font-family: 'GothamPro-Medium';
    display: flex;
    margin: 83px auto 0;
  }

  #description {
    padding-right: 0;
  }
  textarea {
    resize: none;

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

  .close {
    margin-right: -4px;
    margin-left: 0;
    font-weight: normal;
    color: #2D453F;
    opacity: 1;
    font-family: 'GothamPro';
  }

  #ss-select {
    max-width: 255px;
    background-color: #F6F7F9;
    font-family: 'GothamPro-Medium';
    color: #92D2C3;
    width: 100%;
    height: auto;

    #select-toggle {
      font-family: 'GothamPro-Medium';
      word-break: break-all;
    height: fit-content;
    svg {
      width: inherit;
    }
    // }
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

    section {
      top: 99%;
      right: -4%;
    }
  }

  #select-toggle {
    display: flex;
    justify-content: space-around;
  }

  #textarea-append {
    display: none;
    align-items: center;
    height: 32px;
    background-color: #e2e2e2;
    border: none;
    border-radius: 8px;
    padding: 15px 10px;
    top: 72%;
    right: 5%;
  }
</style>