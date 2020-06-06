import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '../components/MainPage';
import MainPlaylist from '../components/MainPlaylist';
import SearchField from '../components/SearchField';
import EntrancePage from '../components/EntrancePage';
import MemberCreate from '../components/MemberCreate';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/main',
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
    {
      path: '/',
      name: 'EntrancePage',
      component: EntrancePage,
    },
    {
      path: '/member',
      name: 'MemberCreate',
      component: MemberCreate,
    },
  ],
});
