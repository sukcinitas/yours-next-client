<template>
  <div class="main-playlist">
    <button
      class="main-playlist__button"
      @click="gotToSearch"
    >Add some videos!
    </button>
    <video-player
      class="main-playlist__video-player"
      v-if="initialPlaylistLength !== 0"
    >
    </video-player>
    <video-items-data
      class="main-playlist__video-items"
      v-if="initialPlaylistLength !== 0"
    ></video-items-data>
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer';
import VideoItemsData from './VideoItemsData';

export default {
  name: 'MainPlaylist',
  components: { VideoPlayer, VideoItemsData },
  data() {
    return {
    };
  },
  computed: {
    initialPlaylistLength() {
      return this.$store.state.mainplaylist.idsArray.length;
    },
  },
  methods: {
    gotToSearch() {
      this.$router.push({ name: 'SearchField' });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/main-playlist.scss';
</style>
