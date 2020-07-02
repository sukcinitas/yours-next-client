<template>
  <div>
    <p @click="gotToSearch">Add some videos!</p>
    <button v-if="isModerator" @click="makePlaylistMain">Make main</button>
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
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
  },
  methods: {
    gotToSearch() {
      this.$router.push({ name: 'SearchField' });
    },
    makePlaylistMain() {
      this.$socket.emit('setOngoingPlaylist', { id: this.$store.state.mainplaylist.id });
    },
  },
};
</script>
