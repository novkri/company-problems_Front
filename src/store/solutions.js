import axios from "axios";

const BASEURL = 'http://31.31.199.37/api/solutions' //все решения
const URLSOLUTION = 'http://31.31.199.37/api/solution' //одно решение

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Accept'] = 'application/json'
axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${ token }`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  })

export default {
  state: {
    solutions: [],
    solutionsOther: [],
    token: localStorage.getItem('user-token') || '',
  },
  getters: {
    solutions: state => {
      return state.solutions 
      // = state.solutions.sort(function (a, b) {
      //   return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1
      // })
    },

    solutionsOther: state => {
      return state.solutionsOther = state.solutionsOther.sort(function (a, b) {
        return (new Date(a.created_at).toISOString() > new Date(b.created_at).toISOString()) ? 1 : -1
      })
    },
  },
  mutations: {
    setSolution: (state, payload) => {
      state.solutions = payload.filter(solution => solution.in_work)
    },
    addSolution: (state, payload) => {
      state.solutionsOther.push(payload)
    },
    setOtherSolution: (state, payload) => {
      state.solutionsOther = payload.filter(sol => !sol.in_work)
    },
    deleteSolution: (state, payload) => {
      state.solutions = state.solutions.filter(s=> s.id !== payload)
      state.solutionsOther = state.solutionsOther.filter(s=> s.id !== payload)
      //&
    },
    sortSolutions: state => {
      state.solutions = state.solutions.sort(function (a, b) {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1
      })
    },

    editSolution: (state, payload) => {
      state.solutions.find(solution => solution.id == payload.id).name = payload.name
    },
    editStatus: (state, payload) => {
      if (payload.in_work) {
        state.solutions.push(payload)
        state.solutionsOther = state.solutionsOther.filter(s=> s.id !== payload.id)
      } else {
        state.solutionsOther.push(payload)
        state.solutions = state.solutions.filter(s=> s.id !== payload.id)
      }
    },

  },
  actions: {
    getSolutions: async ({
      commit
    }, problemId) => {
      await axios.get(BASEURL + `/${problemId}`)
        .then(response => {
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('setOtherSolution', response.data)
            commit('setSolution', response.data)
          }
        })
        .catch(error =>
          commit('setError', error.response.data.errors)
        )
    },
    postSolution: async ({commit}, param) => {
      // param.problemId = 100000000
      await axios.post(URLSOLUTION + `/${param.problemId}`, {
          name: param.name
        })
        .then(response => {
          if (response.status == 201) {
            commit('setError', '')
            commit('setError404', '')
            commit('addSolution', response.data)
          }
        })
        .catch(error => {
          commit('setError404', '')
          if (error.response.status == 422) {
            if (error.response.data.errors.name) {
              commit('setError', error.response.data.errors.name[0])
            } else if (!error.response.data.errors.name) {
              commit('setError', error.response.data.errors)
            } 
          } else if (error.response.status == 404) {
            
            commit('setError404', error.response.data.message)
          }
          
        })
    },

    deleteSolution: async ({commit}, id) => {
      // id = 10000000000
      await axios.delete(URLSOLUTION + `/${id}`).then(response => {
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('deleteSolution', id)
          }
        })
        .catch(error => {
          commit('setError404', error.response.data.message)
        })
    },
    // checkIfExists: async ({
    //   commit
    // }, param) => {
    //   // URLSOLUTION ?
    //   axios.get(BASEURL + `/${param.id}`).catch((error) => {
    //     commit('setError404', error.response.data.message)
    //   })
    // },

    editSolution: async ({commit}, param) => {
      // param.id = 10000000000
      axios.put(URLSOLUTION + `/${param.id}`, {
        name: param.name
      }).then(response => {
        commit('setError404', '')
        if (response.status == 200) {
          commit('setError', '')
          commit('editSolution', response.data)
          commit('sortSolutions')
        }
      }).catch((error) => {
        commit('setError404', '')
        if (error.response.status == 404) {
          commit('setError404', '')
          commit('setError404', error.response.data.message)
        }
        else if (error.response.status == 422) {
          commit('setError404', '')
          // console.log(error.response);
          // commit('setError', error.response.data.errors.name[0])
          // временно:
          
          commit('setError404', error.response.data.errors.name[0])
        }
      })
    },
    changeinWork: async ({commit}, param) => {
      // console.log(param);
      // param.id = 10000000000
      axios.put(URLSOLUTION + `/${param.id}/change-in-work`, {
        in_work: param.in_work
      }).then(response => {
        // console.log(response);
          commit('setError', '')
          commit('editStatus', response.data)
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
        }
        else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors)
        }
      })
    },
  }
}