import Vue from "vue";
import Vuex from "vuex";

import problems from './problems'
import auth from './auth'
import solutions from './solutions'
import tasks from './tasks'
import groups from './groups'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

// export default new Vuex.Store({
//   plugins: [createPersistedState({
//       storage: window.sessionStorage,
//   })],
//   state: {
//     problems
//   }
// });

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
})],
  modules: {
    problems,
    auth,
    solutions,
    tasks,
    groups
  }
});
