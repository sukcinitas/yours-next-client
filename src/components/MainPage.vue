<template>
  <main class="main">
    <headerPanel :leaveBtn="true" :homeBtn="false" :backBtn="false"></headerPanel>
    <div class="playlists">
      <h2 class="playlists__heading">Playlists
        <span
          class="playlists__heading-detail">of group {{group}}
        </span>
      </h2>
      <create-playlist />
      <div class="playlists__list">
        <div class="playlists__playlist--ongoing" v-if="ongoingPlaylistId">
          <button
          class="playlists__name--ongoing"
          @click="goToOngoingPlaylist(ongoingPlaylistId)">Ongoing playlist
          </button>
        </div>
        <playlist-item v-for="playlist in playlists" :key="playlist.title" :playlist="playlist" />
        <p v-if="errMsg" class="playlists__message--error">{{errMsg}}</p>
      </div>
    </div>
    <members-list :isBottom="true"></members-list>
    <message-box></message-box>
  </main>
</template>

<script>
import MessageBox from './MessageBox';
import MembersList from './MembersList';
import HeaderPanel from './HeaderPanel';
import PlaylistItem from './PlaylistItem';
import CreatePlaylist from './CreatePlaylist';

export default {
  name: 'MainPage',
  components: {
    MessageBox,
    MembersList,
    HeaderPanel,
    PlaylistItem,
    CreatePlaylist,
  },
  data() {
    return {
      errMsg: '',
      successMsg: '',
    };
  },
  mounted() {
    return this.getPlaylists();
  },
  computed: {
    playlists() {
      return this.$store.state.playlist.playlists;
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
    async getPlaylists() {
      this.$store.dispatch('playlist/getPlaylists')
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
          }
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
    toggleMessages() {
      this.$store.commit('group/setChatState', { state: !this.isMessagesTurnedOff });
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
