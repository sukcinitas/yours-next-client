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
      items: [],
    };
  },
  props: {
    initialPlaylist: Array,
    nowPlayingVideoIndex: Number,
  },
  computed: {
    index() {
      return this.nowPlayingVideoIndex;
    },
    videoId() {
      return this.playlist[this.index];
    },
    playlist() {
      return this.initialPlaylist;
    },
  },
  methods: {
    async ended() {
      this.end();
    },
    end() {
      this.$store.dispatch('mainplaylist/removeItemsFromPlaylist', { id: this.$store.state.mainplaylist.id });
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
