/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */
import vue from '../../main';
import GroupService from '../../services/group.service';
// initial state
const state = () => ({
  name: '',
  activeMembers: [],
  member: {
    name: '',
    emoji: '',
  },
  messages: [],
  moderator: '',
  initialEmojis: [
    0x1f429,
    0x1f408,
    0x1f98e,
    0x1f98a,
    0x1f43a,
    0x1f344,
    0x1f346,
    0x1f469,
    0x2600,
    0x1f987,
    0x1f419,
    0x1f483,
    0x1f984,
    0x1f996,
    0x1f478,
    0x1f409,
    0x1f988,
    0x1f985,
    0x1f415,
    0x1f9dc,
  ],
  messageEmojis: ['😀', '😍', '🤣', '🍕', '👿', '🤘', '😑', '🌈'],
  isChatTurnedOn: false,
});

const persist = async (commit) => {
  const name = sessionStorage.getItem('groupName');
  const username = sessionStorage.getItem('username');
  const userEmoji = sessionStorage.getItem('userEmoji');
  if (!name || !username || !userEmoji) {
    return;
  }
  commit('setName', { name });
  vue.$socket.emit('getInitialState', { name });
  vue.$socket.emit('setMember', { name: username, emoji: userEmoji }); // only this socket
  commit('setMember', { name: username, emoji: userEmoji });
  vue.$socket.emit('addMember', { name: username, emoji: userEmoji });
};
// actions
const actions = {
  async authenticate({ commit }, payload) {
    const { data } = await GroupService.authenticate(payload);
    if (data.success) {
      commit('setName', { name: payload.name });
      sessionStorage.setItem('groupName', payload.name);
      return { success: true };
    }
    let errType = 'else';
    if (data.message === 'Passcode is incorrect!') {
      errType = 'passcode';
    } else if (data.message === 'Group with this name is not found!') {
      errType = 'name';
    }
    return { success: false, errMsg: data.message, errType };
  },
  async createGroup({ commit }, payload) {
    const { data } = await GroupService.create(payload);
    if (data.success) {
      commit('setName', { name: payload.name });
      sessionStorage.setItem('groupName', payload.name);
      return { success: true };
    }
    const errType =
      data.message === 'Name is already in use!' ? 'name' : 'else';
    return { success: false, errMsg: data.message, errType };
  },
  resetState({ commit }) {
    sessionStorage.clear();
    vue.$socket.disconnect();
    commit('resetState');
  },
  async SOCKET_connect({ commit }) {
    persist(commit);
  },
  async SOCKET_reconnecting({ commit }) {
    persist(commit);
  },
  async SOCKET_setInitialState({ commit }, payload) {
    commit('setInitialState', payload.group);
    commit('mainplaylist/setOngoingPlaylist', payload.group.ongoingPlaylist, {
      root: true,
    });
  },
  async SOCKET_setModerator({ commit }, payload) {
    commit('setModerator', { name: payload.name });
  },
  async SOCKET_addMember({ commit }, payload) {
    commit('setActiveMembers', { name: payload.name, emoji: payload.emoji });
  },
  async SOCKET_setMember({ commit }, payload) {
    // only to this socket
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
    state.activeMembers = [
      ...state.activeMembers,
      { name: payload.name, emoji: payload.emoji },
    ];
  },
  setMember(state, payload) {
    state.member = payload;
  },
  setMessage(state, payload) {
    state.messages = [
      ...state.messages,
      { message: payload.message, member: payload.member },
    ];
  },
  removeMember(state, payload) {
    state.activeMembers = state.activeMembers.filter(
      member => member.name !== payload.name,
    );
  },
  setInitialState(state, payload) {
    state.activeMembers = payload.activeMembers;
    state.messages = payload.messages;
    state.moderator = payload.moderator;
  },
  resetState(state) {
    state.activeMembers = [];
    state.name = '';
    state.member = {
      name: '',
      emoji: '',
    };
    state.messages = '';
    state.moderator = '';
    state.isChatTurnedOf = false;
  },
  setChatState(state, payload) {
    state.isChatTurnedOn = payload.state;
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
    const moderator = state.activeMembers.filter(
      member => member.name === state.moderator,
    );
    return moderator.length === 0 ? '' : moderator[0].emoji;
  },
  emojisFreeToSet(state) {
    const chosenEmojis = state.activeMembers.map(member => member.emoji);
    const filtered = [];
    for (let i = 0; i < state.initialEmojis.length; i += 1) {
      if (
        !chosenEmojis.includes(String.fromCodePoint(state.initialEmojis[i]))
      ) {
        filtered.push(state.initialEmojis[i]);
      }
    }
    return filtered;
  },
  chatState(state) {
    return state.isChatTurnedOn;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
