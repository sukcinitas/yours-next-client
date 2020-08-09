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
  setCount: 0,
  itemCount: 5, // set to whatever you want
  ongoingPlaylist: {
    id: '',
    videoIndex: 0,
    time: 0,
    paused: false,
  },
  userJoined: false,
});

const actions = {
  async SOCKET_setOngoingPlaylist({ commit }, payload) {
    commit('setOngoingPlaylist', {
      id: payload.id,
      videoIndex: payload.videoIndex,
      time: payload.time,
      paused: false,
    });
  },
  async SOCKET_userJoinsOngoingPlaylist({ rootState, commit }) {
    if (rootState.group.member.name === rootState.group.moderator) {
      commit('setUserJoined', { state: true });
    }
  },
  async SOCKET_changeOngoingPlaylistVideoIndex({ commit }, payload) {
    commit('setOngoingPlaylistVideoIndex', { videoIndex: payload.videoIndex });
    commit('setOngoingPlaylistPause', { paused: false });
  },
  async SOCKET_toggleOngoingPlaylist({ commit }, payload) {
    commit('setOngoingPlaylistPause', { paused: payload.paused });
  },
  async SOCKET_updatePlaylist({ commit, state }, payload) {
    if (payload.id !== state.id) {
      return;
    }
    commit('setPlaylist', { items: payload.idsArray });
    if (payload.type === 'addition') {
      if (payload.alreadyIn) {
        const itemsData = [...state.items.filter(item => item.id !== payload.itemData.id),
          payload.itemData];
        commit('setItems', { items: itemsData });
      } else if (state.items.length < state.setCount * state.itemCount) {
        const itemsData = [...state.items, payload.itemData];
        commit('setItems', { items: itemsData });
      }
    }
    if (payload.type === 'deletion') {
      if (state.items.filter(item => item.id === payload.itemData).length === 1) {
        const itemsData = state.items.filter(item => item.id !== payload.itemData);
        if (state.idsArray.length >= state.setCount * state.itemCount) {
          const { data } = await DataService.getVideos(
            state.idsArray[state.setCount * state.itemCOunt]);
          const item = data.data.items[0];
          commit('setItems', { items: [...itemsData, item] });
          return;
        }
        commit('setItems', { items: [...itemsData] });
      }
    }
  },
  async getPlaylist({ commit }, payload) {
    const { data } = await PlaylistService.get(payload.id);
    if (data.success) {
      commit('setPlaylist', { items: data.playlist.items });
      commit('setId', { id: data.playlist._id });
      commit('setTitle', { title: data.playlist.title });
      commit('resetSetCount');
      commit('resetNowPlayingVideoIndex');
      commit('setItems', { items: [] });
      return { success: true };
    }
    return { success: false, errMsg: data.error };
  },
  async getPlaylistData({ commit, state }) {
    if (state.idsArray.length === state.items.length) {
      return { success: true, increaseSetCount: false };
    }
    const idsArrayOfItemCount = (state.idsArray.slice((state.setCount) *
    state.itemCount, (state.setCount + 1) * state.itemCount)).join(',');
    const { data } = await DataService.getVideos(idsArrayOfItemCount);
    if (!data.success) {
      return { success: false, errMsg: 'Could not retrieve playlist data!', increaseSetCount: false };
    }
    const items = data.data.items;
    const itemsData = [...state.items, ...items];
    commit('setItems', { items: itemsData });
    return { success: true, increaseSetCount: true };
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
      const itemData = state.items.filter(item => item.id === payload.item)[0];
      // const itemsData = [...state.items.filter(item => item.id !== payload.item), item];
      // return { success: true, items, itemsData };
      return { success: true, itemData, items, alreadyIn: true, id: state.id };
    }
    const { data } = await PlaylistService.add({ id: state.id, item: payload.item });
    if (!data.success) {
      return { success: false, errMsg: 'Could not add item to playlist!' };
    }
    const items = [...state.idsArray, payload.item];
    const datum = await DataService.getVideos(payload.item);
    const itemData = datum.data.data.items[0];
    // const itemsData = [...state.items, item];
    return { success: true, itemData, items, alreadyIn: false, id: state.id };
  },
  async removeItemFromPlaylist({ state }, payload) {
    const { videoId } = payload;
    const { data } = await PlaylistService.removeItem({ id: state.id, items: [videoId] });
    if (!data.success) {
      return { success: false, errMsg: 'Could not remove item!' };
    }
    const items = state.idsArray.filter(item => item !== videoId);
    return { success: true, items, id: state.id };
  },
};

const mutations = {
  changeNowPlayingVideoIndex(state, index) {
    state.nowPlayingVideoIndex = index;
  },
  resetNowPlayingVideoIndex(state) {
    state.nowPlayingVideoIndex = 0;
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
  setOngoingPlaylistPause(state, payload) {
    state.ongoingPlaylist = Object.assign(
      {}, state.ongoingPlaylist, { paused: payload.paused });
  },
  setOngoingPlaylist(state, payload) {
    state.ongoingPlaylist = payload;
  },
  setOngoingPlaylistVideoIndex(state, payload) {
    state.ongoingPlaylist = Object.assign(
      {}, state.ongoingPlaylist, { videoIndex: payload.videoIndex });
  },
  setUserJoined(state, payload) {
    state.userJoined = payload.state;
  },
  setSetCount(state) {
    state.setCount += 1;
  },
  resetSetCount(state) {
    state.setCount = 0;
  },
};

const getters = {
  isMainAnOngoingPlaylist(state) {
    return state.ongoingPlaylist.id === state.id;
  },
  isOngoingPlaylistPaused(state) {
    return state.ongoingPlaylist.paused;
  },
  isIndexAheadOfData(state) {
    const { itemCount, setCount, nowPlayingVideoIndex, ongoingPlaylist } = state;
    // if I choose video which data is not loaded yet, I load another set
    // index will always be smaller than item counts if sets are not full
    if (ongoingPlaylist.id) {
      if (ongoingPlaylist.index >= itemCount * setCount) {
        return true;
      }
      return false;
    }
    if (nowPlayingVideoIndex >= itemCount * setCount) {
      return true;
    }
    return false;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
