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
            <loading-animation  v-if="loading" />
            <template v-else>
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
            </template>
          </div>
    </div>
    <members-list :isBottom="true"></members-list>
    <message-box></message-box>
  </main>
</template>

<script>
import MessageBox from '../components/MessageBox';
import MembersList from '../components/MembersList';
import HeaderPanel from '../components/HeaderPanel';
import PlaylistItem from '../components/PlaylistItem';
import CreatePlaylist from '../components/CreatePlaylist';
import LoadingAnimation from '../components/LoadingAnimation';

export default {
  name: 'MainPage',
  components: {
    MessageBox,
    MembersList,
    HeaderPanel,
    PlaylistItem,
    CreatePlaylist,
    LoadingAnimation,
  },
  data() {
    return {
      errMsg: '',
      successMsg: '',
      loading: false,
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
        this.loading = true;
        await this.$store.dispatch('playlist/getPlaylists');
      } catch (err) {
        this.errMsg = err.message || err.response.data.message;
      } finally {
        this.loading = false;
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
