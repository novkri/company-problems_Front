import axios from "axios";
// const baseURL = "http://localhost:3000/problems" 
const BASEURL = 'http://31.31.199.37/api/problem'

export default {
  state: {
    problems: [],
    error: ''
  },
  getters: {
    problems: state => {
      console.log('getters', state.problems.sort(function (a, b) {
          return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1}))
      return state.problems
    },
    error: state => {
      return state.error
    }
  },
  mutations: {
    setProblems: (state, payload) => {
      state.problems = payload
    },
    addProblem: (state, payload) => {
      console.log('addProblem', payload);
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
    
  },
  actions: {
    getProblems: async ({commit}) => {
      await axios.get(BASEURL)
        .then(response => {
            if (response.status == 200) {
              console.log('data: ', response.data);
              commit('setProblems', response.data) 
            }
          })
        .catch(error => 
          commit('setError', error.response.data.message)
        )
    },
    postProblem: async ({commit}, param) => {
      // await axios.post('http://31.31.199.37/api/problem', {name: param.name})
      await axios.post(BASEURL, param)
      .then(response => {
        if (response.status == 201) {
          commit('addProblem', response.data)
          // commit('setProblems', response.data) 
        }
        })
      .catch(error => commit('setError', error.response.data.message))
    }, 
    deleteProblem: async ({commit}, param) => {
      await axios.delete(BASEURL + `/${param.id}`).then(response => {
        if (response.status == 200) { 
            commit('deleteProblem', param.id)
        }
        })
      .catch(error => commit('setError', error.response.data.message))
    },
    editProblem: async ({commit}, param) => {
      console.log(param);
      axios.put(BASEURL + `/${param.id}`, {name: param.name}).then(response => {
        console.log(response);
        if (response.status == 200) { 
            commit('editProblem', response.data)
        }
        })
      .catch(error => commit('setError', error.response.data.message))
    }
  }
}