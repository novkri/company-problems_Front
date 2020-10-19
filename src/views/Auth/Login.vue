<template>
  <div class="container" >
    <div class="header">Вход в систему</div>
    <form>
      <div class="form-group">
        <label for="email">Адрес электронной почты<span
            v-if="email.length >= 250 && email.length <= 255">{{$v.email.$params.maxLength.max - email.length}}</span></label>
        <input type="text" class="form-control" id="email" v-model="email"
          :class="{ 'form-control--error': $v.email.$invalid, 'form-control--valid': email && !$v.email.$invalid}">
        <div class="errorAuth" v-if="errorU.email">{{errorU.email[0]}} </div>
      </div>
      <div class="form-group">
        <label for="password">Пароль<span
            v-if="password.length >= 15 && password.length <= 20">{{$v.password.$params.maxLength.max - password.length}}</span></label>
        <input type="password" class="form-control" id="password" v-model="password"
          :class="{ 'form-control--error': $v.password.$invalid, 'form-control--valid': password && !$v.password.$invalid}">
        <div class="errorAuth" v-if="errorU.password">{{errorU.password[0]}} {{errorU.password[1]}} </div>
      </div>
      <br>
      <div class="errorAuth" v-if="errorU.name" style="text-align: center;">{{errorU.name[0]}}</div>
      <div class="errorAuth" v-if="error401" style="text-align: center;">{{error401}}</div>

      <div class="btn-and-link">
        <button type="submit" class="btn" @click.prevent="login">Войти</button>
        <router-link to="/register">Регистрация</router-link>
      </div>

    </form>
  </div>
</template>

<script>
  import {
    maxLength,
    minLength,
    email
  } from 'vuelidate/lib/validators'
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: "Login",
    data: () => ({
      success: false,
      email: '',
      password: ''

    }),
    validations: {
      email: {
        email,
        minLength: minLength(3),
        maxLength: maxLength(255)
      },
      password: {
        minLength: minLength(8),
        maxLength: maxLength(20)
      },
    },
    computed: {
      ...mapGetters(['errorU', 'error401', 'currentUid', 'groups', 'isLeader', 'user'])
    },
    mounted() {
      this.$store.commit('setError401', '')
      this.$store.commit('setErrorU', '')
      
    },
    watch: {
      errorU() {},
      error401() {},
    },
    methods: {
      async login() {
        this.$store.commit('setError401', '')
        const formData = {
          email: this.email,
          password: this.password,
        }

        await this.$store.dispatch('login', formData).then(() => {
          // console.log(r);
          // console.log(this.isLeader);


          if (!this.errorU) {
             
          this.$store.dispatch('checkIsLeader').then((response) => {
            // console.log(response);
              // response ? this.$store.dispatch('getMembers', this.groups.find(g => g.leader_id == this.currentUid).id) : ''
              if (response) {
                this.$store.dispatch('getMembers', this.groups.find(g => g.leader_id == this.currentUid).id)
                 this.$store.dispatch('countAmountOfProblemsForConfirmation', {
              urgency: '',
              importance: '',
              deadline: '',
              status: ''
            })
              }
            })


            this.$store.dispatch('countAmountOfProblemsForExecution', {
              urgency: '',
              importance: '',
              deadline: '',
              status: ''
            })

            // this.isLeader || this.user.is_admin ? this.$store.dispatch('countAmountOfProblemsForConfirmation', {
            //   urgency: '',
            //   importance: '',
            //   deadline: '',
            //   status: ''
            // }) : ''


            this.$store.dispatch('getMyProblems', {
              urgency: '',
              importance: '',
              deadline: '',
              status: ''
            })
            this.$router.push('/my-problems')


           

          }
        })
      },
    }
  };
</script>

<style lang="scss" scoped>
  .header {
    font-family: 'GothamPro-Medium';
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 23px;
    color: #4F4F4F;
    margin-bottom: 144px;
  }

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
    color: #BDBDBD;
    margin-top: 10px;
    color: #FF8585;
  }

  a {
    display: flex;
    justify-content: center;
    color: #828282;
    margin: 26px 0 62px;
  }

  .container {
    max-height: 1080px;
    flex-direction: column;
    width: 344px;
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
    margin-right: 22px;
    padding: 0;
    border-radius: 12px;
    width: 109px;
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
  }

  input,
  input:active {
    background-color: #F2F5FA;
    margin-bottom: 22px;
    border-radius: 12px;
    height: 42px;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0.15px;
    color: #4F4F4F
  }

  .form-group {
    margin: 0 0 15px 0;
  }

  .form-control {
    border-radius: 12px;
  }

  .form-control:active,
  .form-control:focus {
    background-color: #FFF;
  }

  .form-control--valid {
    border: transparent;
    border-radius: 12px;
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
    border-radius: 12px;
    background-color: #FAFAFA;
    color: #2D453F;
    caret-color: #92D2C3;
    border-bottom: 2px solid #EC7676 !important;


    &:focus {
      box-shadow: none;
      border-bottom: 2px solid #EC7676;
    }
  }

  .btn-and-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
  }

  a {
    margin: 0;
    font-size: 18px;
    line-height: 17px;
    font-family: 'GothamPro-Medium';
    color: #92D2C3;
  }

  @media (max-width: 1500px) {
    .btn {
      height: 41px;
    }
  }
 
</style>