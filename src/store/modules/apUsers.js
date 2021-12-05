
import { fetchList } from '@/api/apUsers'

const state = {
  data: []
}

const mutations = {
  refreshData: (state, data) => {
    state.data = data
  }
}

const actions = {
  refreshData({ commit }, keyword) {
    fetchList(keyword).then((data) => {
      commit('refreshData', data)
    })
  },
  refreshDataWithCallback({ commit }, inputData) {
    fetchList(inputData.keyword).then((data) => {
      commit('refreshData', data)
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
