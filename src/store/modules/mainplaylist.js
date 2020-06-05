import PlaylistService from '../../services/playlist.service';
/* eslint-disable no-shadow */
// initial state
const state = () => ({
  idsArray: [],
  nowPlayingVideoIndex: 0,
  errMsg: '',
  id: '',
  pendingRemovalList: [],
});

// actions
const actions = {
  async getPlaylist({ commit }, payload) {
    const { data } = await PlaylistService.get(payload.id);
    if (data.success) {
      commit('setPlaylist', { items: data.playlist.items });
      commit('setId', { id: payload.id });
    } else {
      commit('setErrorMsg', { error: data.error });
    }
  },
  async addItemToPlaylist({ commit, state }, payload) {
    const { data } = await PlaylistService.add({ id: state.id, item: payload.item });
    if (!data.success) {
      commit('setErrorMsg', { error: data.error });
    }
  },
  async removeItemsFromPlaylist({ commit, state }) {
    await PlaylistService.removeItem({ id: state.id, items: state.pendingRemovalList });
    const { data } = await PlaylistService.get(state.id);
    if (data.success) {
      const videoId = state.idsArray[state.nowPlayingVideoIndex];
      let index = data.playlist.items.indexOf(videoId);
      if (index === -1) {
        index = state.nowPlayingVideoIndex;
      }
      commit('changeNowPlayingVideoIndex', index);
      commit('setPlaylist', { items: data.playlist.items });
      commit('setId', { id: state.id });
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
  setPlaylist(state, payload) {
    state.idsArray = payload.items;
  },
  setErrorMsg(state, payload) {
    state.errMsg = payload.error;
  },
  setId(state, payload) {
    state.id = payload.id;
  },
  addItemToPendingRemovalList(state, payload) {
    state.pendingRemovalList = [...state.pendingRemovalList, payload.item];
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
