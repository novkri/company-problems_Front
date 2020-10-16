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
    problems: [],
    myProblems: [],
    error: '',
    error404: '',
    token: localStorage.getItem('user-token') || '',
    statusesProblem: [],
    currentGroup: '',

    amountOfMyProblems: '',
    amountOfProblemsForExecution: '',
    amountOfProblemsForConfirmation: '',
    amountOfProblemsForConfirmationAdmin: ''
  },
  getters: {
    currentGroup: state => {
      return state.currentGroup
    },


    statusesProblem: state => {
      return state.statusesProblem
    },
    problems: state => {
      return state.problems
      // не работает в моих проблемах
      // return state.problems = state.problems.sort(function (a, b) {
      //   return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1
      // })
    },
    myProblems: state => {
      return state.myProblems
    },

    error: state => {
      return state.error
    },
    error404: state => {
      return state.error404
    },

    amountOfMyProblems: state => {
      return state.amountOfMyProblems
    },
    amountOfProblemsForExecution: state => {
      return state.amountOfProblemsForExecution
    },
    amountOfProblemsForConfirmation: state => {
      return state.amountOfProblemsForConfirmation
    },
    amountOfProblemsForConfirmationAdmin: state => {
      return state.amountOfProblemsForConfirmationAdmin
    },
  },
  mutations: {
    currentGroup: (state, payload) => {
      state.currentGroup = payload
    },

    statusesProblem: (state, payload) => {
      state.statusesProblem = payload
    },
    setProblems: (state, payload) => {
      payload ? state.problems = payload : state.problems = []
    },

    setThisProblem: (state, payload) => {
      let problemIdx = state.problems.findIndex(p => p.id == payload.id)
      state.problems.splice(problemIdx, 1, payload)
    },
    addProblem: (state, payload) => {
      state.problems.push(payload)
    },
    deleteProblem: (state, payload) => {
      state.problems = state.problems.filter(problem => problem.id !== payload)
    },
    editProblem: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).name = payload.name
    },
    setError: (state, payload) => {
      state.error = payload
    },
    setError404: (state, payload) => {
      state.error404 = payload
    },
    changeProblemLike: (state, payload) => {
      state.problems.find(problem => problem.id == payload).is_liked = !state.problems.find(problem => problem.id == payload).is_liked
      state.problems.find(problem => problem.id == payload).is_liked ? state.problems.find(problem => problem.id == payload).likes_count++ : state.problems.find(problem => problem.id == payload).likes_count--
    },
    editExp: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).experience = payload.experience
    },
    editResult: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).result = payload.result
    },
    editProblemName: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).name = payload.name
    },

    changeImportance: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).importance = payload.importance
    },
    changeUrgency: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).urgency = payload.urgency
    },

    editProgress: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).progress = payload.progress
    },

    changeProblemDescription: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).description = payload.description
    },
    changePossible: (state, payload) => {
      state.problems.find(problem => problem.id == payload.id).possible_solution = payload.possible_solution
    },



    amountOfMyProblems: (state, payload) => {
      state.amountOfMyProblems = payload
    },
    amountOfProblemsForExecution: (state, payload) => {
      state.amountOfProblemsForExecution = payload
    },
    amountOfProblemsForConfirmation: (state, payload) => {
      state.amountOfProblemsForConfirmation = payload
    },
    amountOfProblemsForConfirmationAdmin: (state, payload) => {
      state.amountOfProblemsForConfirmationAdmin = payload
    },

    problemSolved: (state, payload) => {
      state.problems.find(p => p.id == payload.id).status = payload.status
    },
    problemReject: (state, payload) => {
      state.problems.find(p => p.id == payload.id).status = payload.status
    },
    problemConfirm: (state, payload) => {
      state.problems.find(p => p.id == payload.id).status = payload.status
    },
  },

  actions: {

    countAmountOfMyProblems: async ({
      commit
    }, param) => {
      return new Promise((resolve) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/my-problems', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('amountOfMyProblems', response.data.length)
            resolve(response.data)
          })
      })
    },
    countAmountOfProblemsForExecution: async ({
      commit
    }, param) => {
      return new Promise((resolve) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/problems-for-execution', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('amountOfProblemsForExecution', response.data.length)
            resolve(response.data)
          })
      })
    },

    countAmountOfProblemsForConfirmation: async ({
      commit
    }, param) => {
      return new Promise((resolve) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/group-problems', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('amountOfProblemsForConfirmation', response.data.length)
            resolve(response.data)
          })
      })
    },
    countAmountOfProblemsForConfirmationAdmin: async ({
      commit
    }, param) => {
      return new Promise((resolve) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/problems-of-all-groups', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('amountOfProblemsForConfirmationAdmin', response.data.length)
            resolve(response.data)
          })
      })
    },

    changeStatusesProblem: ({
      commit
    }, arr) => {
      commit('statusesProblem', arr)
    },
    filterImportance: async ({
      commit
    }, param) => {

      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + `/problem${param.path}`, {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            resolve(response.data)
          })
          .catch(error => {
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },
    filterTime: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + `/problem${param.path}`, {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            resolve(response.data)
          })
          .catch(error => {
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },
    filterProblemStatus: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + `/problem${param.path}`, {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            console.log(response);
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            resolve(response.data)
          })
          .catch(error => {
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },

    getMyProblems: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/my-problems', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            // // commit('amountOfMyProblems', response.data.length)
            resolve(response.data)
          })
          .catch(error => {
            commit('setMyProblems', '')
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },

    getProblemsForExecution: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/problems-for-execution', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            // commit('amountOfProblemsForExecution', response.data.length)
            resolve(response.data)
          })
          .catch(error => {
            commit('setProblems', '')
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },
    problemsForConfirmation: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/group-problems', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            // commit('amountOfProblemsForConfirmation', response.data.length)
            resolve(response.data)
          })
          .catch(error => {
            commit('setProblems', '')
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },
    archive: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        // axios.get(process.env.VUE_APP_ROOT_URL+'/problem/problems-user-archive')
        // axios.get(process.env.VUE_APP_ROOT_URL+'/problem/problems-group-archive')
        // 0:  axios.get(process.env.VUE_APP_ROOT_URL+'/problem/problems-archive'
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/problems-archive', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            resolve(response.data)
          })
          .catch(error => {
            commit('setProblems', '')
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },
    getAllGroupsProblems: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/problems-of-all-groups', {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setProblems', '')
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            resolve(response.data)
          })
          .catch(error => {
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },
    getProblemsByGroups: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + `/problem/problems-by-groups/${param.group}`, {
            params: {
              urgency: param.urgency,
              importance: param.importance,
              deadline: param.deadline,
              status: param.status
            }
          })
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
            resolve(response.data)
          })
          .catch(error => {
            commit('setProblems', '')
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },

    getProblems: async ({
      commit
    }) => {
      await axios.get(process.env.VUE_APP_ROOT_URL + '/problem')
        .then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('setProblems', response.data.filter(p => p.status !== "Удалена" && p.status !== "Решена"))
        })
        .catch(error => {
          if (error.response.status == 401) {
            commit('setError404', error.response.data.errors)
          } else {
            commit('setError', error.response.data.message)
          }
        })
    },

    getThisProblem: async ({
      commit
    }, id) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + `/problem/${id}`)
          .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setThisProblem', response.data)
            resolve(response.data)
          })
          .catch(error => {
            if (error.response.status == 401) {
              commit('setError404', error.response.data.errors)
              reject(error.response.data.errors)
            } else {
              commit('setError', error.response.data.message)
              reject(error.response.data.message)
            }
          })
      })
    },

    postProblem: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.post(process.env.VUE_APP_ROOT_URL + '/problem', param)
          .then(response => {
            if (response.status == 201) {
              commit('setError', '')
              commit('setError404', '')
              commit('addProblem', response.data)
              resolve(response.data)
            }
          })
          .catch(error => {
            if (error.response.status !== 422) {
              commit('setError404', error.response.data.message)
              reject()
            } else {
              error.response.data.errors ? commit('setError', error.response.data.errors) : commit('setError404', error.response.data.error)
              reject()
            }
          })
      })
    },
    deleteProblem: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.delete(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}`).then(() => {
            commit('setError', '')
            commit('setError404', '')
            commit('deleteProblem', param.id)
            resolve('ok')
          })
          .catch(error => {
            if (error.response.status !== 422) {
              commit('setError404', error.response.data.message)
              reject()
            } else {
              commit('setError404', error.response.data.error)
              reject()
            }
          })
      })
    },
    checkIfExists: async ({
      commit
    }, param) => {
      axios.get(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}`).catch((error) => {
        commit('setError404', error.response.data.message)
      })
    },

    editProblem: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}`, {
          name: param.name
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('editProblem', response.data)
          resolve(response)
        }).catch((error) => {
          if (error.response.status !== 422) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else {
            commit('setError', error.response.data.errors.name[0])
            reject(error.response.data.errors.name[0])
          }
        })
      })
    },

    problemLike: async ({
      commit
    }, id) => {
      axios.post(process.env.VUE_APP_ROOT_URL + `/problem/${id}/like`)
        .then(() => {
          commit('setError', '')
          commit('setError404', '')
          commit('changeProblemLike', id)
        })
        .catch((error) => {
          commit('setError404', error.response.data.message)
        })
    },

    sendToGroup: async ({
      commit
    }, param) => {
      axios.post(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}/send-to-group`, {
          group_ids: param.groupsArray
        })
        .then(() => {
          commit('setError', '')
          commit('setError404', '')
        })
        .catch((error) => {
          commit('setError404', error.response.data.message)
        })
    },
    editExp: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}/set-experience`, {
          experience: param.experience
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('editExp', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.errors.experience[0])
            reject(error.response.data.errors.experience[0])
          }
        })
      })
    },
    editResult: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}/set-result`, {
          result: param.result
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('editResult', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.errors.result[0])
            reject(error.response.data.errors.result[0])
          }
        })
      })
    },

    editProblemName: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}`, {
          name: param.name
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('editProblemName', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            error.response.data.errors ? commit('setError404', error.response.data.errors.name[0]) : commit('setError404', error.response.data.error)
            reject(error.response.data)
          }
        })
      })
    },

    changeImportance: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}/set-importance`, {
          importance: param.importance
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('changeImportance', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.errors.importance[0])
            reject(error.response.data.errors.importance[0])
          }
        })
      })
    },

    changeUrgency: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}/set-urgency`, {
          urgency: param.urgency
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('changeUrgency', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.errors.urgency[0])
            reject(error.response.data.errors.urgency[0])
          }
        })
      })
    },

    editProgress: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}/set-progress`, {
          progress: param.progress
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('editProgress', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.errors.progress[0])
            reject(error.response.data.errors.progress[0])
          }
        })
      })
    },

    problemSolved: async ({
      commit
    }, id) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${id}/send-for-confirmation`).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('problemSolved', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          }
        })
      })
    },
    problemReject: async ({
      commit
    }, id) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${id}/reject-solution	`).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('problemReject', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          }
        })
      })
    },
    problemConfirm: async ({
      commit
    }, id) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${id}/confirm-solution`).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('problemConfirm', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          }
        })
      })
    },

    changeProblemDescription: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}/set-description`, {
          description: param.description
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('changeProblemDescription', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          }
        })
      })
    },

    changePossible: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(process.env.VUE_APP_ROOT_URL + `/problem/${param.id}/set-possible-solution`, {
          possible_solution: param.possible_solution
        }).then(response => {
          commit('setError', '')
          commit('setError404', '')
          commit('changePossible', response.data)
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status == 404) {
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          } else if (error.response.status == 422) {
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          }
        })
      })
    },
  }
}