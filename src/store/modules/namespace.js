
import { get } from '@/api/namepace'

const state = {
  data: []
}

const mutations = {
  get: (state, data) => {
    state.data = data
  }
}

const actions = {
  get({ commit }) {
    get().then((data) => {
      commit('get', data)
    })
  },
  getWithCallback({ commit }, inputData) {
    get(inputData.query).then((data) => {
      commit('get', data)
      if (inputData.callback) {
        inputData.callback(data)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
