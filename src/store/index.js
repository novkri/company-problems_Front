import Vue from "vue";
import Vuex from "vuex";

import problems from './problems'
import auth from './auth'
import solutions from './solutions'
import tasks from './tasks'

Vue.use(Vuex);

export default new Vuex.Store({
  
  modules: {
    problems,
    auth,
    solutions,
    tasks
  }
});
