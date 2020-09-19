import axios from "axios";
const BASEURL = 'http://31.31.199.37/api/groups' 

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
    // error: '',
    // error404: '',
  },
  getters: {
    groups: state => {
      return state.groups
    },
  },
  mutations: {
    setGroups: (state, payload) => {
      state.groups = payload
    },
    addGroup: (state, payload) => {
      state.groups.push(payload)
    },
    deleteGroup: (state, payload) => {
      state.groups = state.groups.filter(group => group.id !== payload)
    },
    editGroup: (state, payload) => {
      state.groups.find(group => group.id == payload.id).name = payload.name
    },
  },
  actions: {
    getGroups: async ({
      commit
    }) => {
      await axios.get(BASEURL)
        .then(response => {
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
    postGroup: async ({
      commit
    }, param) => {
      await axios.post(BASEURL, param)
        .then(response => {
          if (response.status == 201) {
            commit('setError', '')
            commit('setError404', '')
            commit('addGroup', response.data)
          }
        })
        .catch(error => {
          if (error.response.status !== 422) {
            commit('setError404', error.response.data.message)
          } else {
            commit('setError', error.response.data.errors.name[0])
          }
        })

    },
    deleteGroup: async ({
      commit
    }, param) => {
      await axios.delete(BASEURL + `/${param.id}`).then(response => {
          if (response.status == 200) {
            commit('setError', '')
            commit('setError404', '')
            commit('deleteGroup', param.id)
          }
        })
        .catch(error => {
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
            commit('setError', error.response.data.errors.name[0])
            reject(error.response.data.errors.name[0])
          }
        })
      })
    }
  }
}