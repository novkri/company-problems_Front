import axios from "axios";
const BASEURL = "http://localhost:3000" 
// const BASEURL = 'http://31.31.199.37/api'

export default {
  state: {
    users: [],
    errorU: '',
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
    }
    
  },
  actions: {
    register: async ({commit}, formData) => {
      console.log(formData);
      // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      // await axios.post(BASEURL + '/register', formData).then(response => {
        await axios.post(BASEURL+'/users', formData).then(response => {
        console.log(response);
        if (response.status == 200) { 
          console.log(response);
            commit('setErrorU', '')
            commit('addUser', response.data)
        }
        })
      .catch((error) => {
        console.log(error.response) 
        commit('setErrorU', error.response)})
    },
    login: async ({commit}, user) => {
        console.log(user);
        await axios.post( BASEURL+'/auth', user)
        // axios({url: BASEURL+'/auth', data: user, method: 'POST' })
          .then(resp => {
            console.log(resp);
          })
        .catch(err => {
          console.log(err.response);
          commit('setErrorU', err.response)
        })
    }
  
  }
}