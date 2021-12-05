const state = {
  itemCreateShow: false
}

const mutations = {
  commitItemCreateShow: (state, itemCreateShow) => {
    state.itemCreateShow = itemCreateShow
  }
}

const actions = {
  commitItemCreateShow({ commit }, itemCreateShowStatus) {
    commit('commitItemCreateShow', itemCreateShowStatus)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
