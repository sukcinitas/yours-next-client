/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */
import PlaylistService from '../../services/playlist.service';
// initial state
const state = () => ({
  successMsg: '',
  errMsg: '',
});

// actions
const actions = {
  async addPlaylist({ commit, rootState }, payload) {
    const { data } = await PlaylistService.post({
      title: payload.title,
      createdBy: rootState.group.name,
    });
    // eslint-disable-next-line no-console
    console.log(data);
    if (data.success) {
      commit('setSuccessMsg', { message: data.message });
    } else {
      commit('setErrorMsg', { error: data.error });
    }
  },
};
// mutations
const mutations = {
  setErrorMsg(state, payload) {
    state.errMsg = payload.error;
  },
  setSuccessMsg(state, payload) {
    state.successMsg = payload.message;
  },
};

// getters
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
