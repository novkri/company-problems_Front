import axios from "axios";

const BASEURL = 'http://31.31.199.37/api/solution' //все решения
const URLSOLUTION = 'http://31.31.199.37/api/problem' //одно решение
const ALLUSERS = 'http://31.31.199.37/api/users'

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
    allUsers: [],
    token: localStorage.getItem('user-token') || '',
  },
  getters: {
    solutions: state => {
      return state.solutions 
    },

    solutionsOther: state => {
      return state.solutionsOther = state.solutionsOther.sort(function (a, b) {
        return (new Date(a.created_at).toISOString() > new Date(b.created_at).toISOString()) ? 1 : -1
      })
    },
    allUsers: state => {
      return state.allUsers 
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
    },
    sortSolutions: state => {
      state.solutions = state.solutions.sort(function (a, b) {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1
      })
    },

    editSolutionOther: (state, {id, name}) => {
      console.log(id, name);
      console.log(state.solutions);
      if (state.solutionsOther.find(solution => solution.id == id)) {
        state.solutionsOther.find(solution => solution.id == id).name = name
      } else {
        state.solutions.find(solution => solution.id == id).name = name
      }
      
    },
    editinWork: (state, payload) => {
      console.log(payload.in_work);
      if (payload.in_work) {
        console.log('t');
        state.solutions.push(payload)
        state.solutionsOther = state.solutionsOther.filter(s=> s.id !== payload.id)
      } else {
        console.log('f');
        state.solutionsOther.push(payload)
        state.solutions = state.solutions.filter(s=> s.id !== payload.id)
      }
    },
    editStatus: (state, payload) => {
      state.solutions.find(solution => solution.id == payload.id).status = payload.status
    },
    editDeadline: (state, payload) => {
      state.solutions.find(solution => solution.id == payload.id).deadline = payload.deadline
    },
    setAllUsers: (state, payload) => {
      let usersPayload = Object.values(payload)
      state.allUsers = usersPayload
    },
    editExecutor: (state, payload) => {
      state.solutions.find(solution => solution.id == payload.id).executor_id = payload.executor_id
    },

  },
  actions: {
    getSolutions: async ({
      commit
    }, problemId) => {
      await axios.get(URLSOLUTION + `/${problemId}/solution`)
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
      await axios.post(URLSOLUTION + `/${param.problemId}/solution`, {
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
          } else {
            commit('setError404', error.response.data.message)
          }
          
        })
    },

    deleteSolution: async ({commit}, id) => {
      // id = 10000000000
      await axios.delete(BASEURL + `/${id}`).then(response => {
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

    // checkIfExists: async ({commit}, param) => {
    //   return new Promise((resolve, reject) => {
    //   axios.get(BASEURL + `/${param.id}`)
    //   .then(response => )
    //   .catch((error) => {
    //     commit('setError404', error.response.data.message)})
    //   }
    // },

    editSolution: async ({commit}, param) => {
      // param.id = 10000000000
      return new Promise((resolve, reject) => {
        axios.put(BASEURL + `/${param.id}`, {
          name: param.name
        }).then(response => {
          console.log(response);
          // if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('editSolutionOther', response.data)
            commit('sortSolutions')
            resolve(response)
          // }
        }).catch((error) => {
          console.log('d');
          console.log(error);
          // commit('setError404', '')
          if (error.response.status == 422) {
            commit('setError404', '')
            commit('setError404', error.response.data.errors.name[0])
            // return param.id
            reject(error.response.data.message)
          } else {
            commit('setError404', '')
            commit('setError404', error.response.data.message)
            // return param.id
            reject(error.response.data.message)
          }
          // reject(error.response.data.message)
        })
      })
    },
    changeinWork: async ({commit}, param) => {
      // param.id = 10000000000
      console.log(param);
      axios.put(BASEURL + `/${param.id}/change-in-work`, {
        in_work: param.in_work
      }).then(response => {
          commit('setError', '')
          commit('editinWork', response.data)
          commit('sortSolutions')
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
        }
        else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors)
        }
      })
    },

    changeStatus: async ({commit}, param) => {
      // param.id = 10000000000
      axios.put(BASEURL + `/${param.id}/change-status`, {
        status: param.status
      }).then(response => {
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

    changeDeadline: async ({commit}, param) => {
      // param.id = 10000000000
      axios.put(BASEURL + `/${param.id}/set-deadline`, {
        deadline: param.deadline
      }).then(response => {
          commit('setError', '')
          commit('editDeadline', response.data)
      }).catch((error) => {

        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
        }
        else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors.deadline[0])
        }
      })
    },

    getAllUsers: async({commit}) => {
      axios.get(ALLUSERS).then(response => {
        if (response.status == 200) {
          commit('setError', '')
          commit('setError404', '')
          commit('setAllUsers', response.data)
          commit('setSolution', response.data)
        }
      })
        .catch(error => {
          commit('setError404', '')
          commit('setError404', error.response.message)
        })
    },
    changeExecutor: async ({commit}, param) => {
      // param.id = 10000000000
      axios.put(BASEURL + `/${param.id}/set-executor`, {
        executor_id: param.uid
      }).then(response => {
          commit('setError', '')
          commit('editExecutor', response.data)
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
        }
        else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors.executor)
        }
      })
    },
  }
}