import Vue from 'vue';
import Vuex from 'vuex';
import mainplaylist from './modules/mainplaylist';
import group from './modules/group';
import playlist from './modules/playlist';
import messages from './modules/messages';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    mainplaylist,
    group,
    playlist,
    messages,
  },
  strict: debug,
});
