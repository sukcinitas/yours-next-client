/* eslint-disable no-shadow */
// initial state
const state = () => ({
  idsArray: ['M9Uy0opVF3s', '1votJ49ILSk', 'X23G5K-Dyrc'],
  nowPlayingVideoIndex: 0,
});

// mutations
const mutations = {
  changeNowPlayingVideoIndex(state, index) {
    state.nowPlayingVideoIndex = index;
  },
  addId(state, videoId) {
    if (state.idsArray.includes(videoId)) {
      return;
    }
    state.idsArray.push(videoId);
  },
  setPlaylist(state, playlist) {
    state.idsArray = playlist;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
