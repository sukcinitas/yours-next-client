<template>
  <div>
    <video-player v-if="initialPlaylist.length !== 0"
      :initial-playlist="initialPlaylist"
      :now-playing-video-index="index"
    >
    </video-player>
    <video-items-data v-if="initialPlaylist.length !== 0"
      :initial-playlist="initialPlaylist"
      :now-playing-video-index="index"
    >
    </video-items-data>
    <p
      v-if="initialPlaylist.length === 0"
      @click="gotToSearch"
    >
      Add some videos!
    </p>
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
  methods: {
    gotToSearch() {
      this.$router.push({ name: 'SearchField' });
    },
  },
};
</script>
