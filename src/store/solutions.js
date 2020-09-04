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
    // error: '',
    // error404: '',
    token: localStorage.getItem('user-token') || '',
  },
  getters: {
      // сортировка по дате!!!!
    solutions: state => {
      return state.solutions = state.solutions.sort(function (a, b) {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1})
    },
    //??
    // error: state => {
    //   return state.error
    // },
    // error404: state => {
    //   return state.error404
    // }
  },
  mutations: {
    setSolution: (state, payload) => {
      state.solutions = payload
    },
    addSolution: (state, payload) => {
      state.solutions.push(payload)
    },
    deleteSolution: (state, payload) => {
        state.solutions = state.solutions.filter(solution => solution.id !== payload)
    },
    editSolution: (state, payload) => {
        state.solutions.find(solution => solution.id == payload.id).name = payload.name
    },

    // setError: (state, payload) => {
    //   state.error = payload
    // },
    // setError404: (state, payload) => {
    //   state.error404 = payload
    // },
    
  },
  actions: {
    getsolutions: async ({commit}, problemId) => {
      await axios.get(BASEURL + `/${problemId}`)
        .then(response => {
            if (response.status == 200) {
              commit('setError', '')
              commit('setsolutions', response.data) 
            }
          })
        .catch(error => 
          commit('setError', error.response.data.message)
        )
    },
    postSolution: async ({commit}, param) => {
        //////////
      await axios.post(BASEURL, param)
      .then(response => {
        if (response.status == 201) {
          commit('setError', '')
          commit('addProblem', response.data)
        }
        })
      .catch(error => commit('setError', error.response.data.errors.name[0]))

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