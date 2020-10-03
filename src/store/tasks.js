import axios from "axios";
const BASEURL = 'http://31.31.199.37/api/solution' //все решения
const URLTASK = 'http://31.31.199.37/api/task' //одно решение


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
    tasks: [],
    currentSolution: '',
    token: localStorage.getItem('user-token') || '',
  },
  getters: {
    tasks: state => {
      return state.tasks = state.tasks.sort(function (a, b) {
        return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1
      })
    },
    currentSolution: state => {
      return state.currentSolution
    },

  },
  mutations: {
    setTasks: (state, payload) => {
      state.tasks = payload
    },
    setCurrentSolution: (state, payload) => {
      state.currentSolution = payload
    },
    clearTasks: (state) => {
      state.tasks = null
    },
    addTask: (state, payload) => {
      if (!state.tasks) {
        state.tasks = []
        state.tasks.push(payload)
      } else {
        state.tasks.push(payload)
      }
    },
    deleteTask: (state, payload) => {
      state.tasks = state.tasks.filter(t => t.id !== payload)
    },

    editTask: (state, {
      id,
      description
    }) => {
      state.tasks.find(task => task.id == id).description = description
    },
    editinWorkTask: (state, payload) => {
      if (payload.in_work) {
        state.tasks.push(payload)
      } else {
        state.tasks = state.tasks.filter(s => s.id !== payload.id)
      }
    },
    editStatusTask: (state, payload) => {
      state.tasks.find(task => task.id == payload.id).status = payload.status
    },
    editDeadlineTask: (state, payload) => {
      state.tasks.find(task => task.id == payload.id).deadline = payload.deadline
    },
    editExecutorTask: (state, payload) => {
      state.tasks.find(task => task.id == payload.id).executor_id = payload.executor_id
    },
    // editExecutorT: (state, payload) => {
    //   state.tasks.find(task => task.id == payload.id).executor_id = payload.executor_id
    // },

  },
  actions: {
    clearTasks: async ({
      commit
    }) => {
      commit('clearTasks')
    },
    getCurrentSolution: async ({
      commit
    }, param) => {
      commit('setCurrentSolution', param)
    },
    getTasks: async ({
      commit
    }, param) => {
      await axios.get(BASEURL + `/${param}/task`)
        .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setTasks', response.data)
        })
        .catch(error =>
          commit('setError', error.response.data.errors)
        )
    },
    postTask: async ({
      commit
    }, param) => {
      // param.solutionId = 100000000
      return new Promise((resolve, reject) => {
        axios.post(BASEURL + `/${param.solutionId}/task`, {
            description: param.params.taskName,
            deadline: param.params.deadline,
            executor_id: param.params.executor
          })
          .then(response => {
            if (response.status == 201) {
              commit('setError', '')
              commit('setError404', '')
              commit('addTask', {
                ...response.data,
                status: "К исполнению"
              })
              resolve(response)
            }
          })
          .catch(error => {
            commit('setError404', '')
            if (error.response.status == 422) {
              if (error.response.data.errors.description) {
                commit('setError', error.response.data.errors.description[0])
              } else if (error.response.data.errors.deadline) {
                commit('setError404', error.response.data.errors.deadline[0])
              } else {
                commit('setError404', error.response.data.errors)
              }
            } else {
              commit('setError404', error.response.data.message)
            }
            reject(error.response)
          })
      })
    },

    deleteTask: async ({
      commit
    }, id) => {
      // id = 10000000000
      await axios.delete(URLTASK + `/${id}`).then(() => {
            commit('setError', '')
            commit('setError404', '')
            commit('deleteTask', id)
        })
        .catch(error => {
          commit('setError404', error.response.data.message)
        })
    },

    checkIfOk: async ({
      state,
      commit
    }, param) => {
      // param.id = 10000000000
      return new Promise((resolve, reject) => {
        if (state.tasks.filter(t => t.description == param.description).length > 1 && state.tasks.filter(t => t.executor_id == param.executor_id).length > 1) {
          commit('setError404', 'Такая задача уже существует с таким ответственным')
          reject('false')

        } else {
          resolve('true')
        }
      })
    },
    editTask: async ({
      commit
    }, param) => {
      // param.id = 10000000000
      return new Promise((resolve, reject) => {
        axios.put(URLTASK + `/${param.id}`, {
          description: param.description
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('editTask', response.data)
          resolve(response)
        }).catch((error) => {
          if (error.response.status == 422) {
            commit('setError404', '')
            if (error.response.data.errors.description) {
              commit('setError404', error.response.data.errors.description[0])
              reject(error.response.data.errors)
            } else {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            }
          } else {
            commit('setError404', '')
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          }
        })
      })
    },


    changeStatusTask: async ({
      commit
    }, param) => {
      // console.log(param);
      // param.id = 10000000000
      axios.put(URLTASK + `/${param.id}/change-status`, {
        status: param.status
      }).then(response => {
        commit('setError', '')
        commit('setError404', '')
        commit('editStatusTask', response.data)
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
        } else if (error.response.status == 422) {
          // console.log(error.response);
          commit('setError404', error.response.data.errors)
        }
      })
    },

    changeDeadlineTask: async ({
      commit
    }, param) => {
      // param.id = 10000000000
      return new Promise((resolve, reject) => {
        axios.put(URLTASK + `/${param.id}/set-deadline`, {
          deadline: param.deadline
        }).then(response => {
          commit('setError', '')
          commit('editDeadlineTask', response.data)
          resolve(response)
        }).catch((error) => {
          // console.log(error.response);
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.errors)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.errors.deadline[0])
            reject(error.response.data.errors)
          }
        })

      })
    },

    changeExecutorTask: async ({
      commit
    }, param) => {
      // param.id = 10000000000
      axios.put(URLTASK + `/${param.id}/set-executor`, {
        executor_id: param.uid
      }).then(response => {
        commit('setError', '')
        commit('editExecutorTask', response.data)
      }).catch((error) => {
        if (error.response.status == 404) {
          commit('setError404', error.response.data.message)
        } else if (error.response.status == 422) {
          if (error.response.data.errors.executor_id) {
            commit('setError404', error.response.data.errors.executor_id[0])
          } else {
            commit('setError404', error.response.data.errors)
          }
        }
      })
    },
  }
}