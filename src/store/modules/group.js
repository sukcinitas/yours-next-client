/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */
import GroupService from '../../services/group.service';
// initial state
const state = () => ({
  name: '',
  activeMembers: [],
  member: '',
  messages: [],
  moderator: '',
  initialEmojis: [0x1F429, 0x1F408, 0x1F98E,
    0x1F98A, 0x1F43A, 0x1F344, 0x1F346, 0x1F469, 0x2600, 0x1F987],
  messageEmojis: ['😀', '😍', '🤣'],
  isChatTurnedOff: false,
});

// actions
const actions = {
  async authenticate({ commit }, payload) {
    const { data } = await GroupService.authenticate(payload);
    if (data.success) {
      commit('setName', { name: payload.name });
      return { success: true };
    }
    return { success: false, errMsg: data.message };
  },
  async createGroup({ commit }, payload) {
    const { data } = await GroupService.create(payload);
    if (data.success) {
      commit('setName', { name: payload.name });
      return { success: true };
    }
    return { success: false, errMsg: data.message };
  },
  async SOCKET_setInitialState({ commit }, payload) {
    commit('setInitialState', payload.group);
  },
  async SOCKET_setModerator({ commit }, payload) {
    commit('setModerator', { name: payload.name });
  },
  async SOCKET_addMember({ commit }, payload) {
    commit('setActiveMembers', { name: payload.name, emoji: payload.emoji });
  },
  async SOCKET_setMember({ commit }, payload) { // only to this socket
    commit('setMember', { name: payload.name, emoji: payload.emoji });
  },
  async SOCKET_removeMember({ commit }, payload) {
    commit('removeMember', { name: payload.client });
  },
  async SOCKET_sendMessage({ commit }, payload) {
    commit('setMessage', { message: payload.message, member: payload.member });
  },
};
// mutations
const mutations = {
  setName(state, payload) {
    state.name = payload.name;
  },
  setModerator(state, payload) {
    state.moderator = payload.name;
  },
  setActiveMembers(state, payload) {
    state.activeMembers = [...state.activeMembers, { name: payload.name, emoji: payload.emoji }];
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
  setInitialState(state, payload) {
    state.activeMembers = payload.activeMembers;
    state.chosenEmojis = payload.chosenEmojis;
    state.messages = payload.messages;
    state.moderator = payload.moderator;
    state.ongoingPlaylist = payload.ongoingPlaylist;
  },
  setChatState(state, payload) {
    state.isChatTurnedOff = payload.state;
  },
};

// getters
const getters = {
  activeMembersNames(state) {
    return state.activeMembers.map(member => member.name);
  },
  isModerator(state) {
    return state.moderator === state.member.name;
  },
  moderatorEmoji(state) {
    if (state.member && state.moderator === state.member.name) {
      return 'you';
    }
    const moderator = state.activeMembers.filter(member => member.name === state.moderator);
    return moderator.length === 0 ? '' : moderator[0].emoji;
  },
  emojisFreeToSet(state) {
    const chosenEmojis = state.activeMembers.map(member => member.emoji);
    const filtered = [];
    for (let i = 0; i < state.initialEmojis.length; i += 1) {
      if (!chosenEmojis.includes(state.initialEmojis[i])) {
        filtered.push(state.initialEmojis[i]);
      }
    }
    return filtered;
  },
  chatState(state) {
    return state.isChatTurnedOff;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
