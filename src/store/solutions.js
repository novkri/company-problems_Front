import axios from "axios";

const BASEURL = 'http://31.31.199.37/api/solutions' //все решения
const URLSOLUTION= 'http://31.31.199.37/api/solution' //одно решение

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
    solutions: [],
    solutionsOther: [],
    // error: '',
    // error404: '',
    token: localStorage.getItem('user-token') || '',
  },
  getters: {
    solutions: state => {
      return state.solutions = state.solutions.sort(function (a, b) {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1})
    },
    solutionsOther: state => {
      return state.solutionsOther = state.solutionsOther.sort(function (a, b) {
        console.log(new Date(a.created_at).toISOString(), new Date(b.created_at).toISOString());
        return (new Date(a.created_at).toISOString() > new Date(b.created_at).toISOString()) ? 1 : -1})
    },

  },
  mutations: {
    setSolution: (state, payload) => {
      state.solutions = payload.filter(solution => solution.in_work)
    },
    setOtherSolution: (state, payload) => {
      // state.solutionsOther = payload
      state.solutionsOther = payload.filter(sol => !sol.in_work)
    },
    addSolution: (state, payload) => {
      state.solutionsOther.push(payload)
    },
    deleteSolution: (state, payload) => {
      state.solutions = state.solutions.filter(solution => solution.id !== payload)
    },
    editSolution: (state, payload) => {
      state.solutions.find(solution => solution.id == payload.id).name = payload.name
    },
    
  },
  actions: {
    getSolutions: async ({commit}, problemId) => {
      await axios.get(BASEURL + `/${problemId}`)
        .then(response => {
          console.log(response);
            if (response.status == 200) {
              
              // console.log(response.data);
              commit('setError', '')
              commit('setOtherSolution', response.data) 
              commit('setSolution', response.data)
            }
          })
        .catch(error => 
          commit('setError', error.response.data.message)
        )
    },
    postSolution: async ({commit}, param) => {
      await axios.post(URLSOLUTION + `/${param.problemId}`, {name: param.name})
      .then(response => {
        console.log(response);
        if (response.status == 201) {
          commit('setError', '')
          commit('addSolution', response.data)
        }
        })
      .catch(error => {
        console.log(error.response);
        commit('setError', error.response.data.errors.name[0])})

    }, 
    /////////
    deleteSolution: async ({commit}, param) => {
      await axios.delete(URLSOLUTION + `/${param.id}`).then(response => {
        if (response.status == 200) { 
          commit('setError', '')
          commit('deleteProblem', param.id)
        }
        })
      .catch(error => commit('setError', error.response.data.errors.name[0]))
    },
    checkIfExists: async ({commit}, param) => {
        // URLSOLUTION ?
      axios.get(BASEURL + `/${param.id}`).catch((error) => {
        commit('setError404', error.response.data.message)})
    },

    editSolution: async ({commit}, param) => {
        axios.put(URLSOLUTION + `/${param.id}`, {name: param.name}).then(response => {
        if (response.status == 200) { 
          commit('setError', '')
          commit('editProblem', response.data)
        }
      }).catch((error) => {
        commit('setError', error.response.data.errors.name[0])})
    }
  }
}