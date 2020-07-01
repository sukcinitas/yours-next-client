<template>
<div>
  <youtube
    :video-id="videoId"
    :player-vars="playerVars"
    ref="youtube"
    @ended="ended"
  >
  </youtube>
</div>

</template>
<script>
export default {
  name: 'VideoPlayer',
  data() {
    return {
      playerVars: {
        autoplay: 1,
        color: 'white',
      },
    };
  },
  computed: {
    index() {
      return this.$store.state.mainplaylist.nowPlayingVideoIndex;
    },
    videoId() {
      return this.playlist[this.index];
    },
    playlist() {
      return this.$store.state.mainplaylist.idsArray;
    },
  },
  methods: {
    async ended() {
      this.end();
    },
    end() {
      this.$store.dispatch('mainplaylist/removeItemsFromPlaylist');
      if (this.index === this.playlist.length - 1) {
        return;
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index + 1);
    },
  },
  beforeDestroy() {
    this.$store.dispatch('mainplaylist/removeItemsFromPlaylist', { id: this.$store.state.mainplaylist.id });
  },
};
</script>
