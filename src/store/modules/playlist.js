/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */
import PlaylistService from '../../services/playlist.service';
import GroupService from '../../services/group.service';
import checkIfAuthorizationError from '../../util/checkIfAuthorizationError';

const state = () => ({
  playlists: [],
});

const actions = {
  SOCKET_updatePlaylists({ commit }, { playlists }) {
    commit('setPlaylists', { playlists });
  },

  async getPlaylists({ commit }) {
    try {
      const { data: { group } } = await GroupService.isLoggedIn();
      const { data: { playlists } } = await PlaylistService.getAll(group);
      commit('setPlaylists', { playlists });
    } catch (err) {
      checkIfAuthorizationError(err);
      throw err;
    }
  },

  async addPlaylist({ rootState, state }, { title }) {
    try {
      const { data } = await PlaylistService.post({
        title,
        createdBy: rootState.group.name,
      });
      if (data.success) {
        const playlists = [...state.playlists, data.playlist];
        this._vm.$socket.emit('updatePlaylists', { playlists });
        return {
          success: true,
          successMsg: data.message,
          playlists,
          id: data.playlist._id,
        };
      }
      return { success: false };
    } catch (err) {
      checkIfAuthorizationError(err);
      throw err;
    }
  },

  async deletePlaylist({ state }, payload) {
    try {
      await PlaylistService.delete(payload.id);
      const playlists = state.playlists.filter(
        playlist => playlist._id !== payload.id,
      );
      return {
        playlists,
      };
    } catch (err) {
      checkIfAuthorizationError(err);
      throw err;
    }
  },
};

const mutations = {
  setPlaylists(state, payload) {
    state.playlists = payload.playlists;
  },
};

const getters = {
  playlists(state) {
    return state.playlists;
  },

  playlistsTitles(state) {
    return state.playlists.map(playlist => playlist.title.toLowerCase());
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
