<template>
<div>
  <youtube
    :video-id="videoId"
    :player-vars="playerVars"
    ref="youtube"
    @ended="ended"
    @playing="playing"
    @paused="paused"
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
        controls: 1,
      },
      message: '',
    };
  },
  computed: {
    index() {
      if (this.$store.getters['group/isMainAnOngoingPlaylist']) {
        return this.$store.state.group.ongoingPlaylist.videoIndex;
      }
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
    async playing() {
      // eslint-disable-next-line no-console
      this.message = 'p';
    },
    async paused() {
      // eslint-disable-next-line no-console
      this.message = 'paused';
    },
    end() {
      this.$store.dispatch('mainplaylist/removeItemsFromPlaylist');
      if (this.index === this.playlist.length - 1) {
        return;
      }
      if (!this.$store.getters['group/isModerator'] && this.$store.getters['group/isMainAnOngoingPlaylist']) {
        this.$socket.emit('group/ongoingPlaylistVideoIndex', this.index + 1);
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index + 1);
    },
  },
  beforeDestroy() {
    this.$store.dispatch('mainplaylist/removeItemsFromPlaylist', { id: this.$store.state.mainplaylist.id });
  },
  mounted() {
    if (!this.$store.getters['group/isModerator'] && this.$store.getters['group/isMainAnOngoingPlaylist']) {
      this.playerVars.controls = 0;
      this.$refs.youtube.player.mute();
    }
  },
};
</script>
