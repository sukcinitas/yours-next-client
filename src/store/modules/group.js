
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
  chosenEmojis: [],
  member: '',
  messages: [],
});

// actions
const actions = {
  async SOCKET_joinmessage(context, payload) {
    // eslint-disable-next-line no-console
    console.log(payload.message);
  },
  async SOCKET_sendMessage({ commit }, payload) {
    commit('setMessage', { message: payload.message });
  },
  async SOCKET_addMember({ commit }, payload) {
    commit('setChosenEmojis', { emoji: payload.emoji });
    commit('setMember', { name: payload.name });
    commit('setActiveMembers', { name: payload.name, emoji: payload.emoji });
  },
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
  setActiveMembers(state, payload) {
    state.activeMembers = [...state.activeMembers, { name: payload.name, emoji: payload.emoji }];
  },
  setChosenEmojis(state, payload) {
    state.setChosenEmojis = state.chosenEmojis.push(payload.emoji);
  },
  setMember(state, payload) {
    state.member = payload.name;
  },
  setMessage(state, payload) {
    state.messages = [...state.messages, { message: payload.message, name: state.member }];
  },
};

// getters
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
