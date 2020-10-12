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
    statisticQuantitativeIndicators: [],
    statisticCategories: [],
    statisticQuarterly1: [],
    statisticQuarterly2: [],
    statisticQuarterly3: [],
    statisticQuarterly4: [],
    totalAmountOfProblems: '',
    totalAmountOfSolved: ''
  },

  getters: {
    totalAmountOfSolved: state => {
      return state.totalAmountOfSolved
    },
    totalAmountOfProblems: state => {
      return state.totalAmountOfProblems
    },

    statisticQuantitativeIndicators: state => {
      return state.statisticQuantitativeIndicators
    },
    statisticCategories: state => {
      return state.statisticCategories
    },
    statisticQuarterly1: state => {
      return state.statisticQuarterly1
    },
    statisticQuarterly2: state => {
      return state.statisticQuarterly2
    },
    statisticQuarterly3: state => {
      return state.statisticQuarterly3
    },
    statisticQuarterly4: state => {
      return state.statisticQuarterly4
    },
  },

  mutations: {
    totalAmountOfSolved: (state, payload) => {
      state.totalAmountOfSolved = payload
    },
    totalAmountOfProblems: (state, payload) => {
      state.totalAmountOfProblems = payload
    },

    statisticQuantitativeIndicators: (state, payload) => {
      state.statisticQuantitativeIndicators = payload
    },
    statisticCategories: (state, payload) => {
      console.log(payload, 'ddd');
      state.statisticCategories = payload
    },
    statisticQuarterly1: (state, payload) => {
      state.statisticQuarterly1 = payload
    },
    statisticQuarterly2: (state, payload) => {
      state.statisticQuarterly2 = payload
    },
    statisticQuarterly3: (state, payload) => {
      state.statisticQuarterly3 = payload
    },
    statisticQuarterly4: (state, payload) => {
      state.statisticQuarterly4 = payload
    }
  },

  actions: {
    getStatisticQuantitativeIndicators: async ({
      commit
    }) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/statistic/quantitative-indicators').then(response => {
            commit('setError404', '')
            commit('statisticQuantitativeIndicators', response.data)
            commit('totalAmountOfProblems', Object.entries(response.data)[0][1])
            commit('totalAmountOfSolved', Object.entries(response.data)[1][1])
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error.response);
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          })
      })
    },

    getStatisticCategories: async ({
      commit
    }) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/statistic/categories	').then(response => {
            commit('setError404', '')
            // commit('statisticCategories', response.data)
            commit('statisticCategories', Object.entries(response.data))
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error.response);
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          })
      })
    },


    getStatisticQuarterly: async ({
      commit
    }) => {
      return new Promise((resolve, reject) => {
        axios.get(process.env.VUE_APP_ROOT_URL + '/problem/statistic/quarterly').then(response => {
            commit('setError404', '')
            commit('statisticQuarterly1', response.data[3])
            commit('statisticQuarterly2', response.data[2])
            commit('statisticQuarterly3', response.data[1])
            commit('statisticQuarterly4', response.data[0])
            console.log(response.data);
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error.response);
            commit('setError404', error.response.data.error)
            reject(error.response.data.error)
          })
      })
    }
  }
}