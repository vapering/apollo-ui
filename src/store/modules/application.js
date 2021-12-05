
import { get } from '@/api/application'
import { create } from '@/api/application'

const state = {
  data: [],
  pageSize: 10,
  size: 0,
  currentApplication: {}
}

const mutations = {
  refreshData: (state, data) => {
    state.data = data
  },
  selectApplication: (state, appData) => {
    state.currentApplication = appData
  }
}

const actions = {
  refreshData({ commit }, input) {
    get(input).then((data) => {
      commit('refreshData', data)
    })
  },
  createApplication({ commit }, inputData) {
    create(inputData).then((data) => {
    })
  },
  selectApplication({ commit }, appData) {
    commit('selectApplication', appData)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
