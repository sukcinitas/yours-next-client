<template>
  <div>
    <p @click="gotToSearch">Add some videos!</p>
    <video-player v-if="initialPlaylistLength !== 0"></video-player>
    <video-items-data v-if="initialPlaylistLength !== 0"></video-items-data>
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
