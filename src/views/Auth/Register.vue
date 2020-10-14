<template>
  <div class="container" :style=" [success ? {'height': '100vh'} : {'height': 'inherit'} ]">
    <div class="form" v-if="!success">
      <div class="header">Регистрация</div>

      <div class="error" style="margin-bottom: 25px;">* - Это поле обязательно для заполнения.</div>

      <form>
        <div class="form-group-div">
          <label for="text">Фамилия <span class="error">*</span><span
              v-if="surname.length >= 20 && surname.length <= 25">{{$v.surname.$params.maxLength.max - surname.length}}</span></label>
          <input type="text" class="form-control" id="surname" v-model="surname"
            :class="{ 'form-control--error': $v.surname.$invalid, 'form-control--valid': surname && !$v.surname.$invalid}">
          
          <div class="errorAuth" v-if="errorUReg.surname">{{errorUReg.surname[0]}} </div>
        </div>

        <div class="form-group-div">
          <label for="text">Имя <span class="error">*</span><span
              v-if="name.length >= 20 && name.length <= 25">{{$v.name.$params.maxLength.max - name.length}}</span></label>
          <input type="text" class="form-control" id="name" v-model="name"
            :class="{ 'form-control--error': $v.name.$invalid, 'form-control--valid': name && !$v.name.$invalid}">
         
          <div class="errorAuth" v-if="errorUReg.name">{{errorUReg.name[0]}} </div>
        </div>

        <div class="form-group-div">
          <label for="father_name">Отчество<span
              v-if="father_name.length >= 20 && father_name.length <= 25">{{$v.father_name.$params.maxLength.max - father_name.length}}</span></label>
          <input type="father_name" class="form-control" id="father_name" v-model="father_name"
            :class="{ 'form-control--error': $v.father_name.$invalid, 'form-control--valid': father_name && !$v.father_name.$invalid}">
          <div class="errorAuth" v-if="errorUReg.father_name">{{errorUReg.father_name[0]}} </div>
        </div>

        <div class="form-group-div">
          <label for="email">Электронная почта <span class="error">*</span><span
              v-if="email.length >= 250 && email.length <= 255">{{$v.email.$params.maxLength.max - email.length}}</span></label>
          <input type="email" class="form-control" id="email" v-model="email"
            :class="{ 'form-control--error': $v.email.$invalid, 'form-control--valid': email && !$v.email.$invalid}">
      
          <div class="errorAuth" v-if="errorUReg.email">{{errorUReg.email[0]}} </div>
        </div>

        <div class="form-group-div">
          <label for="password">Пароль <span class="error">*</span><span
              v-if="password.length >= 15 && password.length <= 20">{{$v.password.$params.maxLength.max - password.length}}</span></label>
          <div class="input-group" id="show_hide_password">
            <input :type="passwordFieldType" class="form-control" id="password" v-model="password" ref="password"
              :class="{ 'form-control--error': $v.password.$invalid, 'form-control--valid': password && !$v.password.$invalid}">
            <button tabindex="100" class="add-on input-group-addon" style="cursor: pointer;"
              @click.prevent="passwordVisibility"
              :class="{ 'form-control--error': $v.password.$invalid, 'form-control--valid': password && !$v.password.$invalid}">
              <eye-icon size="1.5x" class="custom-class" v-if="passwordFieldType == 'text'"></eye-icon>
              <eye-off-icon size="1.5x" class="custom-class" v-else></eye-off-icon>
            </button>
          </div>
        
          <div class="errorAuth" v-if="errorUReg.password">{{errorUReg.password[0]}} </div>
        </div>


        <div class="form-group-div">
          <label for="password">Повторите пароль <span class="error">*</span><span
              v-if="confirm.length >= 15 && confirm.length <= 20">{{$v.confirm.$params.maxLength.max - confirm.length}}</span></label>
          <div class="input-group" id="show_hide_password">
            <input :type="passwordFieldTypeC" class="form-control" id="passwordConfirm" data-toggle="password"
              v-model="confirm" ref="confirm"
              :class="{ 'form-control--error': $v.confirm.$invalid, 'form-control--valid': confirm && !$v.confirm.$invalid}">
            <button tabindex="100" class="add-on input-group-addon" @click.prevent="passwordVisibilityC"
              style="cursor: pointer;"
              :class="{ 'form-control--error': $v.confirm.$invalid, 'form-control--valid': confirm && !$v.confirm.$invalid}">
              <eye-icon size="1.5x" class="custom-class" v-if="passwordFieldTypeC == 'text'"></eye-icon>
              <eye-off-icon size="1.5x" class="custom-class" v-else></eye-off-icon>
            </button>
          </div>
        
          <div class="errorAuth" v-if="errorUReg.password">{{errorUReg.password[1]}} </div>
        </div>

      </form>
      <button type="submit" class="btn" @click.prevent="register">Зарегистрироваться</button>
      <div class="to-login">Уже зарегистрированы? <router-link to="/login">Вход</router-link>
      </div>
    </div>

    <div v-else class="successfully">
      <span>Вы успешно зарегистрированы</span>
      <thumbs-up-icon size="3x" class="custom-class" style="color: #92D2C3; margin: 73px 0;"></thumbs-up-icon>
      <button type="button" class="btn" @click="goToLogin">
        На страницу авторизации
      </button>
    </div>
  </div>
</template>

