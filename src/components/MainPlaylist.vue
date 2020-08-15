<template>
  <div class="main-playlist">
    <button @click="goBack" class="main-playlist__button--back">Back</button>
    <button @click="goHome" class="main-playlist__button--home">Home</button>
    <h4 class="main-playlist__title--ongoing">{{title}}</h4>
    <button
      v-if="isModerator"
      class="main-playlist__button"
      @click="gotToSearch"
    >Add some videos!
    </button>
    <ongoing-video-player
      class="main-playlist__video-player"
      v-if="initialPlaylistLength !== 0"
    >
    </ongoing-video-player>
    <video-items-data
      :isOngoing="true"
      class="main-playlist__video-items"
      v-if="initialPlaylistLength !== 0"
    ></video-items-data>
    <members-list :isBottom="false"></members-list>
  </div>
</template>

<script>
import OngoingVideoPlayer from './OngoingVideoPlayer';
import VideoItemsData from './VideoItemsData';
import MembersList from './MembersList';

export default {
  name: 'MainPlaylist',
  components: { OngoingVideoPlayer, VideoItemsData, MembersList },
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
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/main-playlist.scss';
</style>
