<template>
  <main class="main">
    <headerPanel :leaveBtn="true" :homeBtn="false" :backBtn="false"></headerPanel>
    <div class="playlists">
      <!-- <h2 class="playlists__heading">Playlists of group {{group}}</h2> -->
            <h2 class="playlists__heading">Playlists<span
            class="playlists__heading-detail">of group {{group}}</span></h2>
      <div class="playlists__list">
          <div class="playlists__playlist--ongoing" v-if="ongoingPlaylistId">
            <button
            class="playlists__name--ongoing"
            @click="goToOngoingPlaylist(ongoingPlaylistId)">Ongoing playlist
            </button>
        </div>
        <div v-for="playlist in playlists" :key="playlist.title" class="playlists__playlist">
            <button
            class="playlists__name"
            @click="goToPlaylist(playlist._id)">{{playlist.title}}
              <span  v-if="isModerator" class="playlists__remove-button"
              @click.stop="deletePlaylist(playlist._id)">
                <font-awesome-icon :icon="['fas', 'window-close']"></font-awesome-icon>
              </span>
            </button>
        </div>
      </div>
      <p v-if="errMsg" class="playlists__message--error">{{errMsg}}</p>
      <p v-if="successMsg" class="playlists__message--success">{{successMsg}}</p>
      <button
          v-if="!isExtended"
          class="create-playlist-form__button--small"
          @click="toggleExtended"
          type="button"
        >+
      </button>
      <form
        class="create-playlist-form"
        @submit.prevent="addPlaylist" v-show="isExtended"
      >
        <input
          type="text"
          v-model="title"
          class="create-playlist-form__input"
        >
        <button
          class="create-playlist-form__button"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
    <members-list :isBottom="true"></members-list>
    <message-box></message-box>
  </main>
</template>

<script>
import MessageBox from './MessageBox';
import MembersList from './MembersList';
import HeaderPanel from './HeaderPanel';
import formatDate from '../util/formatDate';

export default {
  name: 'MainPage',
  components: {
    MessageBox,
    MembersList,
    HeaderPanel,
  },
  data() {
    return {
      isExtended: false,
      title: '',
      errMsg: '',
      successMsg: '',
    };
  },
  created() {
    return this.getPlaylists();
  },
  computed: {
    playlists() {
      return this.$store.state.playlist.playlists;
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    moderator() {
      return this.$store.state.group.moderator;
    },
    isMessagesTurnedOff() {
      return this.$store.getters['group/chatState'];
    },
    isMainAnOngoingPlaylist() {
      return this.$store.getters['mainplaylist/isMainAnOngoingPlaylist'];
    },
    ongoingPlaylistId() {
      return this.$store.state.mainplaylist.ongoingPlaylist.id;
    },
    group() {
      return this.$store.state.group.name;
    },
  },
  methods: {
    toggleExtended() {
      this.isExtended = !this.isExtended;
    },
    async getPlaylists() {
      this.$store.dispatch('playlist/getPlaylists')
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
          }
        });
    },
    async addPlaylist() {
      this.$store.dispatch('playlist/addPlaylist', { title: this.title })
        .then((result) => {
          if (result.success) {
            this.errMsg = '';
            this.successMsg = result.successMsg;
            this.$store.dispatch('mainplaylist/getPlaylist', { id: result.id });
            setTimeout(() => this.$router.push({ path: '/playlist' }), 250);
            this.isExtended = false;
          } else {
            this.successMsg = '';
            this.errMsg = result.errMsg;
          }
        });
    },
    async goToPlaylist(id) {
      this.$store.commit('mainplaylist/setId', { id });
      this.$store.dispatch('mainplaylist/getPlaylist', { id })
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
            return;
          }
          this.$router.push({ path: '/playlist' });
        });
    },
    async goToOngoingPlaylist(id) {
      this.$store.commit('mainplaylist/setId', { id });
      this.$store.dispatch('mainplaylist/getPlaylist', { id })
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
            return;
          }
          this.$router.push({ path: '/mainplaylist' });
        });
    },
    async deletePlaylist(id) {
      this.$store.dispatch('playlist/deletePlaylist', { id })
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
          } else {
            this.successMsg = result.successMsg;
            setTimeout(() => {
              this.successMsg = '';
            }, 750);
            this.$socket.emit('updatePlaylists', { playlists: result.playlists });
          }
        });
    },
    toggleMessages() {
      this.$store.commit('group/setChatState', { state: !this.isMessagesTurnedOff });
    },
    formatDate(date) {
      if (!date) {
        return '';
      }
      return `last updated on ${formatDate(date)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
  @import '@/scss/shared-styles-buttons.scss';
  @import '@/scss/main-page.scss';
  @import '@/scss/header-panel.scss';
</style>
