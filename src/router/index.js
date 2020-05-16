import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '../components/MainPage';
import MainPlaylist from '../components/MainPlaylist';
import SearchField from '../components/SearchField';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage,
    },
    {
      path: '/mainplaylist',
      name: 'MainPlaylist',
      component: MainPlaylist,
    },
    {
      path: '/search',
      name: 'SearchField',
      component: SearchField,
    },
  ],
});
