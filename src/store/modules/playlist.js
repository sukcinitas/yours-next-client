/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */
import PlaylistService from '../../services/playlist.service';
// initial state
const state = () => ({
  successMsg: '',
  errMsg: '',
  id: '',
});

// actions
const actions = {
  async addPlaylist({ commit, rootState }, payload) {
    const { data } = await PlaylistService.post({
      title: payload.title,
      createdBy: rootState.group.name,
    });
    if (data.success) {
      commit('setSuccessMsg', { message: data.message });
      // eslint-disable-next-line no-underscore-dangle
      commit('setId', { id: data.playlist._id });
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
  setId(state, payload) {
    state.id = payload.id;
  },
};

// getters
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
