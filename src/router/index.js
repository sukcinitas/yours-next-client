import { createRouter, createWebHistory } from 'vue-router'

import EntranceView from '../views/EntranceView.vue';
import MainView from '../views/MainView.vue';
import MainPlaylistView from '../views/MainPlaylistView.vue';
import OrdinaryPlaylistView from '../views/OrdinaryPlaylistView.vue';
import SearchView from '../views/SearchView.vue';
import GroupService from '../services/group.service';
import { useGroupStore } from '../stores/group.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      name: 'MainView',
      component: MainView,
      meta: { requiresAuth: true },
    },
    {
      path: '/mainplaylist/:id',
      name: 'MainPlaylistView',
      component: MainPlaylistView,
      meta: { requiresAuth: true },
    },
    {
      path: '/playlist/:id',
      name: 'OrdinaryPlaylistView',
      component: OrdinaryPlaylistView,
      meta: { requiresAuth: true },
    },
    {
      path: '/search/:id',
      name: 'SearchView',
      component: SearchView,
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'EntranceView',
      component: EntranceView,
      meta: { alreadyAuth: true },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const groupStore =  useGroupStore()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const username = sessionStorage.getItem('username');
    const userEmoji = sessionStorage.getItem('userEmoji');
    GroupService.isLoggedIn().then((data) => {
      if (
        !data.group &&
        !username &&
        !userEmoji &&
        !groupStore.name &&
        !groupStore.member.name &&
        !groupStore.member.emoji
      ) {
        next({ name: 'EntranceView' });
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
        groupStore.name &&
        groupStore.member.name &&
        groupStore.member.emoji
      ) {
        next({ name: 'MainView' });
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
