import axios from "axios";

axios.defaults.headers.common['Accept'] = 'application/json'
axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('user-token');

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
    errorU: [],
    error401: '',
    errorUReg: [],
    token: localStorage.getItem('token') || '',
    status: '',
    user: localStorage.getItem('user') || '',
    currentUid: localStorage.getItem('currentUid') || '',
    isLeader: ''

  },
  getters: {
    user: state => {
      return state.user
    },
    isLeader: state => {
      return state.isLeader
    },
    currentUid: state => {
      return state.currentUid
    },
    errorU: state => {
      return state.errorU
    },
    error401: state => {
      return state.error401
    },
    errorUReg: state => {
      return state.errorUReg
    },
    isLoggedIn: state => {
      return !!state.token
    },
    authStatus: state => state.status,
  },
  mutations: {
    addUser: (state, payload) => {
      state.user = payload
      state.currentUid = payload.id
    },
    isLeader: (state, payload) => {
      state.isLeader = payload
    },

    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token) {
      state.status = 'success'
      state.token = token
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
      state.currentUid = ''
    },
    setErrorU: (state, payload) => {
      state.errorU = payload
    },
    setError401: (state, payload) => {
      state.error401 = payload
    },
    setErrorUReg: (state, payload) => {
      state.errorUReg = payload
    }

  },
  actions: {
    register: async ({
      commit
    }, formData) => {
      commit('auth_request')
      await axios.post(process.env.VUE_APP_ROOT_URL + '/register', formData).then(response => {
          if (response.status == 201) {
            commit('setErrorUReg', '')
            commit('setErrorU', '')
          }
        })
        .catch((error) => {
          commit('auth_error')
          localStorage.removeItem('token')
          commit('setErrorUReg', '')
          commit('setErrorUReg', error.response.data.errors)
        })
    },
    checkIsLeader: async ({
      commit
    }) => {
      await axios.get(process.env.VUE_APP_ROOT_URL + '/is-group-leader')
        .then(response => {
          commit('isLeader', response.data)
        })
    },

    login: async ({
      commit
    }, user) => {
      commit('auth_request')
      return new Promise((resolve, reject) => {
        axios.post(process.env.VUE_APP_ROOT_URL + '/login', user)
          .then(resp => {
            const token = resp.data.access_token
            const user = resp.data.user
            commit('addUser', user)

            localStorage.setItem('token', token)
            localStorage.setItem('currentUid', resp.data.user.id)
            localStorage.setItem('user', JSON.stringify(user))
            axios.defaults.headers.common['Authorization'] = token

            commit('auth_success', token)
            commit('setErrorU', '')
            commit('setError401', '')
            resolve(resp.data)
          })
          .catch(err => {
            if (err.response.status == 401) {
              commit('setError401', err.response.data.errors)
              reject(err.response.data.errors)
            } else {
              commit('setErrorU', '')
              commit('setErrorU', err.response.data.errors)
              reject(err.response.data.errors)
            }

            commit('auth_error')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          })
      })
    },
    logout({
      commit
    }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('currentUid')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  }
}