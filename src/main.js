/* eslint-disable no-console */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueYoutube from 'vue-youtube';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStepForward, faStepBackward, faPause, faPlay,
  faAngleDoubleUp, faAngleDoubleDown, faAngleDoubleLeft, faAngleDoubleRight, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import store from './store';
import App from './App';
import router from './router';

library.add(faStepForward, faStepBackward, faPause, faPlay, faWindowClose,
  faAngleDoubleUp, faAngleDoubleDown, faAngleDoubleLeft, faAngleDoubleRight);

Vue.use(VueYoutube);
Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO(location.hostname === 'infinite-woodland-46117.herokuapp.com' ? `http://infinite-woodland-46117.herokuapp.com/#/:${location.port}` : 'http://localhost:8081'),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
  options: { path: '/' },
}));
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
