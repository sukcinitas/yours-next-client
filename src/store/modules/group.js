
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
  member: null,
  messages: [],
});

// actions
const actions = {
  async SOCKET_joinmessage(context, payload) {
    // eslint-disable-next-line no-console
    console.log(payload.message);
  },
  async SOCKET_setInitialState({ commit }, payload) {
    commit('setInitialState', payload.group);
  },
  async SOCKET_sendMessage({ commit }, payload) {
    commit('setMessage', { message: payload.message, member: payload.member });
  },
  async SOCKET_addMember({ commit }, payload) {
    commit('setChosenEmojis', { emoji: payload.emoji });
    commit('setActiveMembers', { name: payload.name, emoji: payload.emoji });
  },
  // only to this socket
  async SOCKET_setMember({ commit }, payload) {
    commit('setMember', { name: payload.name, emoji: payload.emoji });
  },
  async SOCKET_removeMember({ commit }, payload) {
    commit('removeMember', { name: payload.client });
    commit('removeFromChosenEmojis', { emoji: payload.emoji });
  },
  async SOCKET_updatePlaylists({ dispatch }) {
    dispatch('getPlaylists');
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
    state.member = payload;
  },
  setMessage(state, payload) {
    state.messages = [...state.messages, { message: payload.message, name: payload.member }];
  },
  removeMember(state, payload) {
    state.activeMembers = state.activeMembers.filter(member => member.name !== payload.name);
  },
  removeFromChosenEmojis(state, payload) {
    state.chosenEmojis = state.chosenEmojis.filter(emoji => emoji !== payload.emoji);
  },
  setInitialState(state, payload) {
    state.activeMembers = payload.activeMembers;
    state.chosenEmojis = payload.chosenEmojis;
    state.messages = payload.messages;
  },
};

// getters
const getters = {
  activeMembersNames(state) {
    return state.activeMembers.map(member => member.name);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
