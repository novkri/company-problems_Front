import axios from "axios";

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
    solutionInWorkId: '',
    solutionsOther: [],
    allUsers: [],
    allUsersReduced: [],
    token: localStorage.getItem('user-token') || '',
  },
  getters: {
    solutions: state => {
      return state.solutions
    },

    allUsers: state => {
      return state.allUsers
    },
    allUsersReduced: state => {
      return state.allUsersReduced = state.allUsersReduced.sort(function (a, b) {
        return (a.surname.toLowerCase() > b.surname.toLowerCase()) ? 1 : -1
      })
    }, 
  },
  mutations: {
    setSolution: (state, payload) => {
      state.solutions = payload
    },
    addSolution: (state, payload) => {
      payload.in_work = false
      state.solutionsOther.push(payload)
    },
    deleteSolution: (state, payload) => {
      state.solutions = state.solutions.filter(s => s.id !== payload)
      state.solutionsOther = state.solutionsOther.filter(s => s.id !== payload)
    },
    sortSolutions: state => {
      state.solutions = state.solutions.sort(function (a, b) {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1
      })
    },

    editSolutionOther: (state, {
      id,
      name
    }) => {
      if (state.solutionsOther.find(solution => solution.id == id)) {
        state.solutionsOther.find(solution => solution.id == id).name = name
      } else {
        state.solutions.find(solution => solution.id == id).name = name
      }

    },
    editinWork: (state, payload) => {
      if (payload.in_work) {
        state.solutions.push(payload)
        state.solutionsOther = state.solutionsOther.filter(s => s.id !== payload.id)
      } else {
        state.solutionsOther.push(payload)
        state.solutions = state.solutions.filter(s => s.id !== payload.id)
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
    setAllUsersReduced: (state, payload) => {
      payload.forEach(element => {
        element.father_name ? element.father_name = element.father_name[0] + '.' :  element.father_name = ' '
        element.name = element.name[0]+ '.'
      });
      let usersPayload = Object.values(payload)
      state.allUsersReduced = usersPayload
    },
    editExecutor: (state, payload) => {
      state.solutions.find(solution => solution.id == payload.id).executor_id = payload.executor_id
    },

    editPlan: (state, payload) => {
      state.solutions.find(solution => solution.id == payload.id).plan = payload.plan
    },
    editTeam: (state, payload) => {
      state.solutions.find(solution => solution.id == payload.id).team = payload.team
    },


  },
  actions: {
    getSolutions: async ({
      commit
    }, problemId) => {
      return await new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + `/problem/${problemId}/solution`) 
          .then(response => {
              commit('setError', '')
              commit('setError404', '')
              commit('setSolution', response.data)
              resolve(response.data[0])
          })
          .catch(error => {
            commit('setError', error.response.data.errors)
            reject(error.response.data.message)
          })
      })
    },
    postSolution: async ({
      commit
    }, param) => {
      await axios.post(process.env.VUE_APP_ROOT_URL + `/problem/${param.problemId}/solution`, {
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

    deleteSolution: async ({
      commit
    }, id) => {
      await axios.delete(process.env.VUE_APP_ROOT_URL  + `/solution/${id}`).then(() => {
            commit('setError', '')
            commit('setError404', '')
            commit('deleteSolution', id)
        })
        .catch(error => {
          commit('setError404', error.response.data.message)
        })
    },

    editSolution: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL  + `/solution/${param.id}`, {
          name: param.name
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('editSolutionOther', response.data)
          commit('sortSolutions')
          resolve(response)
        }).catch((error) => {
          if (error.response.status == 422) {
            commit('setError404', '')
            commit('setError404', error.response.data.errors.name[0])
            reject(error.response.data.message)
          } else {
            commit('setError404', '')
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          }
        })
      })
    },
    checkAmountSolInWork: async ({
      state
    }, obj) => {
      return new Promise((resolve, reject) => {
        if (state.solutions.find(s => s.id == obj.id) && obj.in_work.name == "В работе") {
          reject('false')
        } else if (state.solutionsOther.find(s => s.id == obj.id) && obj.in_work.name == "Не в работе") {
          reject('false')
        } else {
          resolve('true')
        }
      })
    },

    changeinWork: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL  + `/solution/${param.id}/change-in-work`, {
          in_work: param.in_work
        }).then(response => {
          commit('setError', '')
          commit('editinWork', response.data)
          commit('sortSolutions')
          resolve(response)
        }).catch((error) => {

          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.errors)
            reject(error.response.data.errors)
          }
        })
      })
    },

    changeStatus: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
      axios.put(process.env.VUE_APP_ROOT_URL  + `/solution/${param.id}/change-status`, {
        status: param.status
      }).then(response => {
        commit('setError', '')
        commit('editStatus', response.data)
        resolve(response.data)
      }).catch((error) => {
        if (error.response.status == 404 || error.response.status == 403) {
          commit('setError404', error.response.data.message)
          reject(error.response.data.message)
        } else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors)
          reject(error.response.data.errors)
        }
      })
    })
    },

    changeDeadline: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
      axios.put(process.env.VUE_APP_ROOT_URL  + `/solution/${param.id}/set-deadline`, {
        deadline: param.deadline
      }).then(response => {
        commit('setError', '')
        commit('editDeadline', response.data)
        resolve(response.data)
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
          reject(error.response.data.message)
        } else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors.deadline[0])
          reject(error.response.data.errors.deadline[0])
        }
      })
    })
    },

    getAllUsers: async ({
      commit
    }) => {
      await axios.get(process.env.VUE_APP_ROOT_URL + '/users').then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setAllUsers', response.data)
            commit('setAllUsersReduced', response.data)
            commit('setSolution', response.data)
        })
        .catch(error => {
          commit('setError404', '')
          commit('setError404', error.response.message)
        })
    },
    changeExecutor: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
      axios.put(process.env.VUE_APP_ROOT_URL  + `/solution/${param.id}/set-executor`, {
        executor_id: param.uid
      }).then(response => {
        commit('setError', '')
        commit('setError404', '')
        commit('editExecutor', response.data)
        resolve(response.data)
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
          reject(error.response.data.message)
        } else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors.executor_id[0])
          reject(error.response.data.errors.executor_id[0])
        }
      })
    })
    },

    editPlan: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
      axios.put(process.env.VUE_APP_ROOT_URL  + `/solution/${param.id}/set-plan`, {
        plan: param.plan
      }).then(response => {
        commit('setError', '')
        commit('setError404', '')
        commit('editPlan', response.data)
        resolve(response.data)
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
          reject(error.response.data.message)
        } else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors.plan[0])
          reject(error.response.data.errors.plan[0])
        }
      })
    })
    },
    editTeam: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
      axios.put(process.env.VUE_APP_ROOT_URL  + `/solution/${param.id}/set-team`, {
        team: param.team
      }).then(response => {
        commit('setError', '')
        commit('setError404', '')
        commit('editTeam', response.data)
        resolve(response.data)
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
          reject(error.response.data.message)
        } else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors.team[0])
          reject(error.response.data.errors.team[0])
        }
      })
    })
    },

  }
}