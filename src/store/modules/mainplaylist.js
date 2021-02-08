/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import PlaylistService from '../../services/playlist.service';
import DataService from '../../services/data.service';
import checkIfAuthorizationError from '../../util/checkIfAuthorizationError';

// initial state
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
  SOCKET_setOngoingPlaylist({ commit }, payload) {
    commit('setOngoingPlaylist', {
      id: payload.id,
      videoIndex: payload.videoIndex,
      time: payload.time,
      paused: false,
    });
    if (!payload.id && (/mainplaylist/).test(window.location.hash)) {
      window.history.back();
    }
  },

  SOCKET_userJoinsOngoingPlaylist({ rootState, commit }) {
    if (rootState.group.member.name === rootState.group.moderator) {
      commit('setUserJoined', { state: true });
    }
  },

  SOCKET_changeOngoingPlaylistVideoIndex({ commit }, payload) {
    commit('setOngoingPlaylistVideoIndex', { videoIndex: payload.videoIndex });
    commit('setOngoingPlaylistPause', { paused: false });
  },

  SOCKET_toggleOngoingPlaylist({ commit }, payload) {
    commit('setOngoingPlaylistPause', { paused: payload.paused });
  },

  async SOCKET_updatePlaylist({ commit, state, rootState }, payload) {
    if (payload.type === 'addition') {
      if (state.items.length < state.setCount * state.itemCount) {
        const itemsData = [...state.items, payload.itemData];
        commit('setPlaylist', { items: payload.idsArray });
        commit('setItems', { items: itemsData });
      } else {
        commit('setPlaylist', { items: payload.idsArray });
      }
    }
    if (payload.type === 'deletion') {
      // if it is a moderator, no need to change index, as it has already been changed
      const needToChangeIndex =
        rootState.group.member.name !== rootState.group.moderator &&
        state.nowPlayingVideoIndex > state.idsArray.indexOf(payload.itemData);
      const index = needToChangeIndex
        ? state.nowPlayingVideoIndex - 1
        : state.nowPlayingVideoIndex;
      const items = payload.idsArray;
      const itemsPreData = state.items.filter(
        item => item.id !== payload.itemData,
      );
      let itemsData;
      // if I have loaded certain sets, I don't hide them;
      // though if set lacks one item, I load it from another set
      if (items.length >= state.setCount * state.itemCount) {
        const { data } = await DataService.getVideos(
          state.idsArray[state.setCount * state.itemCount],
        );
        const item = data.data.items[0];
        itemsData = [...itemsPreData, item];
      } else {
        itemsData = itemsPreData;
      }
      commit('setIdsItemsIndex', { items, itemsData, index });
    }
  },

  async getPlaylist({ commit }, payload) {
    try {
      const { data: { playlist: { items, _id, title } } } = await PlaylistService.get(payload.id);
      commit('setPlaylist', { items });
      commit('setId', { _id });
      commit('setTitle', { title });
      commit('resetSetCount');
      commit('resetNowPlayingVideoIndex');
      commit('setItems', { items: [] });
    } catch (err) {
      checkIfAuthorizationError(err);
      throw err;
    }
  },

  async getPlaylistData({ commit, state }) {
    try {
      if (state.idsArray.length === state.items.length) {
        return { increaseSetCount: false };
      }
      const idsArrayOfItemCount = state.idsArray
        .slice(
          state.setCount * state.itemCount,
          (state.setCount + 1) * state.itemCount,
        )
        .join(',');
      const { data: { data: { items } } } = await DataService.getVideos(idsArrayOfItemCount);
      const itemsData = [...state.items, ...items];
      commit('setItems', { items: itemsData });
      return { increaseSetCount: true }; // first time from 0 to 1
    } catch (err) {
      checkIfAuthorizationError(err);
      throw err;
    }
  },

  async addItemToPlaylist({ state }, payload) {
    try {
      // await dispatch('getPlaylist', { id: payload.id }); get in search component
      if (state.idsArray.indexOf(payload.item) > -1) {
        throw new Error('Item is already in the playlist!');
      }
      await PlaylistService.add({
        id: payload.id,
        item: payload.item,
      });
      console.log(state, 'state inside add');
      const items = [...state.idsArray, payload.item];
      const datum = await DataService.getVideos(payload.item);
      const itemData = datum.data.data.items[0];
      this._vm.$socket.emit('updatePlaylist', {
        idsArray: items,
        itemData,
        type: 'addition',
        alreadyIn: false,
        id: payload.id,
      });
      return { successMsg: 'Successfully added!' };
    } catch (err) {
      checkIfAuthorizationError(err);
      throw err;
    }
  },

  async removeItemFromPlaylist({ state }, { videoId, id }) {
    try {
      await PlaylistService.removeItem({
        id,
        items: [videoId],
      });
      const items = state.idsArray.filter(item => item !== videoId);
      return { items };
    } catch (err) {
      checkIfAuthorizationError(err);
      throw new Error('Could not remove item!');
    }
  },
};

// mutations
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
  setIdsItemsIndex(state, payload) {
    state.idsArray = payload.items;
    state.items = payload.itemsData;
    state.nowPlayingVideoIndex = payload.index;
  },
  setId(state, payload) {
    state.id = payload.id;
  },
  setTitle(state, payload) {
    state.title = payload.title;
  },
  setOngoingPlaylistPause(state, payload) {
    state.ongoingPlaylist = Object.assign({}, state.ongoingPlaylist, {
      paused: payload.paused,
    });
  },
  setOngoingPlaylist(state, payload) {
    state.ongoingPlaylist = payload;
  },
  setOngoingPlaylistVideoIndex(state, payload) {
    state.ongoingPlaylist = Object.assign({}, state.ongoingPlaylist, {
      videoIndex: payload.videoIndex,
    });
  },
  setUserJoined(state, payload) {
    state.userJoined = payload.state;
  },
  setSetCount(state) {
    state.setCount += 1;
  },
  makeSetCount(state, set) {
    state.setCount = set;
  },
  resetSetCount(state) {
    state.setCount = 0;
  },
};

// getters
const getters = {
  playlist(state) {
    return state.idsArray;
  },
  items(state) {
    return state.items;
  },
  length(state) {
    return state.items.length;
  },
  title(state) {
    return state.title;
  },
  ongoingPlaylist(state) {
    return state.ongoingPlaylist;
  },
  nowPlayingVideoIndex(state) {
    return state.nowPlayingVideoIndex;
  },
  isMainAnOngoingPlaylist(state) {
    return state.ongoingPlaylist.id === state.id;
  },
  isOngoingPlaylistPaused(state) {
    return state.ongoingPlaylist.paused;
  },
  isIndexAheadOfData(state) {
    const {
      itemCount,
      setCount,
      nowPlayingVideoIndex,
      ongoingPlaylist,
    } = state;
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
