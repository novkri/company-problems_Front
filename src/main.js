import Vue from "vue";
import App from "@/App.vue";

import router from "./router";
import store from "./store";

import "./registerServiceWorker";

import Vuelidate from 'vuelidate'

// eslint-disable-next-line 
import styles from './scss/app.scss';

Vue.use(Vuelidate)


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
