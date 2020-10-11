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
    statisticQuarterly: [],
  },

  getters: {
    statisticQuantitativeIndicators: state => {
      return state.statisticQuantitativeIndicators
    },
    statisticCategories: state => {
      return state.statisticCategories
    },
    statisticQuarterly: state => {
      return state.statisticQuarterly
    }
  },

  mutations: {
    statisticQuantitativeIndicators: (state, payload) => {
      state.statisticQuantitativeIndicators = payload
    },
    statisticCategories: (state, payload) => {
      state.statisticCategories = payload
    },
    statisticQuarterly: (state, payload) => {
      state.statisticQuarterly = payload
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
            console.log(response.data);
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
            commit('statisticCategories', response.data)
            console.log(response.data);
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
            commit('statisticQuarterly', response.data)
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