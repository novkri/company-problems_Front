import axios from "axios";
const BASEURL = 'http://31.31.199.37/api/problem'

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
    problems: [],
    error: '',
    error404: '',
    token: localStorage.getItem('user-token') || '',
  },
  getters: {
    problems: state => {
      return state.problems = state.problems.sort(function (a, b) {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1
      })
    },
    // filterProblemssBy: state => status => state.problems.filter(p => p.status === status),
    // // state => {
    // //   return state.problems.filter(p => p.status == "На рассмотрении")
    // // },
    error: state => {
      return state.error
    },
    error404: state => {
      return state.error404
    }
  },
  mutations: {
    setProblems: (state, payload) => {
      state.problems = payload
      state.problems = state.problems.filter(p => p.status !== "Удалена" && p.status !== "Решена")
      // // console.log(state.problems);
      // state.problems
    },
    // sortProblems: (state, payload) => {
    //   // console.log(state.problems);
    // //  state.problems = 
    //  return state.problems.filter(p => p.status == payload)
    // //  // console.log(state.problems);
    // },
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

  },

  actions: {
    getProblems: async ({
      commit
    }) => {
      await axios.get(BASEURL)
        .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setProblems', response.data)
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
      await axios.get(BASEURL+`/${id}`)
        .then(response => {
            commit('setError', '')
            commit('setError404', '')
            commit('setThisProblem', response.data)
        })
        .catch(error => {
          if (error.response.status == 401) {
            commit('setError404', error.response.data.errors)
          } else {
            commit('setError', error.response.data.message)
          }
        })
    },

    postProblem: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
       axios.post(BASEURL, param)
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
      await axios.delete(BASEURL + `/${param.id}`).then(() => {
          commit('setError', '')
          commit('setError404', '')
          commit('deleteProblem', param.id)
        })
        .catch(error => {
          if (error.response.status !== 422) {
            commit('setError404', error.response.data.message)
          } else {
            commit('setError404', error.response.data.error)
          }
        })

    },
    checkIfExists: async ({
      commit
    }, param) => {
      axios.get(BASEURL + `/${param.id}`).catch((error) => {
        commit('setError404', error.response.data.message)
      })
    },

    editProblem: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(BASEURL + `/${param.id}`, {
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

    problemLike: async ({commit}, id) => {
      axios.post(BASEURL + `/${id}/like`)
        .then(() => {
          commit('setError', '')
          commit('setError404', '')
          commit('changeProblemLike', id)
        })
        .catch((error) => {
          commit('setError404', error.response.data.message)
        })
    },

    sendToGroup: async ({commit}, param) => {
      // // console.log(param);
      axios.post(BASEURL + `/${param.id}/send-to-group`, {group_ids: param.groupsArray})
        .then((r) => {
          console.log(r);
          commit('setError', '')
          commit('setError404', '')
          // ?????
          // commit('changeProblemLike', id)
        })
        .catch((error) => {
          commit('setError404', error.response.data.message)
        })
    },
    editExp: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
      axios.put(BASEURL + `/${param.id}/set-experience`, {
        experience: param.experience
      }).then(response => {
        commit('setError', '')
        commit('setError404', '')
        commit('editExp', response.data)
        resolve(response.data)
      }).catch((error) => {
        // // console.log(error.response);
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
      axios.put(BASEURL + `/${param.id}/set-result`, {
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
      axios.put(BASEURL + `/${param.id}`, {
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
      axios.put(BASEURL + `/${param.id}/set-importance`, {
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
      axios.put(BASEURL + `/${param.id}/set-urgency`, {
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
      axios.put(BASEURL + `/${param.id}/set-progress`, {
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
      axios.put(BASEURL + `/${id}/send-for-confirmation`).then(response => {
        commit('setError', '')
        commit('setError404', '')
        // ????/
        // commit('problemSolved', response.data)
        //????/
        resolve(response.data)
        // ??????????
      }).catch((error) => {
        // console.log(error.response);
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
      // console.log(id);
      // param.id = 10000000000
      return new Promise((resolve, reject) => {
      axios.put(BASEURL + `/${id}/reject-solution	`).then(response => {
        // console.log(response);
        commit('setError', '')
        commit('setError404', '')
        // ????/
        // commit('problemReject', response.data)
        //????/
        resolve(response.data)
        // ??????????
      }).catch((error) => {
        // console.log(error.response);
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
      // console.log(id);
      // param.id = 10000000000
      return new Promise((resolve, reject) => {
      axios.put(BASEURL + `/${id}/confirm-solution`).then(response => {
        // console.log(response);
        commit('setError', '')
        commit('setError404', '')
        // ????/
        // commit('problemConfirm', response.data)
        //????/
        resolve(response.data)
        // ??????????
      }).catch((error) => {
        // console.log(error.response);
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
      axios.put(BASEURL + `/${param.id}/set-description`, {
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
          commit('setError404', error.response.data.errors.description[0])
          reject(error.response.data.errors.description[0])
        }
      })
    })
    },

    changePossible: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
      axios.put(BASEURL + `/${param.id}/set-possible-solution`, {
        possible_solution: param.possible_solution
      }).then(response => {
        commit('setError', '')
        commit('setError404', '')
        commit('changePossible', response.data)
        resolve(response.data)
      }).catch((error) => {
        console.log(error.response);
        if (error.response.status == 404) {
          commit('setError404', error.response.data.error)
          reject(error.response.data.error)
        } else if (error.response.status == 422) {
          commit('setError404', error.response.data.errors.possible_solution[0])
          reject(error.response.data.errors.possible_solution[0])
        }
      })
    })
    },
  }
}