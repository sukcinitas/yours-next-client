<template>
  <div>
    <video-player
      :initial-playlist="initialPlaylist"
      :now-playing-video-index="index"
    >
    </video-player>
    <video-items-data
      :initial-playlist="initialPlaylist"
      :now-playing-video-index="index"
    >
    </video-items-data>
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer';
import VideoItemsData from './VideoItemsData';

export default {
  name: 'MainPlaylist',
  components: { VideoPlayer, VideoItemsData },
  data() {
    return {};
  },
  computed: {
    initialPlaylist() {
      return this.$store.state.mainplaylist.idsArray;
    },
    index() {
      return this.$store.state.mainplaylist.nowPlayingVideoIndex;
    },
  },
};
</script>
