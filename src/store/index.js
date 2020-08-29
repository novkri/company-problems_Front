import Vue from "vue";
import Vuex from "vuex";

import problems from './problems'
import users from './users'

Vue.use(Vuex);

export default new Vuex.Store({
  
  modules: {
    problems,
    users
  }
});
