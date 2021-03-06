/* eslint-disable no-console */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueYoutube from 'vue-youtube';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faStepForward,
  faStepBackward,
  faPause,
  faPlay,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faWindowClose,
  faPlus,
  faMinus,
  faSquare,
  faCheck,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import store from './store';
import App from './App';
import router from './router';

library.add(
  faStepForward,
  faStepBackward,
  faPause,
  faPlay,
  faWindowClose,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faMinus,
  faSquare,
  faCheck,
  faTrash,
);

Vue.use(VueYoutube);
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO(
      location.hostname === 'yours-next.herokuapp.com'
        ? `http://yours-next.herokuapp.com/#/:${location.port}`
        : 'http://localhost:8081',
    ),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
    options: { path: '/' },
  }),
);
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
