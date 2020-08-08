import Vue from 'vue';
import Router from 'vue-router';
import MainPage from '../components/MainPage';
import MainPlaylist from '../components/MainPlaylist';
import OrdinaryPlaylist from '../components/OrdinaryPlaylist';
import SearchField from '../components/SearchField';
import EntrancePage from '../components/EntrancePage';
import MemberCreate from '../components/MemberCreate';
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
      path: '/mainplaylist',
      name: 'MainPlaylist',
      component: MainPlaylist,
      meta: { requiresAuth: true },
    },
    {
      path: '/playlist',
      name: 'OrdinaryPlaylist',
      component: OrdinaryPlaylist,
      meta: { requiresAuth: true },
    },
    {
      path: '/search',
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
    {
      path: '/member',
      name: 'MemberCreate',
      component: MemberCreate,
      meta: { requiresThings: true },
      from: 'EntrancePage',
      to: 'MainPage',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.group.name && !store.state.group.member.name
      && !store.state.group.member.emoji) {
      next({ name: 'EntrancePage' });
    } else if (store.state.group.name && !store.state.group.member.name) {
      next({ name: 'MemberCreate' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.alreadyAuth)) {
    if (store.state.group.name) {
      next({ name: 'MainPage' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresThings)) {
    if (!store.state.group.name) {
      next({ name: 'EntrancePage' });
    } else if (store.state.group.name && store.state.group.member.name) {
      next({ name: 'MainPage' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

