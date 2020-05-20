/* eslint-disable no-shadow */
// initial state
const state = () => ({
  name: '',
});

// mutations
const mutations = {
  setName(state, name) {
    state.name = name;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
