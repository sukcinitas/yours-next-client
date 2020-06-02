import PlaylistService from '../../services/playlist.service';
/* eslint-disable no-shadow */
// initial state
const state = () => ({
  idsArray: [],
  nowPlayingVideoIndex: 0,
  errMsg: '',
});

// actions
const actions = {
  async getPlaylist({ commit, state }, payload) {
    const { data } = await PlaylistService.get(payload.id);
    if (data.success) {
      commit('setPlaylist', { items: data.playlist.items });
      state.idsArray = data.playlist.items;
    } else {
      commit('setErrorMsg', { error: data.error });
    }
  },
};

// mutations
const mutations = {
  changeNowPlayingVideoIndex(state, index) {
    state.nowPlayingVideoIndex = index;
  },
  addId(state, videoId) {
    if (state.idsArray.includes(videoId)) {
      return;
    }
    state.idsArray.push(videoId);
  },
  setPlaylist(state, payload) {
    state.idsArray = payload.items;
  },
  setErrorMsg(state, payload) {
    state.errMsg = payload.error;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
