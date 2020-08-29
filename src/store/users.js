import axios from "axios";
const BASEURL = "http://localhost:3000/users" 
// const BASEURL = 'http://31.31.199.37/api/problem'

export default {
  state: {
    users: [],
    errorU: ''
  },
  getters: {
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
    // addProblem: (state, payload) => {
    //     state.problems.push(payload)
    // },
    // deleteProblem: (state, payload) => {
    //     state.problems = state.problems.filter(problem => problem.id !== payload)
    // },
    // editProblem: (state, payload) => {
    //     state.problems.find(problem => problem.id == payload.id).name = payload.name
    // },
    // setError: (state, payload) => {
    //   state.error = payload
    // },
    
  },
  actions: {
    getUsers: async ({commit}) => {
      await axios.get(BASEURL)
        .then(response => {
            if (response.status == 200) {
              console.log('data: ', response.data);
              commit('setUsers', response.data) 
            }
          })
        .catch(error => 
          commit('setError', error.response.data.message)
        )
    },
    // postProblem: async ({commit}, param) => {
    //   // await axios.post('http://31.31.199.37/api/problem', {name: param.name})
    //   await axios.post(BASEURL, param)
    //   .then(response => {
    //     if (response.status == 201) {
    //       commit('addProblem', response.data)
    //     }
    //     })
    //   .catch(error => commit('setError', error.response.data.message))
    // }, 
    // deleteProblem: async ({commit}, param) => {
    //   await axios.delete(BASEURL + `/${param.id}`).then(response => {
    //     if (response.status == 200) { 
    //         commit('deleteProblem', param.id)
    //     }
    //     })
    //   .catch(error => commit('setError', error.response.data.message))
    // },
    // editProblem: async ({commit}, param) => {
    //   console.log(param);
    //   axios.put(BASEURL + `/${param.id}`, {name: param.name}).then(response => {
    //     console.log(response);
    //     if (response.status == 200) { 
    //         commit('editProblem', response.data)
    //     }
    //     })
    //   .catch(error => commit('setError', error.response.data.message))
    // }
  }
}