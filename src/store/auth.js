import axios from "axios";
const BASEURL = "http://localhost:3000/users" 
// const BASEURL = 'http://31.31.199.37/api/problem'

export default {
  state: {
    users: [],
    error: ''
  },
  getters: {
    users: state => {
      return state.users
    },
    error: state => {
      return state.error
    }
  },
  mutations: {
    setUsers: (state, payload) => {
      state.users = payload
    },
    addUser: (state, payload) => {
        state.users.push(payload)
    },
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
    // ??????
    async getUid() {
      const user = await axios.get(BASEURL)
      console.log(user);
      return user ? user.uid : null
    },
    // &??
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
    register: async ({commit}, formData) => {
      console.log(formData);
      await axios.post(BASEURL, formData).then(response => {
        if (response.status == 200) { 
            commit('setError', '')
            commit('addUser', response.data)
        }
        })
      .catch((error) => {
        commit('setError', error.response.data.errors.name[0])})
    }
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