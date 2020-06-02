/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */
import GroupService from '../../services/group.service';
import PlaylistService from '../../services/playlist.service';
// initial state
const state = () => ({
  name: '',
  playlists: [],
  activeMembers: [],
  errMsg: '',
});

// actions
const actions = {
  async authenticate({ commit }, payload) {
    const { data } = await GroupService.authenticate(payload);
    if (data.success) {
      commit('setName', { name: payload.name });
    } else {
      commit('setErrorMsg', { error: data.message });
    }
  },
  async createGroup({ commit }, payload) {
    const { data } = await GroupService.create(payload);
    if (data.success) {
      commit('setName', { name: payload.name });
    } else {
      commit('setErrorMsg', { error: data.message });
    }
  },
  async getPlaylists({ state, commit }) {
    const { data } = await PlaylistService.getAll(state.name);
    if (data.success) {
      if (data.playlists.length === 0) {
        commit('setErrorMsg', { error: 'You have not created any playlists yet!' });
        return;
      }
      commit('setPlaylists', { playlists: data.playlists });
    } else {
      commit('setErrorMsg', { error: data.message });
    }
  },
};
// mutations
const mutations = {
  setName(state, payload) {
    state.name = payload.name;
  },
  setErrorMsg(state, payload) {
    state.errMsg = payload.error;
  },
  setPlaylists(state, payload) {
    state.playlists = payload.playlists;
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
