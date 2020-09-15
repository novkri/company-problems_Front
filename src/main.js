import Vue from "vue";
import App from "@/App.vue";

import router from "./router";
import store from "./store";

import "./registerServiceWorker";

import Vuelidate from 'vuelidate'

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
// import {StfSelect, StfSelectOption} from "stf-vue-select";

// import "stf-vue-select/dist/lib/stf-vue-select.min.css";

Vue.use(Toast, {
  position: POSITION.TOP_CENTER
});
// Vue.component('stf-select-option', StfSelectOption);
// Vue.component('stf-select', StfSelect);

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
