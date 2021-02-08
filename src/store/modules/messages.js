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
    if (state.messages.length === 0) {
      state.messages = [
        ...state.messages,
        { message: [message], member },
      ];
      return;
    }

    let lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.member.name === member.name &&
        lastMessage.member.emoji === member.emoji) {
      const messages = [...state.messages];
      lastMessage = { member, message: [...lastMessage.message, message] };
      messages[messages.length - 1] = lastMessage;
      state.messages = [
        ...messages,
      ];
      return;
    }

    state.messages = [
      ...state.messages,
      { message: [message], member },
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
