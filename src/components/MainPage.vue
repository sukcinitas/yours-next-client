<template>
  <main class="main">
    <headerPanel
      :leaveBtn="true"
      :homeBtn="false"
      :backBtn="false"
    ></headerPanel>
    <div class="playlists">
      <h2 class="playlists__heading">
        Playlists
        <span class="playlists__heading-detail">of group {{ group }} </span>
      </h2>
      <create-playlist />
      <div class="playlists__list">
        <div class="playlists__playlist--ongoing" v-if="ongoingPlaylistId">
          <button
            class="playlists__name--ongoing"
            @click="goToOngoingPlaylist(ongoingPlaylistId)"
          >
            Ongoing playlist
          </button>
        </div>
        <playlist-item
          v-for="playlist in playlists"
          :key="playlist.title"
          :playlist="playlist"
        />
        <p v-if="errMsg" class="playlists__message--error">{{ errMsg }}</p>
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
      return this.$store.getters['playlist/playlists'];
    },
    isMainAnOngoingPlaylist() {
      return this.$store.getters['mainplaylist/isMainAnOngoingPlaylist'];
    },
    ongoingPlaylistId() {
      return this.$store.getters['mainplaylist/ongoingPlaylist'].id;
    },
    group() {
      return this.$store.getters['group/name'];
    },
  },
  methods: {
    async getPlaylists() {
      try {
        await this.$store.dispatch('playlist/getPlaylists');
      } catch (err) {
        this.errMsg = err.message || err.response.data.message;
      }
    },

    async goToOngoingPlaylist() {
      this.$router.push({ path: `/mainplaylist/${this.ongoingPlaylistId}` });
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
