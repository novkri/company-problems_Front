import axios from "axios";
// const BASEURL = "http://localhost:3000" 
const BASEURL = 'http://31.31.199.37/api'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Accept'] = 'application/json'

export default {
  state: {
    users: [],
    errorU: [],
    token: localStorage.getItem('user-token') || '',
    status: '',
  },
  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    users: state => {
      return state.users
    },
    errorU: state => {
      return state.errorU
    }
  },
  mutations: {
    setUsers: (state, payload) => {
      state.users = payload
    },
    addUser: (state, payload) => {
      state.users.push(payload)
    },
    AUTH_REQUEST: (state) => {
      state.status = 'loading'
    },
    AUTH_SUCCESS: (state, token) => {
      state.status = 'success'
      state.token = token
    },
    AUTH_ERROR: (state) => {
      state.status = 'error'
    },
    setErrorU: (state, payload) => {
      state.errorU = payload
      console.log(state.errorU, payload);
    }
    
  },
  actions: {
    register: async ({commit}, formData) => {
      await axios.post(BASEURL + '/register', formData).then(response => {
        if (response.status == 201) { 
          console.log(response);
            commit('setErrorU', '')
            commit('addUser', response.data)
        }
        })
      .catch((error) => {
        console.log(error.response.data.errors) 
        commit('setErrorU', error.response.data.errors)})
    },
    login: async ({commit}, user) => {
        console.log(user);
        await axios.post( BASEURL+'/login', user)
          .then(resp => {
            commit('setErrorU', '')
            console.log(resp);
          })
        .catch(err => {
          commit('setErrorU', err.response.data.errors)
        })
    }
  
  }
}