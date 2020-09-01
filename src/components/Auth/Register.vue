<template>
  <div class="container">
    <form v-if="!success">
      <div class="form-group">
        <label for="username">Имя пользователя <span v-if="username.length >= 15 && username.length <= 20">{{$v.username.$params.maxLength.max - username.length}}</span></label>
        <input type="text" class="form-control" id="username" v-model="username"
          :class="{ 'form-control--error': $v.username.$invalid, 'form-control--valid': username && !$v.username.$invalid}">
          <div class="errorAuth" v-if="errorUReg.name">{{errorUReg.name[0]}} </div>
      </div>
      <div class="form-group">
        <label for="password">Пароль <span v-if="password.length >= 15 && password.length <= 20">{{$v.password.$params.maxLength.max - password.length}}</span></label>
        <div class="input-group" id="show_hide_password">
          <input type="password" class="form-control" id="password" v-model="password" ref="password"
             :class="{ 'form-control--error': $v.password.$invalid, 'form-control--valid': password && !$v.password.$invalid}">
          <span tabindex="100" class="add-on input-group-addon"  style="cursor: pointer;" @click="togglePassword"
            :class="{ 'form-control--error': $v.password.$invalid, 'form-control--valid': password && !$v.password.$invalid}">
            <eye-icon size="1.5x" class="custom-class" v-if="eye"></eye-icon>
            <eye-off-icon size="1.5x" class="custom-class" v-else></eye-off-icon>
          </span>
        </div>
        <div class="errorAuth" v-if="errorUReg.password">{{errorUReg.password[0]}} </div>
      </div>
      <div class="form-group">
        <label for="password">Повторите пароль <span v-if="confirm.length >= 15 && confirm.length <= 20">{{$v.confirm.$params.maxLength.max - confirm.length}}</span></label>
        <div class="input-group" id="show_hide_password">
          <input type="password" class="form-control" id="passwordConfirm" data-toggle="password" v-model="confirm" ref="confirm"
             :class="{ 'form-control--error': $v.confirm.$invalid, 'form-control--valid': confirm && !$v.confirm.$invalid}">
          <span tabindex="100" class="add-on input-group-addon" @click="toggleConfirm"
            style="cursor: pointer;" :class="{ 'form-control--error': $v.confirm.$invalid, 'form-control--valid': confirm && !$v.confirm.$invalid}">
            <eye-icon size="1.5x" class="custom-class" v-if="eyeC"></eye-icon>
            <eye-off-icon size="1.5x" class="custom-class" v-else></eye-off-icon>
          </span>
        </div>
        <div class="errorAuth" v-if="errorUReg.password">{{errorUReg.password[1]}} </div>
      </div>
      <div class="form-group">
        <label for="email">Электронная почта <span v-if="email.length >= 251 && email.length <= 256">{{$v.email.$params.maxLength.max - email.length}}</span></label>
        <input type="email" class="form-control" id="email" v-model="email"
           :class="{ 'form-control--error': $v.email.$invalid, 'form-control--valid': email && !$v.email.$invalid}">
        <div class="errorAuth" v-if="errorUReg.email">{{errorUReg.email[0]}} </div>
      </div>
      <button type="submit" class="btn" @click.prevent="register">Зарегистрироваться</button>
    </form>

    <div v-else class="successfully">
      <span>Вы успешно зарегистрированы</span>
      <thumbs-up-icon size="3x" class="custom-class" style="color: #92D2C3; margin: 30px 0 35px 0;"></thumbs-up-icon>
      <button type="button" class="btn" @click="goToLogin">
        На страницу авторизации
      </button>
    </div>
  </div>



</template>

<script>
  // import {mapGetters} from 'vuex'
  import { EyeIcon, EyeOffIcon, ThumbsUpIcon } from 'vue-feather-icons'
  import {
    maxLength,
    minLength,
    sameAs
  } from 'vuelidate/lib/validators'
  import {mapGetters} from 'vuex'

  export default {
    name: "Register",
    data: () => ({
      success: false,

      email: '',
      password: '',
      confirm: '',
      username: '',
      eye: undefined,
      eyeC: undefined
    }),
    components: {
      EyeIcon,
      EyeOffIcon,
      ThumbsUpIcon
    },
    validations: {
      username: {
        minLength: minLength(4),
        maxLength: maxLength(20)
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
        maxLength: maxLength(256)
      }
    },
    computed: {
      ...mapGetters(['errorUReg']) 
    },
    watch: {
      errorUReg() {
        console.log(this.errorUReg)
        // if (this.errorUReg) {
        //   this.$vToastify.error(this.errorUReg)
        // }
      }
    },
    methods: {
      goToLogin() {
        this.$router.push('/login')
      },
      togglePassword() {
        if (this.$refs.password.type == 'text') {
          this.$refs.password.type = 'password'
          this.eye = false
        } else {
          this.$refs.password.type = 'text'
          this.eye = true
        }
      },
      toggleConfirm() {
        if (this.$refs.confirm.type == 'text') {
          this.$refs.confirm.type = 'password'
          this.eyeC = false
        } else {
          this.$refs.confirm.type = 'text'
          this.eyeC = true
        }
      },
      async register() {
          const formData = {
            name: this.username,
            password: this.password,
            password_confirmation: this.confirm,
            email: this.email
            
          }
          await this.$store.dispatch('register', formData).then(() => {
            if (!this.errorUReg) {
              this.success = true
            }
          })
      }
    }
  };
</script>

<style lang="scss" scoped>
  form {
    margin: 0;
    width: 100%;
  }
  .errorAuth {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #FF8585;
    // color: red;
    margin-top: 10px;
  }
  a {
    display: flex;
    justify-content: center;
    color: #828282;
    margin: 26px 0 62px;
  }

  .container {
    width: 409px;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #828282;
  }

  label {
    display: flex;
    justify-content: space-between;
    margin: 0 7px 9px 18px;
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
    margin-top: 135px;
  }

  input, input:active {
    background-color: #F7F7F7;
    // margin-bottom: 22px;
    border-radius: 12px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F
  }
  .form-control:active, .form-control:focus {
    background-color: #F7F7F7;
  } 
  label {
    margin: 0 7px 12px 18px;
  }

  .add-on {
    background-color: #F7F7F7;
    border-radius: 0 12px 12px 0;

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
    margin-bottom: 46px;
  }

  .successfully {
    font-family: 'Roboto';
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #2D453F;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: auto;
    align-items: center;

    // img {
    //   width: fit-content;
    //   padding-top: 27px;
    //   padding-bottom: 33px;
    // }

    .btn {
      margin: 0;
      width: 294px;
    }

  }
</style>