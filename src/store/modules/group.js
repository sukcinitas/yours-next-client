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
  moderator: '',
  initialEmojis: [
    0x1f429,
    0x1f408,
    0x1f98e,
    0x1f98a,
    0x1f43a,
    0x1F98B,
    0x1F6C0,
    0x1F338,
    0x1F480,
    0x1f987,
    0x1f419,
    0x1f483,
    0x1f984,
    0x1f996,
    0x1F574,
    0x1f409,
    0x1f988,
    0x1f985,
    0x1f415,
    0x1f9dc,
  ],
});

const persist = async (commit) => {
  try {
    const { data } = await GroupService.isLoggedIn();
    if (data.success) {
      const group = data.group;
      const username = sessionStorage.getItem('username');
      const userEmoji = sessionStorage.getItem('userEmoji');
      if (!group || !username || !userEmoji) {
        return;
      }
      commit('setName', { name: group });
      vue.$socket.emit('getInitialState', { name: group });
      vue.$socket.emit('setMember', { name: username, emoji: userEmoji }); // only this socket
      commit('setMember', { name: username, emoji: userEmoji });
      vue.$socket.emit('addMember', { name: username, emoji: userEmoji });
    }
  } catch (err) {
    console.log(err);
  }
};

// actions
const actions = {
  async authenticate({ commit }, payload) {
    try {
      await GroupService.authenticate(payload);
      commit('setName', { name: payload.name });
      vue.$socket.connect();
      vue.$socket.emit('getInitialState', { name: payload.name });
      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  async createGroup({ commit }, payload) {
    try {
      await GroupService.create(payload);
      commit('setName', { name: payload.name });
      vue.$socket.connect();
      vue.$socket.emit('getInitialState', { name: payload.name });
      return { success: true };
    } catch (err) {
      throw err;
    }
  },

  addMember({ commit }, payload) {
    const { name, emoji } = payload;
    vue.$socket.emit('setMember', {
      name,
      emoji,
    }); // only this socket
    sessionStorage.setItem('username', name);
    sessionStorage.setItem('userEmoji', emoji);
    commit('setMember', { name, emoji });
    vue.$socket.emit('addMember', { name, emoji });
  },

  async resetState({ commit }) {
    try {
      sessionStorage.clear();
      vue.$socket.disconnect();
      commit('messages/setMessages', { messages: [] }, { root: true });
      await GroupService.logout();
      commit('resetState');
    } catch (err) {
      throw err;
    }
  },

  SOCKET_connect({ commit }) {
    persist(commit);
  },

  SOCKET_reconnecting({ commit }) {
    persist(commit);
  },

  SOCKET_setInitialState({ commit }, payload) {
    commit('setInitialState', payload.group);
    commit('messages/setMessages', { messages: payload.group.messages }, { root: true });
    commit('mainplaylist/setOngoingPlaylist', payload.group.ongoingPlaylist, {
      root: true,
    });
  },

  SOCKET_setModerator({ commit }, payload) {
    commit('setModerator', { name: payload.name });
  },

  SOCKET_addMember({ commit }, payload) {
    commit('setActiveMembers', { name: payload.name, emoji: payload.emoji });
  },

  SOCKET_setMember({ commit }, payload) {
    // only to this socket
    commit('setMember', { name: payload.name, emoji: payload.emoji });
  },

  SOCKET_removeMember({ commit }, payload) {
    commit('removeMember', { name: payload.client });
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
  removeMember(state, payload) {
    state.activeMembers = state.activeMembers.filter(
      member => member.name !== payload.name,
    );
  },
  setInitialState(state, payload) {
    state.activeMembers = payload.activeMembers;
    state.moderator = payload.moderator;
  },
  resetState(state) {
    state.activeMembers = [];
    state.name = '';
    state.member = {
      name: '',
      emoji: '',
    };
    state.moderator = '';
    state.isChatTurnedOf = false;
  },
};

// getters
const getters = {
  name(state) {
    return state.name;
  },
  member(state) {
    return state.member;
  },
  moderator(state) {
    return state.moderator;
  },
  activeMembers(state) {
    return state.activeMembers;
  },
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
    return filtered.map(emoji =>
      String.fromCodePoint(emoji));
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
