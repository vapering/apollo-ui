
import { get, getNavtree } from '@/api/envs'

const state = {
  data: [],
  envData: {},
  clusters: []
}

const mutations = {
  get: (state, data) => {
    state.data = data
  },
  refreshEnvData: (state, data) => {
    state.envData = data
  },
  commitClusters: (state, data) => {
    state.clusters = data
  }
}

const actions = {
  get({ commit }) {
    get().then((data) => {
      commit('get', data)
    })
  },
  getWithCallback({ commit }, inputData) {
    get().then((data) => {
      commit('get', data)
      if (inputData.callback) {
        inputData.callback(data)
      }
    })
  },
  refreshEnvData({ commit }, inputData) {
    getNavtree(inputData.appId).then((data) => {
      if (data.code === 200) {
        var envData = {}
        var clusters = []
        data.entities.forEach(entity => {
          if (entity.code === 200) {
            envData[entity.body.env] = entity.body.clusters
            entity.body.clusters.forEach((cluster) => {
              clusters.push({
                ...cluster,
                env: entity.body.env
              })
            })
          }
        })
      }
      commit('refreshEnvData', envData)
      commit('commitClusters', clusters)
      if (inputData.callback) {
        inputData.callback(envData)
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
