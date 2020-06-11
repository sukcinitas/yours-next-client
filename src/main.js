/* eslint-disable no-console */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueYoutube from 'vue-youtube';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import store from './store';
import App from './App';
import router from './router';

Vue.use(VueYoutube);
Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO(process.env.PORT || 'http://localhost:8081'),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
  options: { path: '/' }, // Optional options
}));
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