<script>
  import {
    EyeIcon,
    EyeOffIcon,
    ThumbsUpIcon
  } from 'vue-feather-icons'
  import {
    maxLength,
    minLength,
    sameAs,

  } from 'vuelidate/lib/validators'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: "Register",
    data: () => ({
      success: false,

      email: '',
      password: '',
      confirm: '',
      surname: '',
      father_name: '',
      name: '',

      passwordFieldType: 'password',
      passwordFieldTypeC: 'password',
    }),
    components: {
      EyeIcon,
      EyeOffIcon,
      ThumbsUpIcon
    },
    validations: {
      name: {
        minLength: minLength(1),
        maxLength: maxLength(25)
      },
      surname: {
        minLength: minLength(1),
        maxLength: maxLength(25)
      },
      father_name: {
        minLength: minLength(1),
        maxLength: maxLength(25)
      },
      password: {
        minLength: minLength(8),
        maxLength: maxLength(20)
      },
      confirm: {
        minLength: minLength(8),
        maxLength: maxLength(20),
        sameAsPassword: sameAs('password')
      },
      email: {
        minLength: minLength(3),
        maxLength: maxLength(255)
      }
    },
    computed: {
      ...mapGetters(['errorUReg', 'error401'])
    },
    mounted() {
      this.$store.commit('setError401', '')
      this.$store.commit('setErrorUReg', '')
    },
    watch: {
      errorUReg() {

      }
    },
    methods: {
      goToLogin() {
        this.$router.push('/login')
      },
      passwordVisibility() {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
      },
      passwordVisibilityC() {
        this.passwordFieldTypeC = this.passwordFieldTypeC === 'password' ? 'text' : 'password'
      },

      async register() {
        const formData = {
          name: this.name,
          surname: this.surname,
          father_name: this.father_name,
          password: this.password,
          password_confirmation: this.confirm,
          email: this.email
        }
        await this.$store.dispatch('register', formData).then(() => {
          if (this.errorUReg == '') {
            this.success = true
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .errorAuth {
    margin-bottom: -33px;
  }

  .header {
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 23px;
    color: #4F4F4F;
    margin-bottom: 58px;
    text-align: center;
  }

  form,
  .form {
    margin: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    div {
      margin-bottom: 36px;
    }
  }

  .errorAuth {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #FF8585;
    margin-top: 10px;
  }

  a {
    display: flex;
    justify-content: center;
    color: #828282;
    margin: 26px 0 62px;
  }

  .container {
    width: 615px;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    height: auto;
    padding-top: 40px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #828282;
    flex-direction: column;
  }

  label {
    display: flex;
    margin: 0 7px 12px 18px;
    font-size: 14px;
    font-family: 'GothamPro';
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #828282;
  }

  span.error {
    margin-left: 5px;
    font-size: 14px !important;
  }
  .btn {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    padding: 0;
    border-radius: 12px;
    width: 245px;
    height: 51px;
    background: #92D2C3;
    color: #fff;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 17px;
    margin-top: 40px;
  }

  .error {
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #EC7676;
  }


  input,
  input:active {
    background-color: #F2F5FA;
    border-radius: 12px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F;
    height: 42px;
  }

  .form-control:active,
  .form-control:focus {
    background-color: #FFF;
    border-bottom: 2px solid #FF8585;
  }

 .form-control--valid {
    border: transparent;
    border-radius: 6px;
    background-color: #FAFAFA;
    color: #2D453F;
    caret-color: #92D2C3;
    border-bottom: 2px solid #92D2C3 !important;


    &:focus {
      box-shadow: none;
      border-bottom: 2px solid #92D2C3;
    }
  }

  .form-control--error {
    border: transparent;
    border-radius: 6px;
    background-color: #FAFAFA;
    color: #2D453F;
    caret-color: #92D2C3;
    border-bottom: 2px solid #EC7676 !important;


    &:focus {
      box-shadow: none;
      border-bottom: 2px solid #EC7676;
    }
  }

  .add-on {
    background-color: #F2F5FA;
    border-radius: 0 12px 12px 0;
    padding: 0;
    border: transparent;

    svg {
      margin: 7px 25px;
      color: #AFAFAF;
    }

  }

  .add-on:focus {
    outline: none;
  }

  .form-group {
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;

    div {
      width: 315px;
      margin-bottom: 0;
    }

    label {
      margin-top: 55px;
    }
  }

  .form-group-div {
    div {
      margin-bottom: 0;
    }
  }

  .successfully {

    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: auto;
    align-items: center;

    span {
      font-family: 'GothamPro-Medium';
      font-size: 24px;
      line-height: 24px;
      letter-spacing: 0.15px;
      color: #2D453F;
    }

    .btn {
      margin: 0;
      width: 294px;
    }
  }

  .to-login {
    justify-content: center;
    display: flex;
    margin-top: 36px;
    font-size: 18px;
    line-height: 17px;
    color: #9B9B9B;
    font-family: 'GothamPro';
    font-style: normal;
    font-weight: normal;
  }

  a {
    margin: 0;
    margin-left: 19px;
    color: #92D2C3;
    font-family: 'GothamPro-Medium';
  }

  button:focus,
  button:active,
  button {
    outline: none;
  }


  @media (max-width: 1500px) {
    * {
      font-size: 14px;
    }

    .to-login {
      font-size: 16px;
    }
  }

  @media (max-width: 780px) {
    form {
      flex-direction: column;
    }
  }
</style>