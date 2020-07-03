import PlaylistService from '../../services/playlist.service';
import DataService from '../../services/data.service';
/* eslint-disable no-shadow */
// initial state
const state = () => ({
  idsArray: [],
  nowPlayingVideoIndex: 0,
  errMsg: '',
  id: '',
  pendingRemovalList: [],
  items: [],
});

// actions
const actions = {
  async SOCKET_updatePlaylist({ commit }, payload) {
    commit('setPlaylist', { items: payload.idsArray });
    commit('setItems', { items: payload.items });
  },
  async SOCKET_addItemToPendingRemovalList({ commit }, payload) {
    commit('addItemToPendingRemovalList', { item: payload.item });
  },
  async getPlaylist({ commit }, payload) {
    const { data } = await PlaylistService.get(payload.id);
    if (data.success) {
      commit('setPlaylist', { items: data.playlist.items });
      commit('setId', { id: payload.id });
      return { success: true };
    }
    return { success: false, errMsg: data.error };
  },
  async getPlaylistData({ commit, state }) {
    const { data } = await DataService.getVideos(state.idsArray.join(','));
    const items = data.data.items;
    commit('setItems', { items });
  },
  async addItemToPlaylist({ commit, state }, payload) {
    // if video is already in playlist, just move it to the end
    if (state.idsArray.indexOf(payload.item) > -1) {
      await PlaylistService.removeItem({ id: state.id, items: [payload.item] });
      const { data } = await PlaylistService.add({ id: state.id, item: payload.item });
      if (!data.success) {
        commit('setErrorMsg', { error: data.error });
        return {};
      }
      const index = state.idsArray.indexOf(payload.item);
      const items = [...state.idsArray.slice(0, index),
        ...state.idsArray.slice(index + 1), payload.item];
      const item = state.items.filter(item => item.id === payload.item)[0];
      const itemsData = [...state.items.filter(item => item.id !== payload.item), item];
      return { items, itemsData };
    }
    const { data } = await PlaylistService.add({ id: state.id, item: payload.item });
    if (!data.success) {
      commit('setErrorMsg', { error: data.error });
      return {};
    }
    const items = [...state.idsArray, payload.item];
    const datum = await DataService.getVideos(payload.item);
    const item = datum.data.data.items[0];
    const itemsData = [...state.items, item];
    return { items, itemsData };
  },
  async removeItemsFromPlaylist({ commit, state }) {
    if (state.pendingRemovalList.length === 0) {
      return;
    }
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
  setItems(state, payload) {
    state.items = payload.items;
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
