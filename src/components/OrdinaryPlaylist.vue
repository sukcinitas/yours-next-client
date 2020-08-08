<template>
  <div class="main-playlist">
    <button @click="goHome" class="main-playlist__button--home">Home</button>
    <h4 class="main-playlist__title">{{title}}</h4>
    <button
      class="main-playlist__button"
      @click="gotToSearch"
    >Add some videos!
    </button>
    <ordinary-video-player
      class="main-playlist__video-player"
      v-if="initialPlaylistLength !== 0"
    >
    </ordinary-video-player>
    <video-items-data
      class="main-playlist__video-items"
      v-if="initialPlaylistLength !== 0"
    ></video-items-data>
    <members-list :isBottom="false"></members-list>
  </div>
</template>

<script>
import OrdinaryVideoPlayer from './OrdinaryVideoPlayer';
import VideoItemsData from './VideoItemsData';
import MembersList from './MembersList';

export default {
  name: 'OrdinaryPlaylist',
  components: { OrdinaryVideoPlayer, VideoItemsData, MembersList },
  data() {
    return {
    };
  },
  computed: {
    initialPlaylistLength() {
      return this.$store.state.mainplaylist.idsArray.length;
    },
    title() {
      return this.$store.state.mainplaylist.title;
    },
  },
  methods: {
    gotToSearch() {
      this.$router.push({ name: 'SearchField' });
    },
    goHome() {
      this.$router.push({ name: 'MainPage' });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/main-playlist.scss';
</style>
