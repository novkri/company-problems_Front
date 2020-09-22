import axios from "axios";
const BASEURL = 'http://31.31.199.37/api/group'

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
    groups: [],
    members: [],
    leader: '',
    leaderReduced: '',
    // error: '',
    // error404: '',
  },
  getters: {
    groups: state => {
      return state.groups
    },
    leader: state => {
      return state.leader
    },
    leaderReduced: state => {
      return state.leaderReduced
    },
    members: state => {
      return state.members
    },
  },
  mutations: {
    setGroups: (state, payload) => {
      state.groups = Object.values(payload)
      console.log(payload, state.groups);
    },
    setLeader: (state, payload) => {
      state.leader = payload[0]
    },
    setLeaderReduced: (state, payload) => {
      payload[0].name = payload[0].name[0]+'.'
      payload[0].father_name ? payload[0].father_name = payload[0].father_name[0]+'.' : ' '
      state.leaderReduced = payload[0]
    },
    setMembers: (state, payload) => {
      payload.length > 0 ? state.members = Object.values(payload) : state.members = []
      console.log(state.members);
      console.log(payload);
    },

    addGroup: (state, payload) => {
      console.log(state.groups);
      console.log(typeof payload);
      state.groups.push(payload)
      console.log(state.groups);
    },
    deleteGroup: (state, payload) => {
      state.groups = state.groups.filter(group => group.id !== payload)
    },
    editGroup: (state, payload) => {
      state.groups.find(group => group.id == payload.id).name = payload.name
    },
    editGroupShort: (state, payload) => {
      state.groups.find(group => group.id == payload.id).short_name = payload.short_name
    },
    editExecutorGroup: (state, payload) => {
      state.groups.find(group => group.id == payload.id).executor_id = payload.executor_id
    },
    setUserToGroup: (state, payload) => {
      state.members.push(payload)
    },
    setRemoveUser: (state, payload) => {
      state.members = state.members.filter(m => m.id !== payload.uid)
    },
  },
  actions: {
    getGroups: async ({
      commit
    }) => {
      await axios.get(BASEURL)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('setGroups', response.data)
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            commit('setError404', error.response.data.errors)
          } else {
            commit('setError', error.response.data.message)
          }
        })
    },
    getLeader: async ({
      commit
    }, id) => {
      await axios.get(BASEURL + `/${id}/leader`)
        .then(response => {
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('setLeader', response.data)
            commit('setLeaderReduced', response.data)
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            commit('setError404', error.response.data.errors)
          } else {
            commit('setError', error.response.data.message)
          }
        })
    },
    getMembers: async ({
      commit
    }, id) => {
      await axios.get(BASEURL + `/${id}/user`)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('setMembers', response.data)
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            commit('setError404', error.response.data.errors)
          } else {
            commit('setError', error.response.data.message)
          }
        })
    },


    postGroup: async ({
      commit
    }, param) => {
      console.log(param);
      return new Promise((resolve, reject) => {
        axios.post(BASEURL, param)
          .then(response => {
            console.log(response.data);

            commit('setError', '')
            commit('setError404', '')
            commit('addGroup', response.data)

            resolve(response.data)
          })
          .catch(error => {
            console.log(error.response);
            if (error.response.status !== 422) {
              commit('setError404', error.response.data.message)
              reject(error.response.data.message)
            } else {
              error.response.data.errors ? commit('setError', error.response.data.errors) : commit('setError', error.response.data.error)
              // commit('setError', error.response.data.errors)
              reject(error.response.data)
            }

          })
      })

    },
    deleteGroup: async ({
      commit
    }, param) => {
      // param.id = 10000000
      await axios.delete(BASEURL + `/${param.id}`).then(response => {
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('deleteGroup', param.id)
          }
        })
        .catch(error => {
          console.log(error.response);
          if (error.response.status !== 422) {
            commit('setError404', error.response.data.message)
          } else {
            commit('setError', error.response.data.errors.name[0])
          }
        })

    },
    // checkIfExists: async ({
    //   commit
    // }, param) => {
    //   axios.get(BASEURL + `/${param.id}`).catch((error) => {
    //     commit('setError404', error.response.data.message)
    //   })
    // },

    editGroup: async ({
      commit
    }, param) => {
      console.log(param);
      return new Promise((resolve, reject) => {
        axios.put(BASEURL + `/${param.id}`, {
          name: param.name
        }).then(response => {
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('editGroup', response.data)
            resolve(response)
          }
        }).catch((error) => {
          if (error.response.status !== 422) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else {
            console.log(error.response);
            commit('setError404', error.response.data.errors.name[0])
            reject(error.response.data.errors.name[0])
          }
        })
      })
    },

    editGroupShort: async ({
      commit
    }, param) => {
      return new Promise((resolve, reject) => {
        axios.put(BASEURL + `/${param.id}/change-short-name`, {
          short_name: param.short_name
        }).then(response => {
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('editGroup', response.data)
            resolve(response)
          }
        }).catch((error) => {
          if (error.response.status !== 422) {
            commit('setError404', error.response.data.message)
            reject(error.response.data.message)
          } else {
            commit('setError404', error.response.data.errors.short_name[0])
            reject(error.response.data.errors.short_name[0])
          }
        })
      })
    },

    // checkIfOk: async ({
    //   state,
    //   commit
    // }, param) => {
    //   // param.id = 10000000000
    //   return new Promise((resolve, reject) => {
    //     if (state.groups.filter(t => t.description == param.description).length > 1 && state.tasks.filter(t => t.executor_id == param.executor_id).length > 1) {
    //       commit('setError404', 'Такая задача уже существует с таким ответственным')
    //       reject('false')

    //     } else {
    //       resolve('true')
    //     }
    //   })
    // },
    changeExecutorGroup: async ({
      commit
    }, param) => {
      // param.id = 10000000000
      axios.put(BASEURL + `/${param.id}/set-executor`, {
        leader_id: param.uid
      }).then(response => {
        commit('setError', '')
        commit('editExecutorGroup', response.data)
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
    putUserToGroup: async ({
      commit
    }, param) => {
      console.log(param);
      // param.uid = 10000000000
      axios.put(BASEURL + `/${param.id}/user/${param.uid}`).then(response => {
        commit('setError', '')
        commit('setUserToGroup', response.data)
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
    removeUserFromGroup: async ({
      commit
    }, param) => {
      // param.uid = 10000000000
      axios.put(BASEURL + `/${param.id}/remove-user/${param.uid}`).then(response => {
        commit('setError', '')
        commit('setRemoveUser', param)
        console.log(response.data);
      }).catch((error) => {
        console.log(error.response);
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