import Vue from "vue";
import App from "@/App.vue";

import router from "./router";
import store from "./store";

import "./registerServiceWorker";

import Vuelidate from 'vuelidate'

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";


Vue.use(Toast, {
  position: POSITION.TOP_CENTER
});


// import axios from "axios";

// const token = localStorage.getItem('token')
// if (token) {
//   axios.defaults.headers.common['Authorization'] = token
// }
// eslint-disable-next-line 
import styles from './scss/app.scss';

Vue.use(Vuelidate)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
