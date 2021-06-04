import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '../pages/MainPage';
import MainPlaylist from '../pages/MainPlaylist';
import OrdinaryPlaylist from '../pages/OrdinaryPlaylist';
import SearchField from '../pages/SearchField';
import EntrancePage from '../pages/EntrancePage';
import GroupService from '../services/group.service';
import store from '../store';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/main',
      name: 'MainPage',
      component: MainPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/mainplaylist/:id',
      name: 'MainPlaylist',
      component: MainPlaylist,
      meta: { requiresAuth: true },
    },
    {
      path: '/playlist/:id',
      name: 'OrdinaryPlaylist',
      component: OrdinaryPlaylist,
      meta: { requiresAuth: true },
    },
    {
      path: '/search/:id',
      name: 'SearchField',
      component: SearchField,
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'EntrancePage',
      component: EntrancePage,
      meta: { alreadyAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const username = sessionStorage.getItem('username');
    const userEmoji = sessionStorage.getItem('userEmoji');
    GroupService.isLoggedIn().then((data) => {
      if (
        !data.group &&
        !username &&
        !userEmoji &&
        !store.state.group.name &&
        !store.state.group.member.name &&
        !store.state.group.member.emoji
      ) {
        next({ name: 'EntrancePage' });
      } else if (store.state.group.name && !store.state.group.member.name) {
        next({ name: 'MemberCreate' });
      } else {
        next();
      }
    });
  } else if (to.matched.some(record => record.meta.alreadyAuth)) {
    const username = sessionStorage.getItem('username');
    const userEmoji = sessionStorage.getItem('userEmoji');
    GroupService.isLoggedIn().then((data) => {
      if (
        data.data.group &&
        username &&
        userEmoji &&
        store.state.group.name &&
        store.state.group.member.name &&
        store.state.group.member.emoji
      ) {
        next({ name: 'MainPage' });
      } else {
        next();
      }
    });
  } 
  else {
    next();
  }
});

export default router;
