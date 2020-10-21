/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */
import PlaylistService from '../../services/playlist.service';

const state = () => ({
  playlists: [],
});

const actions = {
  async SOCKET_updatePlaylists({ commit }, payload) {
    commit('setPlaylists', { playlists: payload.playlists });
  },
  async getPlaylists({ rootState, commit }) {
    const { data } = await PlaylistService.getAll(rootState.group.name);
    if (data.success) {
      if (data.playlists.length === 0) {
        return { success: false, errMsg: 'You have not created any playlists yet!' };
      }
      commit('setPlaylists', { playlists: data.playlists });
      return { success: true };
    }
    return { success: false, errMsg: data.message };
  },
  async addPlaylist({ rootState, state, dispatch }, payload) {
    dispatch('getPlaylists');
    const { data } = await PlaylistService.post({
      title: payload.title,
      createdBy: rootState.group.name,
    });
    if (data.success) {
      const playlists = [...state.playlists, data.playlist];
      this._vm.$socket.emit('updatePlaylists', { playlists });
      return { success: true, successMsg: data.message, playlists, id: data.playlist._id };
    }
    return { success: false, errMsg: data.message };
  },
  async deletePlaylist({ state }, payload) {
    const { data } = await PlaylistService.delete(payload.id);
    if (data.success) {
      const playlists = state.playlists.filter(playlist => playlist._id !== payload.id);
      return { success: true, successMsg: 'Playlist has been successfully deleted!', playlists };
    }
    return { success: false, errMsg: 'Could not delete playlist!' };
  },
};

const mutations = {
  setPlaylists(state, payload) {
    state.playlists = payload.playlists;
  },
};

const getters = {
  playlistsTitles(state) {
    return state.playlists.map(playlist => (playlist.title).toLowerCase());
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
