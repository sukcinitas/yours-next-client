/* eslint-disable no-underscore-dangle */
import PlaylistService from '../../services/playlist.service';
import DataService from '../../services/data.service';
/* eslint-disable no-shadow */
const state = () => ({
  idsArray: [],
  nowPlayingVideoIndex: 0,
  id: '',
  title: '',
  items: [],
  ongoingPlaylist: {
    id: '',
    videoIndex: 0,
    time: 0,
    paused: false,
    playing: true,
  },
});

const actions = {
  async SOCKET_setOngoingPlaylist({ commit, state }, payload) {
    commit('setOngoingPlaylist', {
      id: payload.id,
      videoIndex: payload.videoIndex || state.ongoingPlaylist.videoIndex,
      time: payload.time || state.ongoingPlaylist.time,
    });
  },
  async SOCKET_changeOngoingPlaylistVideoIndex({ commit }, payload) {
    commit('setOngoingPlaylistVideoIndex', { videoIndex: payload.videoIndex });
  },
  async SOCKET_pauseOngoingPlaylist({ commit }) {
    commit('setOngoingPlaylistPause');
  },
  async SOCKET_playOngoingPlaylist({ commit }) {
    commit('setOngoingPlaylistPlay');
  },
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
      commit('setId', { id: data.playlist._id });
      commit('setTitle', { title: data.playlist.title });
      return { success: true };
    }
    return { success: false, errMsg: data.error };
  },
  async getPlaylistData({ commit, state }) {
    const { data } = await DataService.getVideos(state.idsArray.join(','));
    if (!data.success) {
      return { success: false, errMsg: 'Could not retrieve playlist data!' };
    }
    const items = data.data.items;
    commit('setItems', { items });
    return { success: true };
  },
  async addItemToPlaylist({ state }, payload) {
    // if video is already in playlist, just move it to the end
    if (state.idsArray.indexOf(payload.item) > -1) {
      await PlaylistService.removeItem({ id: state.id, items: [payload.item] });
      const { data } = await PlaylistService.add({ id: state.id, item: payload.item });
      if (!data.success) {
        return { success: false, errMsg: 'Could not add item to playlist!' };
      }
      const index = state.idsArray.indexOf(payload.item);
      const items = [...state.idsArray.slice(0, index),
        ...state.idsArray.slice(index + 1), payload.item];
      const item = state.items.filter(item => item.id === payload.item)[0];
      const itemsData = [...state.items.filter(item => item.id !== payload.item), item];
      return { success: true, items, itemsData };
    }
    const { data } = await PlaylistService.add({ id: state.id, item: payload.item });
    if (!data.success) {
      return { success: false, errMsg: 'Could not add item to playlist!' };
    }
    const items = [...state.idsArray, payload.item];
    const datum = await DataService.getVideos(payload.item);
    const item = datum.data.data.items[0];
    const itemsData = [...state.items, item];
    return { success: true, items, itemsData };
  },
  async removeItemFromPlaylist({ state }, payload) {
    const { videoId } = payload;
    const { data } = await PlaylistService.removeItem({ id: state.id, items: [videoId] });
    if (!data.success) {
      return { success: false, errMsg: 'Could not remove item!' };
    }
    const items = state.idsArray.filter(item => item !== videoId);
    const itemsData = state.items.filter(item => item.id !== videoId);
    return { success: true, items, itemsData };
  },
};

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
  setId(state, payload) {
    state.id = payload.id;
  },
  setTitle(state, payload) {
    state.title = payload.title;
  },
  setOngoingPlaylistPause(state) {
    state.ongoingPlaylist = Object.assign(
      {}, state.ongoingPlaylist, { paused: true, playing: false });
  },
  setOngoingPlaylistPlay(state) {
    state.ongoingPlaylist = Object.assign(
      {}, state.ongoingPlaylist, { paused: false, playing: true });
  },
  setOngoingPlaylist(state, payload) {
    state.ongoingPlaylist = payload;
  },
  setOngoingPlaylistVideoIndex(state, payload) {
    state.ongoingPlaylist.videoIndex = payload.videoIndex;
  },
};

const getters = {
  isMainAnOngoingPlaylist(state) {
    return state.ongoingPlaylist.id === state.id;
  },
  isOngoingPlaylistPaused(state) {
    return state.ongoingPlaylist.paused;
  },
  isOngoingPlaylistPlaying(state) {
    return state.ongoingPlaylist.playing;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
