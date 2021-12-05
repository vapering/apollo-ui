
import { fetchList } from '@/api/organizations'

const state = {
  data: ['123']
}

const mutations = {
  refreshOrganizations: (state, data) => {
    state.data = data
  }
}

const actions = {
  refreshOrganizations({ commit }, keyword) {
    fetchList(keyword).then((data) => {
      commit('refreshOrganizations', data)
    })
  },
  refreshOrganizationsWithCallback({ commit }, inputData) {
    fetchList(inputData.keyword).then((data) => {
      commit('refreshOrganizations', data)
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
