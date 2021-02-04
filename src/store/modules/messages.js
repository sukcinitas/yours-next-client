/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unreachable */
/* eslint-disable no-shadow */

// initial state
const state = () => ({
  messages: [],
  messageEmojis: ['😀', '😍', '🤣', '🍕', '👿', '🤘', '😑', '🌈', '🎶', '🍸'],
  isChatTurnedOn: false,
});

// actions
const actions = {
  SOCKET_sendMessage({ commit }, { member, message }) {
    commit('setMessage', { message, member });
  },
};

// mutations
const mutations = {
  setMessage(state, { message, member }) {
    state.messages = [
      ...state.messages,
      { message, member },
    ];
  },
  setMessages(state, { messages }) {
    state.messages = messages;
  },
  setChatState(state) {
    state.isChatTurnedOn = !state.isChatTurnedOn;
  },
};

// getters
const getters = {
  chatState(state) {
    return state.isChatTurnedOn;
  },
  messages(state) {
    return state.messages;
  },
  messageEmojis(state) {
    return state.messageEmojis;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
